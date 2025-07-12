"use client";

import React, { useEffect, useRef, useState } from "react";
import { db, firebaseApp } from "../firebaseConfig";
import { collection, getDocs, deleteDoc, doc, addDoc } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useRouter } from "next/navigation";

const Admin: React.FC = () => {
  const [clubs, setClubs] = useState<any[]>([]);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showClubForm, setShowClubForm] = useState(false);
  const [newUser, setNewUser] = useState({
    email: "",
    password: "",
    role: "admin",
    clubId: "",
  });
  const [newClub, setNewClub] = useState({
    nombre: "",
    description: "",
    escudoFile: null as File | null,
    colorPrimario: "#000000",
    colorSecundario: "#FFFFFF",
  });
  const [fileName, setFileName] = useState<string>(""); // Estado para mostrar el nombre del archivo seleccionado
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null); // Referencia al input de archivo
  const router = useRouter();
  const auth = getAuth();
  const storage = getStorage(firebaseApp, "gs://clubfyapp.firebasestorage.app");

  // Fetch clubs from Firestore
  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const clubsCollection = collection(db, "clubs");
        const querySnapshot = await getDocs(clubsCollection);
        const clubsData = querySnapshot.docs.map((doc) => ({
          clubId: doc.id,
          ...doc.data(),
        }));
        setClubs(clubsData);
      } catch (error) {
        console.error("Error fetching clubs:", error);
        setError("Failed to fetch clubs. Please try again.");
      }
    };

    fetchClubs();
  }, []);

  // Handle create user
  const handleCreateUser = async () => {

    console.log("handleCreateUser se está ejecutando"); // Log inicial

    try {
      if (!newUser.email || !newUser.password || !newUser.role) {
        setError("Todos los campos son obligatorios.");
        return;
      }

      console.log("Datos del usuario antes de guardar:", newUser);

      // Crear usuario en Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        newUser.email,
        newUser.password
      );

      // Guardar datos del usuario en Firestore
      const userData = {
        email: newUser.email,
        password: newUser.password, // Guardar la contraseña en texto plano
        role: newUser.role,
        clubId: newUser.role === "club" ? newUser.clubId : null,
      };

      console.log("Datos que se guardarán en Firestore:", userData);

      await addDoc(collection(db, "users"), userData);

      // Resetear el formulario y cerrar el modal
      setNewUser({ email: "", password: "", role: "admin", clubId: "" });
      setShowUserModal(false);
    } catch (error) {
      console.error("Error creating user:", error);
      setError("No se pudo crear el usuario. Por favor, inténtalo de nuevo.");
    }
  };

  const handleCreateClub = async () => {
    try {
      if (!newClub.nombre || !newClub.description || !newClub.escudoFile) {
        setError("Todos los campos son obligatorios.");
        return;
      }

      if (!newClub.escudoFile || !newClub.escudoFile.name) {
        setError("Por favor, selecciona un archivo válido.");
        return;
      }

      if (!newClub.escudoFile.type.startsWith("image/")) {
        setError("El archivo debe ser una imagen (PNG, JPG, etc.).");
        return;
      }

      // Subir el archivo del escudo a Firebase Storage
      const sanitizedFileName = newClub.escudoFile.name.replace(/\s+/g, "_");
      const storageRef = ref(storage, `club-logos/${sanitizedFileName}`);
      console.log("Subiendo archivo a:", `club-logos/${sanitizedFileName}`);
      console.log("Iniciando la subida del archivo...");
      console.log("Archivo seleccionado:", newClub.escudoFile);
      console.log("Nombre del archivo:", sanitizedFileName);
      console.log("Bucket de almacenamiento:", storage.app.options.storageBucket);
      console.log("Referencia del archivo:", `club-logos/${sanitizedFileName}`);
      await uploadBytes(storageRef, newClub.escudoFile);
      console.log("Archivo subido correctamente.");
      const escudoUrl = await getDownloadURL(storageRef);
      console.log("URL del archivo:", escudoUrl);

      // Guardar el club en Firestore
      await addDoc(collection(db, "clubs"), {
        nombre: newClub.nombre,
        description: newClub.description,
        escudoUrl,
        colorPrimario: newClub.colorPrimario,
        colorSecundario: newClub.colorSecundario,
      });

      // Resetear el formulario
      setNewClub({
        nombre: "",
        description: "",
        escudoFile: null,
        colorPrimario: "#000000",
        colorSecundario: "#FFFFFF",
      });
      setFileName("");
      setShowClubForm(false);
    } catch (error: any) {
      console.error("Error creando el club:", error);
      if (error.code === "storage/unauthorized") {
        setError("No tienes permisos para subir archivos.");
      } else if (error.code === "storage/canceled") {
        setError("La subida del archivo fue cancelada.");
      } else if (error.code === "storage/unknown") {
        setError("Ocurrió un error desconocido. Por favor, verifica la configuración.");
      } else {
        setError("No se pudo crear el club. Por favor, inténtalo de nuevo.");
      }
    }
  };

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setNewClub({ ...newClub, escudoFile: file });
    setFileName(file ? file.name : ""); // Actualizar el nombre del archivo
  };

  // Handle delete club
  const handleDeleteClub = async (clubId: string) => {
    try {
      await deleteDoc(doc(db, "clubs", clubId));
      setClubs(clubs.filter((club) => club.clubId !== clubId));
    } catch (error) {
      console.error("Error deleting club:", error);
      setError("Failed to delete club. Please try again.");
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Panel</h1>
        <div className="space-x-4">
          <button
            onClick={() => setShowUserModal(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Crear Usuario
          </button>
          <button
            onClick={() => setShowClubForm(!showClubForm)}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            {showClubForm ? "Cerrar Formulario" : "Crear Club"}
          </button>
        </div>
      </div>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Formulario para crear un nuevo club */}
      {showClubForm && (
        <div className="bg-white p-4 rounded shadow-md mb-6">
          <h2 className="text-xl font-bold mb-4">Crear Nuevo Club</h2>
          <input
            type="text"
            value={newClub.nombre}
            onChange={(e) => setNewClub({ ...newClub, nombre: e.target.value })}
            placeholder="Nombre del Club"
            className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
          />
          <textarea
            value={newClub.description}
            onChange={(e) =>
              setNewClub({ ...newClub, description: e.target.value })
            }
            placeholder="Descripción del Club"
            className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()} // Abrir el selector de archivos
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4"
          >
            Seleccionar Archivo
          </button>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef} // Referencia al input de archivo
            onChange={handleFileSelect}
            className="hidden" // Ocultar el input de archivo
          />
          {fileName && <p className="text-sm text-gray-500 mb-4">Archivo: {fileName}</p>}
          <div className="flex space-x-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Primera Equipación
              </label>
              <input
                type="color"
                value={newClub.colorPrimario}
                onChange={(e) =>
                  setNewClub({ ...newClub, colorPrimario: e.target.value })
                }
                className="w-16 h-10 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Segunda Equipación
              </label>
              <input
                type="color"
                value={newClub.colorSecundario}
                onChange={(e) =>
                  setNewClub({ ...newClub, colorSecundario: e.target.value })
                }
                className="w-16 h-10 border border-gray-300 rounded"
              />
            </div>
          </div>
          <button
            onClick={handleCreateClub}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Crear Club
          </button>
        </div>
      )}

      {/* List of Clubs */}
      <div className="bg-white p-4 rounded shadow-md mb-6">
        <h2 className="text-xl font-bold mb-4">Clubs</h2>
        <ul>
          {clubs.map((club) => (
            <li
              key={club.clubId}
              className="flex flex-col border-b py-4"
            >
              <div className="flex items-center space-x-4">
                {club.escudoUrl && (
                  <img
                    src={club.escudoUrl}
                    alt={`${club.nombre} Logo`}
                    className="w-12 h-12 object-cover rounded-full"
                  />
                )}
                <div>
                  <p className="font-bold">{club.nombre || "Unnamed Club"}</p>
                  <p className="text-sm text-gray-500">
                    {club.description || "No description available"}
                  </p>
                </div>
              </div>
              <div className="flex space-x-2 mt-4">
                <button
                  onClick={() => router.push(`/admin/edit-club/${club.clubId}`)}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDeleteClub(club.clubId)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Borrar
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Modal para crear usuario */}
      {showUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-md w-96">
            <h2 className="text-xl font-bold mb-4">Crear Usuario</h2>
            <input
              type="email"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              placeholder="Email del Usuario"
              className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
            />
            <input
              type="password"
              value={newUser.password}
              onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
              placeholder="Contraseña"
              className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
            />
            <select
              value={newUser.role}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
              className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
            >
              <option value="admin">Admin</option>
              <option value="club">Club</option>
            </select>
            {newUser.role === "club" && (
              <select
                value={newUser.clubId}
                onChange={(e) =>
                  setNewUser({ ...newUser, clubId: e.target.value })
                }
                className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
              >
                <option value="">Seleccionar Club</option>
                {clubs.map((club) => (
                  <option key={club.clubId} value={club.clubId}>
                    {club.nombre}
                  </option>
                ))}
              </select>
            )}
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowUserModal(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateUser}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Crear
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;