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
      // Buscar el usuario en la colección `users`
      const usersCollection = collection(db, "users");
      const querySnapshot = await getDocs(usersCollection);

      const user = querySnapshot.docs
        .map((doc) => ({ id: doc.id, ...(doc.data() as { email: string; password: string; role: string; clubId?: string }) }))
        .find((user) => user.email === email && user.password === password);

      if (!user) {
        setError("Email o contraseña incorrectos.");
        return;
      }

      // Verificar el rol del usuario y redirigir
      if (user.role === "admin") {
        router.push("/admin"); // Redirigir al panel de administración
      } else if (user.role === "club" && user.clubId) {
        router.push(`/club/${user.clubId}`); // Redirigir a la página del club
      } else {
        router.push("/dashboard"); // Redirigir al dashboard para usuarios normales
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      setError("No se pudo iniciar sesión. Por favor, inténtalo de nuevo.");
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