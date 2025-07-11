import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { db } from "../firebaseConfig";
import {
  collection,
  addDoc,
  getDocs,
  onSnapshot,
} from "firebase/firestore";

const Admin: React.FC = () => {
  const [clubs, setClubs] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newClub, setNewClub] = useState({ name: "", description: "" });
  const router = useRouter();

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "admin") {
      router.push("/login");
    }

    // Fetch clubs from Firestore
    const unsubscribe = onSnapshot(collection(db, "clubs"), (snapshot) => {
      const clubsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setClubs(clubsData);
    });

    return () => unsubscribe(); // Cleanup listener
  }, [router]);

  const handleAddClub = async () => {
    try {
      await addDoc(collection(db, "clubs"), {
        name: newClub.name,
        description: newClub.description,
        logo: "/default-logo.svg", // Default logo
      });
      setShowModal(false);
      setNewClub({ name: "", description: "" });
    } catch (error) {
      console.error("Error adding club: ", error);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
      <div className="mb-6">
        <button
          onClick={() => setShowModal(true)}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Add New Club
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {clubs.map((club) => (
          <div
            key={club.id}
            className="p-4 bg-white rounded shadow-md border"
          >
            <h2 className="text-lg font-bold">{club.name}</h2>
            <p>{club.description}</p>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-md w-80">
            <h2 className="text-lg font-bold mb-4">Add New Club</h2>
            <input
              type="text"
              placeholder="Club Name"
              value={newClub.name}
              onChange={(e) => setNewClub({ ...newClub, name: e.target.value })}
              className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
            />
            <textarea
              placeholder="Club Description"
              value={newClub.description}
              onChange={(e) =>
                setNewClub({ ...newClub, description: e.target.value })
              }
              className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
            />
            <div className="flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-300 text-black px-4 py-2 rounded mr-2"
              >
                Cancel
              </button>
              <button
                onClick={handleAddClub}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;