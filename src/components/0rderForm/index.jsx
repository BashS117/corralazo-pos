import React from 'react'
import { useState,useContext } from 'react'
import { AppContext } from '../../Context/AppContext'
import { useForm } from 'react-hook-form'
import ShoppingCart from '../shoppingCart'

const OrderForm = () => {
  const {register,formState:{errors}, handleSubmit}=useForm();

  const {state}=useContext(AppContext)

  let sum= 0;
  state.cart.forEach(element => sum += element.price*element.quantity*1000);
  sum = new Intl.NumberFormat("es-CO").format(Math.round(sum));

  //texto producto nombre y precio
  const productNameandPrice = state.cart
  .map((product) => `${product.name} %0A (V/U:  $${product.price}m) x *${product.quantity}*= $${product.price*product.quantity*1000},%0A`);
  const productsText = productNameandPrice.join(' ');


  const [selectedOption, setSelectedOption] = useState('1');   // Mesa
  const [note, setNote] = useState("");                        // Nota

  const handleSelectChange = (event) => {
    setSelectedOption(event.target.value);
    
  };
  


  
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => {
      const updatedData = { ...prevData, [name]: value };
      localStorage.setItem("orderFormData", JSON.stringify(updatedData));
      return updatedData;
    });
  };
  return (
    <div className='bg-[#000]/60 rounded-md w-[full] text-left mb-3'>
      <div className='flex flex-col  gap-1 mb-[10px]'>
           {/* MESA */}
          <label htmlFor="">Mesa:</label>
          <select onChange={handleSelectChange} value={selectedOption}>
          {Array.from({length: 12}, (_, i) => (
            <option key={i+1} value={i+1}>{i+1}</option>
          ))}
        </select>
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