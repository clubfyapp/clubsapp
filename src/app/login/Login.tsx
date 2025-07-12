"use client";

// Import the Firebase modules
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "../firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";

const Login: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Consulta a Firestore para buscar el usuario por correo
      const usuariosCollection = collection(db, "usuarios");
      const q = query(usuariosCollection, where("email", "==", email));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setError("Invalid email or password");
        return;
      }

      // Obtén el usuario de la base de datos
      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data();

      // Verifica la contraseña como string
      if (password !== userData.password) {
        setError("Invalid email or password");
        return;
      }

      // Guarda el rol y el ID del usuario en localStorage
      localStorage.setItem("role", userData.rol);
      localStorage.setItem("userId", userDoc.id);

      if (userData.rol === "club") {
        localStorage.setItem("clubId", userData.clubId);
        router.push("/club");
      } else if (userData.rol === "admin") {
        router.push("/admin");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="p-6 bg-white rounded shadow-md w-80">
        <h1 className="text-2xl font-bold mb-4">Login</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;