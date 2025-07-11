// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAn7wrBby7KhSh0X2h-Njak4v7cU8vEtbI",
  authDomain: "clubfyapp.firebaseapp.com",
  projectId: "clubfyapp",
  storageBucket: "clubfyapp.firebasestorage.app",
  messagingSenderId: "907266981821",
  appId: "1:907266981821:web:1392edf2f8fb56e4b21cd4",
  measurementId: "G-HWJSEWQMKW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);