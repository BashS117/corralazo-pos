import React, { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { collection, doc, deleteDoc, onSnapshot } from "firebase/firestore";
import { auth, db } from "../../firebase/firebase";

import LoginForm from "../LoginForm";
import LogoutButton from "../LogoutButton";
import ProductManager from "../ProductManager.jsx/ProductManager";

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
      await deleteDoc(doc(db, "mesas", String(id)));
      setMesaSeleccionada(null);
      alert(`Mesa ${id} completada`);
    } catch (error) {
      console.error(error);
      alert("Error al completar pedido");
    }
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
      {mesaSeleccionada && (
        <div className="mt-8 bg-white shadow-lg p-6 rounded-xl max-w-lg mx-auto border">
          <h2 className="text-2xl font-bold mb-4">
            Mesa {mesaSeleccionada.id}
          </h2>

          <p className="mb-3 text-gray-700">
            <strong>Nota:</strong> {mesaSeleccionada.nota || "Sin nota"}
          </p>

          <h3 className="font-semibold mb-2">Productos:</h3>
          <ul className="list-disc ml-5">
            {mesaSeleccionada.items?.map((item, i) => (
              <li key={i}>
                {item.name} — {item.quantity}
              </li>
            ))}
          </ul>

          <button
            onClick={() => handleComplete(mesaSeleccionada.id)}
            className="mt-6 bg-orange text-white px-4 py-2 rounded-lg w-full"
          >
            Completar y liberar mesa
          </button>
        </div>
      )}

      {/* =========================== PRODUCT MANAGER =========================== */}
      {view === "productos" && (
        <ProductManager />
      )}
    </div>
  );
};

export default AdminDashboard;
