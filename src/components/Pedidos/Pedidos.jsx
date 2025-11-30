// OrdersDashboard.jsx
import React, { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebase/firebase";

const OrdersDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [filterType, setFilterType] = useState("day");

  // 1️⃣ Cargar todos los pedidos al entrar
  useEffect(() => {
    const fetchOrders = async () => {
      const ref = collection(db, "pedidos");
      const snapshot = await getDocs(ref);

      const pedidos = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        fecha: doc.data().fecha.toDate(),
      }));

      setOrders(pedidos);
    };

    fetchOrders();
  }, []);

  // 2️⃣ Actualizar filtro cada vez que cambie filterType
  useEffect(() => {
    applyFilter(filterType);
  }, [filterType, orders]);

  // 3️⃣ Lógica de filtrado
  const applyFilter = (type) => {
    const now = new Date();

    let result = [];

    if (type === "day") {
      result = orders.filter((p) => {
        const f = p.fecha;
        return (
          f.getFullYear() === now.getFullYear() &&
          f.getMonth() === now.getMonth() &&
          f.getDate() === now.getDate()
        );
      });

      // Ordenar por hora (más antiguo primero)
      result.sort((a, b) => a.fecha - b.fecha);
    }

    if (type === "week") {
      const start = new Date(now);
      start.setDate(now.getDate() - 6); // últimos 7 días

      result = orders.filter((p) => p.fecha >= start && p.fecha <= now);

      // Ordenar por día (más antiguo primero)
      result.sort((a, b) => a.fecha - b.fecha);
    }

    if (type === "month") {
      const start = new Date(now.getFullYear(), now.getMonth(), 1);

      result = orders.filter((p) => p.fecha >= start && p.fecha <= now);

      // orden por día
      result.sort((a, b) => a.fecha - b.fecha);
    }

    if (type === "all") {
      result = [...orders].sort((a, b) => a.fecha - b.fecha); // más antiguo primero
    }

    setFiltered(result);
  };

  // 4️⃣ Agrupar por día (solo para semana y mes)
  const groupByDay = (orders) => {
    const groups = {};

    orders.forEach((order) => {
      const key = order.fecha.toLocaleDateString("es-CO", {
        weekday: "long",
        day: "2-digit",
        month: "2-digit",
      });

      if (!groups[key]) groups[key] = [];
      groups[key].push(order);
    });

    return groups;
  };

  const isGrouped = filterType === "week" || filterType === "month";

// BORRAR PEDIDOS: 
const handleDeleteAll = async () => {
    const confirmDelete = window.confirm(
      "⚠️ ¿Seguro que quieres BORRAR TODOS los pedidos? Esta acción no se puede deshacer."
    );
  
    if (!confirmDelete) return;
  
    try {
      const ref = collection(db, "pedidos");
      const snapshot = await getDocs(ref);
  
      const deletePromises = snapshot.docs.map((d) =>
        deleteDoc(doc(db, "pedidos", d.id))
      );
  
      await Promise.all(deletePromises);
  
      alert("✔ Todos los pedidos han sido eliminados.");
      setOrders([]); // vaciar estado para reflejarlo en pantalla
      setFiltered([]);
    } catch (error) {
      console.error("Error borrando pedidos:", error);
      alert("❌ Hubo un error al borrar los pedidos");
    }
  };
  

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4 text-white">📦 Pedidos</h1>

      {/* Filtros */}
      <div className="flex justify-between">
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setFilterType("day")}
          className={`px-4 py-2 rounded-lg ${
            filterType === "day" ? "bg-orange text-white" : "bg-white"
          }`}
        >
          Hoy
        </button>

        <button
          onClick={() => setFilterType("week")}
          className={`px-4 py-2 rounded-lg ${
            filterType === "week" ? "bg-orange text-white" : "bg-white"
          }`}
        >
          Esta semana
        </button>

        <button
          onClick={() => setFilterType("month")}
          className={`px-4 py-2 rounded-lg ${
            filterType === "month" ? "bg-orange text-white" : "bg-white"
          }`}
        >
          Este mes
        </button>

        <button
          onClick={() => setFilterType("all")}
          className={`px-4 py-2 rounded-lg ${
            filterType === "all" ? "bg-orange text-white" : "bg-white"
          }`}
        >
          Todos
        </button>
        </div>
        <button
  onClick={handleDeleteAll}
  className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-red-700 mb-6"
>
  🗑 Borrar todos los pedidos
</button>

      </div>

      {/* PEDIDOS */}

      {!isGrouped && (
        <div className="flex flex-col gap-4">
          {filtered.map((p) => (
            <OrderCard key={p.id} pedido={p} />
          ))}
        </div>
      )}

      {/* AGRUPADOS POR DÍA */}
      {isGrouped && (
        <div className="flex flex-col gap-6">
          {Object.entries(groupByDay(filtered)).map(([day, orders]) => (
            <div key={day}>
              <h2 className="text-xl font-bold text-orange mb-2">{day}</h2>

              <div className="flex flex-col gap-4">
                {orders.map((p) => (
                  <OrderCard key={p.id} pedido={p} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const OrderCard = ({ pedido }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
      <p className="font-bold text-lg">Mesa {pedido.mesa}</p>
      <p className="text-sm text-gray-500">
        {pedido.fecha.toLocaleString("es-CO")}
      </p>

      <p className="mt-2 font-semibold">Total: ${pedido.total}</p>

      <ul className="text-sm mt-2">
        {pedido.items.map((it, i) => (
          <li key={i}>
            • {it.quantity}x {it.name}
          </li>
        ))}
      </ul>

      {pedido.nota && (
        <p className="text-sm italic mt-2 text-gray-600">Nota: {pedido.nota}</p>
      )}
    </div>
  );
};

export default OrdersDashboard;
