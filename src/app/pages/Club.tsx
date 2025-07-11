import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { clubs } from "../data/clubs";


const Club: React.FC = () => {
  const router = useRouter();
  const clubName = localStorage.getItem("clubName");
  const club = clubs.find((c) => c.name.toLowerCase() === clubName?.toLowerCase());

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "club") {
      router.push("/login");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  if (!club) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-xl font-bold">Club not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{club.name} Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
      <div className="p-4 bg-white rounded shadow-md border">
        <h2 className="text-lg font-bold">{club.name}</h2>
        <p>{club.description}</p>
      </div>
    </div>
  );
};

export default Club;