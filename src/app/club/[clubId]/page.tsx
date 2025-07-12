"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { db } from "../../firebaseConfig";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";

const ClubPage: React.FC = () => {
  const router = useRouter();
  const { clubId } = useParams(); // Obtener el clubId de la URL
  const [club, setClub] = useState<any>(null);
  const [error, setError] = useState("");
  const [showAddTeamModal, setShowAddTeamModal] = useState(false); // Estado para mostrar el modal
  const [newTeam, setNewTeam] = useState({ nombre: "", categoria: "" }); // Estado para el nuevo equipo

  useEffect(() => {
    const fetchClub = async () => {
      try {
        if (!clubId) return;

        const clubDoc = await getDoc(doc(db, "clubs", clubId as string));
        if (clubDoc.exists()) {
          setClub(clubDoc.data());
        } else {
          setError("El club no existe.");
        }
      } catch (error) {
        console.error("Error fetching club:", error);
        setError("No se pudo cargar la información del club.");
      }
    };

    fetchClub();
  }, [clubId]);

  const handleAddTeam = async () => {
    try {
      if (!newTeam.nombre || !newTeam.categoria) {
        alert("Por favor, completa todos los campos.");
        return;
      }

      // Actualizar el documento del club con el nuevo equipo
      const clubRef = doc(db, "clubs", clubId as string);
      await updateDoc(clubRef, {
        equipos: arrayUnion(newTeam), // Agregar el nuevo equipo al array "equipos"
      });

      alert("Equipo añadido correctamente.");
      setNewTeam({ nombre: "", categoria: "" }); // Reiniciar el formulario
      setShowAddTeamModal(false); // Cerrar el modal

      // Actualizar el estado local para reflejar el cambio
      setClub((prevClub: any) => ({
        ...prevClub,
        equipos: [...(prevClub.equipos || []), newTeam],
      }));
    } catch (error) {
      console.error("Error al añadir el equipo:", error);
      alert("No se pudo añadir el equipo. Por favor, inténtalo de nuevo.");
    }
  };

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!club) {
    return <p>Cargando información del club...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Barra superior */}
      <header className="bg-gray-800 text-white p-4 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-4">
            {club.escudoUrl && (
              <img
                src={club.escudoUrl}
                alt={`${club.nombre} Logo`}
                className="w-12 h-12 object-cover rounded-full"
              />
            )}
            <h1 className="text-2xl font-bold">{club.nombre}</h1>
          </div>
          <div className="relative group">
            {/* Contenedor que envuelve el texto "Equipos" y el menú */}
            <div className="relative">
              {/* Texto "Equipos" */}
              <span className="text-white text-lg cursor-pointer">Equipos</span>

              {/* Menú desplegable */}
              <div className="absolute left-0 top-full bg-white text-black shadow-md rounded w-48 hidden group-hover:block z-50">
                <ul className="py-2">
                  {(club.equipos || []).map((equipo: any, index: number) => (
                    <li
                      key={index}
                      className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                      onClick={() => alert(`Seleccionaste el equipo: ${equipo.nombre}`)}
                    >
                      {equipo.nombre} - {equipo.categoria}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
        <button
          onClick={() => setShowAddTeamModal(true)}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Añadir Equipo
        </button>
      </header>

      {/* Modal para añadir equipo */}
      {showAddTeamModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-md w-96">
            <h2 className="text-xl font-bold mb-4">Añadir Equipo</h2>
            <input
              type="text"
              value={newTeam.nombre}
              onChange={(e) => setNewTeam({ ...newTeam, nombre: e.target.value })}
              placeholder="Nombre del Equipo"
              className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
            />
            <input
              type="text"
              value={newTeam.categoria}
              onChange={(e) => setNewTeam({ ...newTeam, categoria: e.target.value })}
              placeholder="Categoría"
              className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
            />
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowAddTeamModal(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddTeam}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contenido principal */}
      <main className="p-6">
        <div className="bg-white p-6 rounded shadow-md relative">
          {/* Información del Club */}
          <h2 className="text-xl font-bold mb-4">Información del Club</h2>
          <p className="mb-4">{club.description}</p>

          {/* Equipaciones */}
          <div className="absolute top-4 right-4 flex space-x-6">
            {/* Equipación primaria */}
            <div className="flex flex-col items-center">
              <div
                className="w-20 h-20"
                style={{
                  WebkitMaskImage: "url(/camiseta.svg)", // Usar la camiseta como máscara
                  WebkitMaskRepeat: "no-repeat",
                  WebkitMaskSize: "contain",
                  backgroundColor: club.colorPrimario, // Color dinámico
                }}
              />
              <span className="text-sm mt-1">Primera equipación</span>
            </div>

            {/* Equipación secundaria */}
            <div className="flex flex-col items-center">
              <div
                className="w-20 h-20"
                style={{
                  WebkitMaskImage: "url(/camiseta.svg)", // Usar la camiseta como máscara
                  WebkitMaskRepeat: "no-repeat",
                  WebkitMaskSize: "contain",
                  backgroundColor: club.colorSecundario, // Color dinámico
                }}
              />
              <span className="text-sm mt-1">Segunda equipación</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ClubPage;