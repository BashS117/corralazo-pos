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



//ENVIAR EL PEDIDO
//   const onSubmit =(data)=>{
//     console.log('orderFormDATA:',data)
//     //texto del link para google Maps
// let googleMapsUrl = `*Google Map:* https://www.google.com/maps/place/${data.direccionprincipal}%2B${data.direccionuno}%2B%2523%2B${data.direcciondos}%2B-%2B${data.direcciontres},%2BCorinto%2BCauca`
// if(selectedOption==='Consumo Local'){
// googleMapsUrl='';
// }
//     //texto con el nombre y direccion y nota
//     // const customerNameandAdress =`________________ %0A*Entregar a*: ${data.nombre},%0A*Tipo de Pedido:* ${selectedOption},%0A*Dirección:* ${data.direccionprincipal} ${data.direccionuno} %23${data.direcciondos}-${data.direcciontres}, ${data.barrio} %0A${data.notas?`*Notas:* ${data.notas}`:''}`;

//     let customerNameandAdress = ``;

//     if (selectedOption === 'Domicilio') {
//       customerNameandAdress = `________________ %0A*Entregar a*: ${data.nombre},%0A*Tipo de Pedido:* ${selectedOption},%0A*Dirección:* ${data.direccionprincipal} ${data.direccionuno} %23${data.direcciondos}-${data.direcciontres}, ${data.barrio} %0A${data.notas?`*Notas:* ${data.notas}`:''}`;
//     } else {
//       customerNameandAdress = `________________ %0A*Entregar a*: ${data.nombre},%0A*Tipo de Pedido:* ${selectedOption},%0A ${data.notas?`*Notas:* ${data.notas}`:''}`;
//     }
    

//     //texto link a whatsapp
//     const whatsappUrl = `https://api.whatsapp.com/send?phone=573234754284&text=${googleMapsUrl} %0A*¡Nuevo Pedido!*🛵%0A Restaurante Corralazo %0A*Productos*: %0A ${productsText} %0A*Valor total:* $${sum} %0A ${customerNameandAdress} `;

//     window.location.href = whatsappUrl; // Redirigir a WhatsApp

//   }

  const [selectedOption, setSelectedOption] = useState('Domicilio');

  const handleSelectChange = (event) => {
    const value = event.target.value;
    setSelectedOption(value);
  };
  

  const [formData, setFormData] = useState(() => {
    const savedData = localStorage.getItem("orderFormData");
    return savedData ? JSON.parse(savedData) : {
      nombre: "",
      direccionprincipal: "Cra.",
      direccionuno: "",
      direcciondos: "",
      direcciontres: "",
      barrio: "",
      notas: "",
    };
  });
  
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
          <label htmlFor="">Mesa:</label>
         <select onChange={handleSelectChange} value={selectedOption} id=""
             >
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="7">7</option>
          <option value="8">8</option>
          <option value="9">9</option>
          <option value="10">10</option>
          <option value="11">11</option>
          <option value="12">12</option>
         </select>
      </div>

      <ShoppingCart sum={sum}/>
     
    </div>
  )
}

export default OrderForm