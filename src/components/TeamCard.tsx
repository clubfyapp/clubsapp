import React from 'react';

interface TeamCardProps {
  teamName: string;
  teamLogo: string;
  description: string;
}

const TeamCard: React.FC<TeamCardProps> = ({ teamName, teamLogo, description }) => {
  return (
    <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-md m-2">
      <img src={teamLogo} alt={`${teamName} logo`} className="w-full h-32 object-cover rounded-md" />
      <h2 className="text-xl font-semibold mt-2">{teamName}</h2>
      <p className="text-gray-600 mt-1">{description}</p>
    </div>
  );
};

export default TeamCard;