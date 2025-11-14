// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore,addDoc,collection,setDoc, doc} from 'firebase/firestore';
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDYt5PIko4h39IjwgDjz0DZa6QlDZPnvLg",
  authDomain: "corralazo-752e7.firebaseapp.com",
  projectId: "corralazo-752e7",
  storageBucket: "corralazo-752e7.firebasestorage.app",
  messagingSenderId: "340442009377",
  appId: "1:340442009377:web:9231ec2979dee0ac17b860",
  measurementId: "G-KC27PKW2NP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);

//enviar pedido
 export const enviarPedido = async (pedidoData) => {
  console.log(pedidoData)
  try {
   return await addDoc(collection(db, "pedidos"), pedidoData);
    console.log("Pedido guardado con ID: ", docRef.id);
  } catch (error) {
    console.error("Error guardando pedido: ", error);
  }
};
