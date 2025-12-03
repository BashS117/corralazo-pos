import React from 'react'
import { Link } from 'react-router-dom'
import OrderCart from '../OrderCart'
import { useContext } from "react";
import { AppContext } from '../../Context/AppContext';
import { enviarPedido,enviarPedidoaMesa } from '../../firebase/firebase';


const ShoppingCart = ({sum,mesa,setSelectedMesa,nota}) => {

  const {state,dispatch}=useContext(AppContext)

   // Crear objeto del pedido
   const crearPedido = () => ({
    fecha: new Date(),
    mesa: mesa,
    nota: nota,
    total: Number(sum)*1000,
    items: state.cart.map(item => ({
      id: item.id,
      name: item.name,
      quantity: item.quantity,
      price: item.price,
    }))
  });
  const emptyCart = (dispatch) => {
    dispatch({ type: 'EMPTY_CART' });
  };

  const handleCheckout = async () => {
    const pedido = crearPedido();

    // 1️⃣ Guardar en Firebase
    // await enviarPedido(pedido);
    await enviarPedidoaMesa(pedido);
    emptyCart(dispatch);
    setSelectedMesa("")
    alert("Pedido enviado exitosamente ✔️");

    }


  return (
    <div className='border text-white border-orange rounded-lg '>
        <div className='flex justify-between items-center p-6'>
          <h2 className='font-medium text-xl'>Tu pedido</h2>    
        </div>
    <div className='px-2 overflow-y-scroll flex-1'>
       
        {state.cart.map((productCart,index)=>(
      <OrderCart 
      key={index}
      id={productCart.id}
      name={productCart.name}
      // imageUrl={productCart.images}
      price={productCart.price}
      quantity={productCart.quantity}
      category={productCart.category}
      image={productCart.image}
      />
  ))}
  
    </div>

    <div className='px-6 mb-6'>
      <p className='flex justify-between items-center mb-2'> 
        <span className='font-light'>Total:</span>
        <span className='font-medium '> ${sum}</span>
      </p>
    
    
      <button className='w-full bg-orange py-3 text-white rounded-lg' 
      disabled={!mesa  || state.cart.length === 0}
      onClick={() => handleCheckout()}
      >
          <input type="submit" value='Enviar Orden' />
      </button>
    
    </div>
 
   
  </div>
  )
}

export default ShoppingCart