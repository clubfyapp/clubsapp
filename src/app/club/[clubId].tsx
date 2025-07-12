"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

const ClubPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const clubId = searchParams.get("clubId"); // Obtener el clubId de la URL
  const [club, setClub] = useState<any>(null);
  const [error, setError] = useState("");

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

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!club) {
    return <p>Cargando información del club...</p>;
  }

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md">
        <h1 className="text-3xl font-bold mb-4">{club.nombre}</h1>
        <p className="mb-4">{club.description}</p>
        {club.escudoUrl && (
          <img
            src={club.escudoUrl}
            alt={`${club.nombre} Logo`}
            className="w-32 h-32 object-cover rounded-full mb-4"
          />
        )}
        <p>
          <strong>Color Primario:</strong> {club.colorPrimario}
        </p>
        <p>
          <strong>Color Secundario:</strong> {club.colorSecundario}
        </p>
      </div>
    </div>
  );
};

export default ClubPage;