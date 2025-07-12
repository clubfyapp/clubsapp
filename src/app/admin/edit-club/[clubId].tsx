"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { db } from "../../firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";

const EditClub: React.FC = () => {
  const params = useParams();
  const clubId = params.clubId;
  const router = useRouter();
  const [club, setClub] = useState<any>(null);
  const [error, setError] = useState("");

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
          setClub({ id: clubDoc.id, ...clubDoc.data() });
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
      if (club) {
        await updateDoc(doc(db, "clubs", club.id), {
          name: club.name,
          description: club.description,
        });
        router.push("/admin");
      }
    } catch (error) {
      console.error("Error updating club:", error);
      setError("Failed to update club. Please try again.");
    }
  };

  if (!club) return <p>Loading...</p>;

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Edit Club</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="bg-white p-4 rounded shadow-md">
        <input
          type="text"
          value={club.name}
          onChange={(e) => setClub({ ...club, name: e.target.value })}
          className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
          placeholder="Club Name"
        />
        <textarea
          value={club.description}
          onChange={(e) =>
            setClub({ ...club, description: e.target.value })
          }
          className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
          placeholder="Club Description"
        />
        <button
          onClick={handleSave}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default EditClub;