import React, { useState, useContext } from "react";
import { AppContext } from "../../Context/AppContext";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";

const ProductManager = () => {
  const { allProductsUpdated } = useContext(AppContext);
  const [editedPrices, setEditedPrices] = useState({});

  const handlePriceChange = (id, val) => {
    const price = parseFloat(val);
    if (!isNaN(price)) {
      setEditedPrices({ ...editedPrices, [id]: price });
    }
  };

  const handleSave = async (id, category) => {
    const newPrice = editedPrices[id];
    if (!newPrice) return alert("Ingrese un precio válido");

    try {
      await updateDoc(doc(db, "prices", String(id)), {
        price: newPrice,
      });

      alert(`Precio actualizado en categoría: ${category}`);
    } catch (err) {
      console.error(err);
      alert("Error al actualizar precio");
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6">Gestión de Productos</h2>

      {allProductsUpdated.map((category, idx) => (
        <div key={idx} className="mb-6 bg-white shadow p-4 rounded-xl">
          <h3 className="text-xl font-bold mb-4">{category.category}</h3>

          {category.products.map((p) => (
            <div
              key={p.id}
              className="flex justify-between items-center mb-3"
            >
              <p>{p.name}</p>

              <input
                type="number"
                className="border rounded p-2 w-24 text-right"
                value={editedPrices[p.id] ?? p.price}
                onChange={(e) => handlePriceChange(p.id, e.target.value)}
              />

              <button
                className="bg-orange text-white px-3 py-2 rounded"
                onClick={() => handleSave(p.id, category.category)}
              >
                Guardar
              </button>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default ProductManager;
