"use client";

import React, { useEffect, useState } from "react";
import { db } from "../../firebaseConfig";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { useRouter } from "next/navigation";

const Admin: React.FC = () => {
  const [clubs, setClubs] = useState<any[]>([]);
  const [error, setError] = useState("");
  const router = useRouter();

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

  // Handle delete club
  const handleDelete = async (clubId: string) => {
    try {
      await deleteDoc(doc(db, "clubs", clubId));
      setClubs(clubs.filter((club) => club.clubId !== clubId));
    } catch (error) {
      console.error("Error deleting club:", error);
      setError("Failed to delete club. Please try again.");
    }
  };

  // Handle edit club
  const handleEdit = (clubId: string) => {
    router.push(`/admin/edit-club/${clubId}`);
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="bg-white p-4 rounded shadow-md">
        <h2 className="text-xl font-bold mb-4">Clubs</h2>
        <ul>
          {clubs.map((club) => (
            <li
              key={club.clubId}
              className="flex flex-col border-b py-4"
            >
              <div className="flex items-center space-x-4">
                {/* Escudo */}
                {club.escudoUrl && (
                  <img
                    src={club.escudoUrl}
                    alt={`${club.nombre} Logo`}
                    className="w-12 h-12 object-cover rounded-full"
                  />
                )}
                <div>
                  {/* Nombre */}
                  <p className="font-bold">{club.nombre || "Unnamed Club"}</p>
                  {/* Descripción */}
                  <p className="text-sm text-gray-500">
                    {club.description || "No description available"}
                  </p>
                  {/* Admin UID */}
                  {club.adminUid && (
                    <p className="text-sm text-gray-500">
                      <strong>Admin UID:</strong> {club.adminUid}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex space-x-2 mt-4">
                <button
                  onClick={() => handleEdit(club.clubId)}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(club.clubId)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Admin;