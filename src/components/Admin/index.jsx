import React, { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { collection, doc, deleteDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { auth, db } from "../../firebase/firebase";
import { enviarPedido } from '../../firebase/firebase';

import LoginForm from "../LoginForm";
import LogoutButton from "../LogoutButton";
import ProductManager from "../ProductManager.jsx/ProductManager";
import Pedidos from "../Pedidos/Pedidos";

const TOTAL_MESAS = 12;

const AdminDashboard = () => {
  const [user, setUser] = useState(null);
  const [view, setView] = useState("mesas"); // mesas | productos
  const [mesas, setMesas] = useState([]); // contiene solo mesas ocupadas
  const [mesaSeleccionada, setMesaSeleccionada] = useState(null);

  const mesasOrden = mesas.reduce((acc, mesa, index) => {
    acc[mesa.id] = index + 1; // El orden inicia desde 1
    return acc;
  }, {});
  // Verifica login
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const mesaMasAntigua = mesas.length > 0 ? mesas[0].id : null;

  // Escucha cambios en las mesas en tiempo real
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "mesas"), (snapshot) => {
      const mesasActivas = snapshot.docs.map((d) => ({
        id: Number(d.id),
        ...d.data(),
      }));
        // Ordenar por fecha de llegada
    mesasActivas.sort((a, b) => (a.fecha || 0) - (b.fecha || 0));

    setMesas(mesasActivas);
  });


    return () => unsubscribe();
  }, []);

  // Completar pedido y liberar mesa
  const handleComplete = async (id) => {
    try {
      imprimirTicket()
       // Quitar id antes de enviar
    const { id: idMesa, ...pedidoSinId } = mesaSeleccionada;
    await enviarPedido(pedidoSinId);

      await deleteDoc(doc(db, "mesas", String(id)));
      setMesaSeleccionada(null);
      alert(`Mesa ${id} completada`);
    } catch (error) {
      console.error(error);
      alert("Error al completar pedido");
    }
  };
// ELIMINAR PRODUCTO en la vista de detalles de la mesa
  const eliminarItemDeMesa = async (idMesa, indexItem) => {
    try {
      const mesaRef = doc(db, "mesas", String(idMesa));
  
      // Obtener la mesa seleccionada
      const itemsActualizados = mesaSeleccionada.items.filter((_, i) => i !== indexItem);
  
      // Si después de eliminar no quedan productos, simplemente borra toda la mesa
      if (itemsActualizados.length === 0) {
        await deleteDoc(mesaRef);
        setMesaSeleccionada(null);
        return;
      }
  
     // Recalcular total actualizado
    const nuevoTotal = itemsActualizados.reduce((acc, item) => {
      return acc + item.price * item.quantity * 1000;
    }, 0);

    // Actualizar Firebase
    await updateDoc(mesaRef, {
      items: itemsActualizados,
      total: nuevoTotal
    });

    // Actualizar estado local
    setMesaSeleccionada(prev => ({
      ...prev,
      items: itemsActualizados,
      total: nuevoTotal
    }));
  
    } catch (error) {
      console.error("Error eliminando item:", error);
    }
  };
  

  const imprimirTicket = () => {
    const ticket = document.getElementById("ticket");
  
    if (!ticket) return;
  
    // Mostrar el ticket temporalmente
    ticket.style.display = "block";
  
    window.print();
  
    // Ocultar después de imprimir
    setTimeout(() => {
      ticket.style.display = "none";
    }, 300);
  };
  

  if (!user) return <LoginForm onLogin={setUser} />;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Panel de Cocina</h1>
        <LogoutButton />
      </div>

      {/* Navegación */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setView("mesas")}
          className={`px-4 py-2 rounded-lg font-semibold ${
            view === "mesas" 
              ? "bg-orange text-white" 
              : "bg-white shadow border"
          }`}
        >
          Mesas (Cocina)
        </button>

        <button
          onClick={() => setView("productos")}
          className={`px-4 py-2 rounded-lg font-semibold ${
            view === "productos" 
              ? "bg-orange text-white" 
              : "bg-white shadow border"
          }`}
        >
          Gestionar Productos
        </button>
        <button
          onClick={() => setView("pedidos")}
          className={`px-4 py-2 rounded-lg font-semibold ${
            view === "pedidos" 
              ? "bg-orange text-white" 
              : "bg-white shadow border"
          }`}
        >
         Pedidos
        </button>
      </div>

      {/* =========================== VISTA DE MESAS ============================ */}
      {view === "mesas" && (
        <div className="grid grid-cols-3 gap-4 max-w-4xl mx-auto">

          {[...Array(TOTAL_MESAS)].map((_, i) => {
            const idMesa = i + 1;
            const mesa = mesas.find((m) => m.id === idMesa);
            const ocupada = Boolean(mesa);

            return (
              <button
                key={idMesa}
                className={`relative p-6 rounded-xl text-xl font-bold shadow-lg border transition 
                  ${ocupada ? "bg-primary text-white" : "bg-green-500 text-white"}
                `}
                onClick={() => ocupada && setMesaSeleccionada(mesa)}
                disabled={!ocupada}
              >
                Mesa {idMesa}
            
                {/* Número de orden en la esquina */}
                {ocupada && mesaMasAntigua === idMesa && (
  <span className="absolute top-1 right-1 bg-black/70 text-white text-xs px-2 py-1 rounded">
    #1
  </span>
)}

              </button>
            );
            
          })}
        </div>
      )}

      {/* ==================== DETALLES DE MESA SELECCIONADA ==================== */}
      {mesaSeleccionada && view === "mesas" && (
        <div className="mt-8 bg-white shadow-lg p-6 rounded-xl max-w-lg mx-auto border">
          <h2 className="text-2xl font-bold mb-4">
            Mesa {mesaSeleccionada.id}
          </h2>

          <p className="mb-3 text-gray-700">
            <strong>Nota:</strong> {mesaSeleccionada.nota || "Sin nota"}
          </p>

          <h3 className="font-semibold mb-2">Productos:</h3>
          <ul className="ml-5 space-y-2">
            {mesaSeleccionada.items?.map((item, i) => (
              <li key={i} className="flex justify-between items-center">
         <span>
  {item.name} (V/U: ${item.price}) x {item.quantity} =  
  ${ (item.price * item.quantity*1000) }
</span>


                <button
                  onClick={() => eliminarItemDeMesa(mesaSeleccionada.id, i)}
                  className="bg-primary text-white text-xs px-2 py-1 rounded"
                >
                  X
                </button>
              </li>
            ))}
          </ul>

          <p className="mb-3 text-gray-700">
            <strong>Valor total:</strong> {mesaSeleccionada.total}
          </p>
          <p className="mb-3 text-gray-700">
          <strong>Mesero/a:</strong> {mesaSeleccionada.mesera}
          </p>

          {/* <button
            onClick={() => handleComplete(mesaSeleccionada.id)}
            className="mt-6 bg-orange text-white px-4 py-2 rounded-lg w-full"
          >
            Completar y liberar mesa
          </button> */}
          <button
            onClick={() => handleComplete(mesaSeleccionada.id)}
            className="mt-3 bg-orange text-white px-4 py-2 rounded-lg w-full"
          >
            Imprimir Ticket
          </button>

        </div>
      )}

      {/* TICKET OCULTO PARA IMPRESIÓN */}
<div id="ticket" style={{ display: "none" }}>
  {mesaSeleccionada && (
    <div style={{ width: "58mm", paddingLeft: "20px", fontSize: "21px" ,display: "flex", flexDirection: "column"}}>
      <strong style={{ textAlign: "center", marginBottom: "10px" }}>
        Ticket de Pedido
      </strong>

      <strong style={{textAlign: "left"}}>Productos:</strong>
      <ul style={{ paddingLeft: "5px", textAlign: "left", fontWeight:"bold"}}>
        {mesaSeleccionada.items?.map((item, i) => (
          <li  key={i}>
          {item.name} <br/>(V/U:${item.price}) x {item.quantity} =  ${item.price*item.quantity*1000} 
          <p>--------</p>
          </li>
        ))}
      </ul>

      <p style={{textAlign: "left", fontWeight:"bold"}}><strong>Valor total:</strong> ${mesaSeleccionada.total || 0}</p>
      <p style={{textAlign: "left"}}><strong>Mesa #:</strong> {mesaSeleccionada.id}</p>
      <p style={{textAlign: "left"}}><strong>Mesero/a:</strong> {mesaSeleccionada.mesera}</p>
      <p style={{textAlign: "left"}}><strong>Notas:</strong> {mesaSeleccionada.nota || "Ninguna"}</p>
    </div>
  )}
</div>


      {/* =========================== PRODUCT MANAGER =========================== */}
      {view === "productos" && (
        <ProductManager />
      )}
      {/* =========================== PEDIDOS =========================== */}
      {view === "pedidos" && (
        <Pedidos />
      )}
    </div>
  );
};

export default AdminDashboard;
