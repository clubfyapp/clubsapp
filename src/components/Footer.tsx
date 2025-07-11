import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white text-center py-4">
      <p>&copy; {new Date().getFullYear()} Your Football Club. All rights reserved.</p>
      <div className="mt-2">
        <a href="/privacy" className="text-gray-400 hover:text-white">Privacy Policy</a>
        <span className="mx-2">|</span>
        <a href="/terms" className="text-gray-400 hover:text-white">Terms of Service</a>
      </div>
    </footer>
  );
};

export default Footer;