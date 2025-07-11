import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-lg font-bold">Football Club</div>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <a href="/" className="hover:underline">Home</a>
            </li>
            <li>
              <a href="/teams" className="hover:underline">Teams</a>
            </li>
            <li>
              <a href="/about" className="hover:underline">About</a>
            </li>
            <li>
              <a href="/contact" className="hover:underline">Contact</a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;