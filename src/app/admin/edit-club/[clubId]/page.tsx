"use client";

import React, { useEffect, useRef, useState } from "react";
import { db } from "../../../firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useRouter, useParams } from "next/navigation";

const EditClub: React.FC = () => {
  const params = useParams();
  const clubId = params.clubId;
  const router = useRouter();
  const [club, setClub] = useState<any>({
    nombre: "",
    description: "",
    escudoUrl: "",
    colorPrimario: "#000000",
    colorSecundario: "#FFFFFF",
  });
  const [newLogoFile, setNewLogoFile] = useState<File | null>(null); // Archivo para el nuevo logo
  const [previewLogoUrl, setPreviewLogoUrl] = useState<string | null>(null); // URL de vista previa del logo
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null); // Referencia al input de archivo
  const storage = getStorage();

  useEffect(() => {
    const fetchClub = async () => {
      try {
        if (!clubId) {
          throw new Error("Invalid club ID");
        }
        if (typeof clubId !== "string") {
          throw new Error("Invalid club ID");
        }
        const clubDoc = await getDoc(doc(db, "clubs", clubId));
        if (clubDoc.exists()) {
          const data = clubDoc.data();
          setClub({
            id: clubDoc.id,
            nombre: data.nombre,
            description: data.description,
            escudoUrl: data.escudoUrl,
            colorPrimario: data.colorPrimario || "#000000",
            colorSecundario: data.colorSecundario || "#FFFFFF",
          });
          setPreviewLogoUrl(data.escudoUrl); // Establecer la URL inicial del logo
        } else {
          setError("Club not found");
        }
      } catch (error) {
        console.error("Error fetching club:", error);
        setError("Failed to fetch club. Please try again.");
      }
    };

    fetchClub();
  }, [clubId]);

  const handleSave = async () => {
    try {
      if (!club.nombre || !club.description) {
        setError("All fields are required.");
        return;
      }

      let escudoUrl = club.escudoUrl;

      // Si se seleccionó un nuevo logo, súbelo a Firebase Storage
      if (newLogoFile) {
        const storageRef = ref(storage, `club-logos/${newLogoFile.name}`);
        await uploadBytes(storageRef, newLogoFile);
        escudoUrl = await getDownloadURL(storageRef);
      }

      // Actualiza el club en Firestore
      await updateDoc(doc(db, "clubs", club.id), {
        nombre: club.nombre,
        description: club.description,
        escudoUrl,
        colorPrimario: club.colorPrimario,
        colorSecundario: club.colorSecundario,
      });

      router.push("/admin");
    } catch (error) {
      console.error("Error updating club:", error);
      setError("Failed to update club. Please try again.");
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setNewLogoFile(file);

    // Generar una URL de vista previa para el archivo seleccionado
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setPreviewLogoUrl(previewUrl);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Edit Club</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="bg-white p-4 rounded shadow-md">
        <input
          type="text"
          value={club.nombre}
          onChange={(e) => setClub({ ...club, nombre: e.target.value })}
          placeholder="Club Name"
          className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
        />
        <textarea
          value={club.description}
          onChange={(e) =>
            setClub({ ...club, description: e.target.value })
          }
          placeholder="Club Description"
          className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
        />
        {/* Mostrar el logo actual o la vista previa */}
        {previewLogoUrl && (
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Current Logo:</p>
            <img
              src={previewLogoUrl}
              alt="Club Logo"
              className="w-24 h-24 object-cover rounded-full mb-2"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()} // Abrir el selector de archivos
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Change Logo
            </button>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef} // Referencia al input de archivo
              onChange={handleFileSelect}
              className="hidden" // Ocultar el input de archivo
            />
            {newLogoFile && (
              <p className="text-sm text-gray-500 mt-2">New File: {newLogoFile.name}</p>
            )}
          </div>
        )}
        {/* Selectores de colores */}
        <div className="flex space-x-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Primary Color
            </label>
            <input
              type="color"
              value={club.colorPrimario}
              onChange={(e) =>
                setClub({ ...club, colorPrimario: e.target.value })
              }
              className="w-16 h-10 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Secondary Color
            </label>
            <input
              type="color"
              value={club.colorSecundario}
              onChange={(e) =>
                setClub({ ...club, colorSecundario: e.target.value })
              }
              className="w-16 h-10 border border-gray-300 rounded"
            />
          </div>
        </div>
        <button
          onClick={handleSave}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default EditClub;