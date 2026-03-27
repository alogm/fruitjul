// Importaciones de Firebase 10.11.0
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { getFirestore, collection, addDoc, doc, updateDoc, deleteDoc, onSnapshot, getDoc } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-storage.js";

// Configuración
const firebaseConfig = {
  apiKey: "AIzaSyC9d9assHWnIj2ltnrE2uj8g3QNq0xinUM",
  authDomain: "fruiijulss.firebaseapp.com",
  projectId: "fruiijulss",
  storageBucket: "fruiijulss.firebasestorage.app",
  messagingSenderId: "396975044878",
  appId: "1:396975044878:web:7ecfc5800fb1222c2a3f5f",
  measurementId: "G-7HXR0Q4LP6"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Inicializar iconos
lucide.createIcons();

// Referencias DOM
const loginView = document.getElementById('login-view');
const dashboardView = document.getElementById('dashboard-view');
const loginForm = document.getElementById('login-form');
const logoutBtn = document.getElementById('logout-btn');
const formSection = document.getElementById('form-section');
const productForm = document.getElementById('product-form');
const tableBody = document.getElementById('admin-products-table');

// 1. Sesión
onAuthStateChanged(auth, (user) => {
  if (user) {
    loginView.classList.add('hidden');
    dashboardView.classList.remove('hidden');
    cargarProductos();
  } else {
    loginView.classList.remove('hidden');
    dashboardView.classList.add('hidden');
  }
});

// 2. Login
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('admin-email').value;
  const password = document.getElementById('admin-password').value;
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    alert("Credenciales incorrectas");
  }
});

logoutBtn.addEventListener('click', () => signOut(auth));

// 3. UI Botones
document.getElementById('btn-nuevo-producto').addEventListener('click', () => {
  productForm.reset();
  document.getElementById('prod-id').value = '';
  document.getElementById('prod-old-img').value = '';
  document.getElementById('prod-img').required = true;
  formSection.classList.remove('hidden');
});

document.getElementById('btn-cancelar').addEventListener('click', () => {
  formSection.classList.add('hidden');
});

// 4. Guardar / Actualizar
productForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const btnGuardar = document.getElementById('btn-guardar');
  btnGuardar.textContent = "Guardando...";
  btnGuardar.disabled = true;

  try {
    const id = document.getElementById('prod-id').value;
    const oldImg = document.getElementById('prod-old-img').value;
    
    const data = {
      name: document.getElementById('prod-name').value,
      category: document.getElementById('prod-category').value,
      price: parseFloat(document.getElementById('prod-price').value),
      desc: document.getElementById('prod-desc').value,
      note: document.getElementById('prod-note').value
    };

    const fileInput = document.getElementById('prod-img');
    if (fileInput.files.length > 0) {
      const file = fileInput.files[0];
      const storageRef = ref(storage, `productos/${Date.now()}_${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      data.img = await getDownloadURL(snapshot.ref);
    } else {
      data.img = oldImg;
    }

    if (id) {
      await updateDoc(doc(db, "productos", id), data);
      alert("Actualizado correctamente");
    } else {
      await addDoc(collection(db, "productos"), data);
      alert("Guardado correctamente");
    }
    
    productForm.reset();
    formSection.classList.add('hidden');
  } catch (error) {
    alert("Error al guardar. Revisa tus reglas de Firebase.");
  } finally {
    btnGuardar.textContent = "Guardar";
    btnGuardar.disabled = false;
  }
});

// 5. Leer
function cargarProductos() {
  onSnapshot(collection(db, "productos"), (snapshot) => {
    tableBody.innerHTML = '';
    snapshot.forEach((docSnap) => {
      const p = docSnap.data();
      const tr = document.createElement('tr');
      tr.className = "border-b border-neutral-800";
      tr.innerHTML = `
        <td class="p-4"><img src="${p.img}" class="w-12 h-12 object-cover rounded-lg"></td>
        <td class="p-4 text-white">${p.name}</td>
        <td class="p-4 text-pink-400">$${p.price}</td>
        <td class="p-4 text-white">${p.desc}</td>
        <td class="p-4 text-white">${p.note}</td>
        <td class="p-4 text-right">
          <button onclick="window.editarProd('${docSnap.id}')" class="text-blue-400 mr-3">Editar</button>
          <button onclick="window.eliminarProd('${docSnap.id}')" class="text-red-400">Borrar</button>
        </td>
      `;
      tableBody.appendChild(tr);
    });
  });
}

// 6. Funciones globales
window.eliminarProd = async (id) => {
  if (confirm("¿Eliminar?")) await deleteDoc(doc(db, "productos", id));
};

window.editarProd = async (id) => {
  const docSnap = await getDoc(doc(db, "productos", id));
  if (docSnap.exists()) {
    const p = docSnap.data();
    document.getElementById('prod-id').value = docSnap.id;
    document.getElementById('prod-old-img').value = p.img;
    document.getElementById('prod-name').value = p.name;
    document.getElementById('prod-category').value = p.category;
    document.getElementById('prod-price').value = p.price;
    document.getElementById('prod-desc').value = p.desc;
    document.getElementById('prod-note').value = p.note;
    document.getElementById('prod-img').required = false;
    formSection.classList.remove('hidden');
    window.scrollTo(0,0);
  }
};