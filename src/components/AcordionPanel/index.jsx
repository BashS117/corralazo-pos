import { useContext,useState } from "react";
import { AppContext } from '../../Context/AppContext';

const AcordionPanel = ({ products, category, rightPanel }) => {
  const { state, dispatch, mostrarAlert } = useContext(AppContext);

  //funcion para agregar  un producto al carrito
  const addToCart = (product) => {
    const itemToAdd = {
      id: product.id,
      name: product.name,
      image: product.image,
      price: product.price,
      quantity: 1,
      //otras propiedades
    };
    //Despacho la accion  add_to_ cart con el item como payload
    dispatch({
      type: "ADD_TO_CART",
      payload: itemToAdd,
    });
    // Muestro una alerta al usuario
    mostrarAlert();
  };
  // Estado para controlar qué productos tienen la descripción visible
  const [showDescriptions, setShowDescriptions] = useState({});
  const toggleDescription = (productId) => {
    setShowDescriptions((prev) => ({
      ...prev,
      [productId]: !prev[productId], // Solo cambia el estado del producto clickeado
    }));
  };
  return (
    <div
      className={`${
        rightPanel
          ? "relative left-[-157%] md:left-[-154%]   "
          : "sm:left-[-5%] md:left-[-4%]"
      } p-4 bg-gray w-[101vw] mb-[10px] relative overflow-x-auto whitespace-nowrap scroll-smooth scrollbar-hidden ${
        state.panelOpen && state.selectedCategory === category
          ? "flex"
          : "hidden"
      }`}
    >
      <ul className="flex gap-4 w-max snap-x snap-mandatory">
        {products.map((product, index) => (
          <li
            key={index}
            className="p-4 shadow-md items-center rounded-lg flex flex-col bg-orange w-[250px] min-w-[250px] snap-center"
          >
            <figure>
              <img
                className="w-full h-40 rounded-md"
                src={product.image}
                alt={product.name}
              />
            </figure>
            <p className="font-bold text-lg text-white break-words whitespace-normal">{product.name}</p>
            <p className="font-bold text-dark-gray bg-white px-2 py-1 rounded">
              ${product.price}
            </p>
            <button
              className="text-dark-gray text-sm mt-2"
              onClick={() => toggleDescription(product.id)}
            >
              {showDescriptions[product.id] ? "Ver menos" : "Ver más"}
            </button>
            {showDescriptions[product.id] ? 
              <div className="mt-2 p-2 bg-gray-100 rounded-lg transition-all duration-300  w-full text-center break-words relative  ">
                <p className="text-gray-700 text-left break-words whitespace-normal">{product.description}</p>
              </div>
          :""}
            <button
              onClick={() => addToCart(product)}
              className="mt-2 bg-white p-2 text-primary shadow-md rounded-md hover:-translate-y-1 transition-all duration-300"
            >
              🛒Agregar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AcordionPanel;