import React from 'react'
import { useState,useContext,useEffect } from 'react'
import { AppContext } from '../../Context/AppContext'
import { useForm } from 'react-hook-form'
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase/firebase";

import ShoppingCart from '../shoppingCart'

const OrderForm = () => {
  const {register,formState:{errors}, handleSubmit}=useForm();

  const {state}=useContext(AppContext)
  

  let sum= 0;
  state.cart.forEach(element => sum += element.price*element.quantity*1000);
  sum = new Intl.NumberFormat("es-CO").format(Math.round(sum));

  //texto producto nombre y precio
  // const productNameandPrice = state.cart
  // .map((product) => `${product.name} %0A (V/U:  $${product.price}m) x *${product.quantity}*= $${product.price*product.quantity*1000},%0A`);
  // const productsText = productNameandPrice.join(' ');


  const [selectedOption, setSelectedOption] = useState('1');   // Mesa
  const [note, setNote] = useState("");                        // Nota
  const [mesasOcupadas, setMesasOcupadas] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "mesas"), (snapshot) => {
      const ids = snapshot.docs.map(doc => Number(doc.id));
      setMesasOcupadas(ids);
    });
  
    return () => unsub();
  }, []);
  
  // const handleSelectChange = (event) => {
  //   setSelectedOption(event.target.value);
    
  // };
  


  
  // const handleInputChange = (event) => {
  //   const { name, value } = event.target;
  //   setFormData((prevData) => {
  //     const updatedData = { ...prevData, [name]: value };
  //     localStorage.setItem("orderFormData", JSON.stringify(updatedData));
  //     return updatedData;
  //   });
  // };
  return (
    <div className='bg-[#000]/60 rounded-md w-[full] text-left mb-3'>
      <div className='flex flex-col  gap-1 mb-[10px]'>
           {/* MESA */}
          <label htmlFor="">Mesa:</label>
          <div className="grid grid-cols-4 gap-2">
  {[1,2,3,4,5,6,7,8,9,10,11,12].map((num) => {

    const ocupada = mesasOcupadas.includes(num);
    const seleccionada = selectedOption == num;

    return (
      <button
        key={num}
        type="button"
        onClick={() => !ocupada && setSelectedOption(num)} // no dejar seleccionar mesa ocupada
        className={`
          py-2 rounded-md border text-sm font-medium
          ${ocupada ? "bg-primary text-white border-red-700 cursor-not-allowed": seleccionada ? "bg-orange text-white border-orange"
              : "bg-green-500 text-white border-green-600"
          }
        `}
      >
        Mesa {num}
      </button>
    );
  })}
</div>

         {/* NOTA DEL PEDIDO */}
         <label className='mt-3'>Nota (opcional):</label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Ej: Sin cebolla, etc."
          className='text-black p-1 rounded'
        ></textarea>
      </div>

      <ShoppingCart sum={sum} mesa={selectedOption} nota={note}/>
     
    </div>
  )
}

export default OrderForm