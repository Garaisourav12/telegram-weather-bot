import React from 'react';

function Header() {
  return (
    <nav className="bg-blue-400 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center h-20">
          <h1 className="text-3xl font-bold text-white tracking-wide">Telegram Weather Bot</h1>
        </div>
      </div>
    </nav>
  );
}

export default Header;
