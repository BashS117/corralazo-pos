import React from 'react'
import { AppContext } from '../../Context/AppContext'
import { useContext } from 'react'
import BusinessStatus from '../BusinessStatus'

const Header = () => {
    const {setFilter}=useContext(AppContext)
  return (
    <header className='w-full text-white'>
        <div className='flex-col justify-between '>
            <div className='flex items-end gap-1'>
            {/* <figure>
                <img src="https://mir-s3-cdn-cf.behance.net/project_modules/disp/39ff23185580241.65887d5f1f855.png" alt="logo" />
            </figure> */}
            <h1 className='titlePage text-[2.8rem] text-orange'>Corralazo</h1>
            <BusinessStatus/>
            </div>
            <div className='w-[100%] mt-[10px] pl-[5px]'>
                {/* <p className='subtitle'>Comidas Rapidas</p> */}
                {/* <div className=' gap-1 flex justify-evenly items-end'>
                    <p className='text-[0.8rem] bg-orange rounded-sm px-1 text-white  '>Calle 5 #9-40 Corinto</p>
                    <p  className='text-[0.8rem]  bg-orange rounded-sm px-1 text-white '>Cel: 323 475 4284</p>
                </div> */}
                 {/* <ol className='text-[0.7rem] sm:flex-col flex md:justify-evenly  bg-white rounded-sm text-dark-gray mt-1'>
                    <li> * Elige categoría y escoge tu producto</li>
                    <li> * Envia tu pedido y espera tu domicilio</li>
                </ol> */}
            </div>
        </div>
        <input className='w-[85%] h-[30px] mt-2 py-1 pr-1 text-[1.4rem]' 
        onChange={(event) => setFilter(event.target.value.trim() || null)}
        placeholder='🔎 Busca tu comida aquí:'
        type="search" />
    </header>
  )
}

export default Header