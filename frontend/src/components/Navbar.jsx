import React from 'react';

function Navbar({ currentPage, setCurrentPage }) {
  const pages = [
    { id: 'productores', name: 'Productores' },
    { id: 'lotes', name: 'Lotes' },
    { id: 'control', name: 'Control de Calidad' },
    { id: 'compras', name: 'Compras' }
  ];

  return (
    <nav className="bg-green-700 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">☕</span>
            <h1 className="text-xl font-bold">Makisapa - Gestión de Proveedores</h1>
          </div>
          <div className="flex space-x-1">
            {pages.map(page => (
              <button
                key={page.id}
                onClick={() => setCurrentPage(page.id)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  currentPage === page.id
                    ? 'bg-green-900 font-semibold'
                    : 'hover:bg-green-600'
                }`}
              >
                {page.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;