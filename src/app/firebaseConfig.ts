// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getStorage } from "firebase/storage";

// Tu configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAn7wrBby7KhSh0X2h-Njak4v7cU8vEtbI",
  authDomain: "clubfyapp.firebaseapp.com",
  projectId: "clubfyapp",
  storageBucket: "clubfyapp.appspot.com",
  messagingSenderId: "907266981821",
  appId: "1:907266981821:web:1392edf2f8fb56e4b21cd4",
  measurementId: "G-HWJSEWQMKW",
};

// Inicializa Firebase solo si no está ya inicializado
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

// Inicializa Analytics solo si es compatible
let analytics;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

// Export the Firestore instance

const firebaseApp = initializeApp(firebaseConfig);
const storage = getStorage(firebaseApp);

export { db };
export { firebaseApp, storage };