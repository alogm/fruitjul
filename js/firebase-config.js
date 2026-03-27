// Importamos las funciones necesarias desde el CDN oficial de Google (Versión 10.x)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-storage.js";

// Tus credenciales exactas
const firebaseConfig = {
  apiKey: "AIzaSyC9d9assHWnIj2ltnrE2uj8g3QNq0xinUM",
  authDomain: "fruiijulss.firebaseapp.com",
  projectId: "fruiijulss",
  storageBucket: "fruiijulss.firebasestorage.app",
  messagingSenderId: "396975044878",
  appId: "1:396975044878:web:7ecfc5800fb1222c2a3f5f",
  measurementId: "G-7HXR0Q4LP6"
};

// Inicializamos Firebase
const app = initializeApp(firebaseConfig);

// Inicializamos y exportamos los servicios que vamos a usar en el Panel
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);