import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { db } from "../firebaseConfig";
import { collection, doc, getDoc } from "firebase/firestore";

interface Club {
  id: string;
  nombre: string;
  escudoUrl: string;
  creado: string; // Puedes usar `Date` si conviertes el timestamp
  adminUid: string;
}

const Club: React.FC = () => {
  const router = useRouter();
  const [club, setClub] = useState<Club | null>(null);

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "club") {
      router.push("/login");
      return;
    }

    const fetchClub = async () => {
      const clubId = localStorage.getItem("clubId"); // Asegúrate de guardar el `clubId` en localStorage
      if (!clubId) return;

      try {
        const clubDocRef = doc(db, "clubes", clubId);
        const clubSnapshot = await getDoc(clubDocRef);

        if (clubSnapshot.exists()) {
          const clubData = clubSnapshot.data();
          setClub({
            id: clubSnapshot.id,
            nombre: clubData.nombre,
            escudoUrl: clubData.escudoUrl,
            creado: clubData.creado.toDate().toISOString(), // Convierte el timestamp a string
            adminUid: clubData.adminUid,
          });
        } else {
          console.error("Club not found");
        }
      } catch (error) {
        console.error("Error fetching club data:", error);
      }
    };

    fetchClub();
  }, [router]);

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  if (!club) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p>Loading club data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{club.nombre} Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
      <div className="p-4 bg-white rounded shadow-md border">
        <img
          src={club.escudoUrl}
          alt={`${club.nombre} logo`}
          className="w-24 h-24 mb-4"
        />
        <h2 className="text-lg font-bold">{club.nombre}</h2>
        <p>Creado: {new Date(club.creado).toLocaleDateString()}</p>
      </div>
    </div>
  );
};

export default Club;