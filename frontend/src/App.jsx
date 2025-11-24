import { useState } from 'react';
import Navbar from './components/Navbar';
import Productores from './pages/Productores';
import Lotes from './pages/Lotes';

function App() {
  const [currentPage, setCurrentPage] = useState('productores');

  const renderPage = () => {
    switch (currentPage) {
      case 'productores':
        return <Productores />;
      case 'lotes':
        return <Lotes />;
      case 'control':
        return <div className="p-8 text-center text-gray-600">Módulo de Control de Calidad (próximamente)</div>;
      case 'compras':
        return <div className="p-8 text-center text-gray-600">Módulo de Compras (próximamente)</div>;
      default:
        return <Productores />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      {renderPage()}
    </div>
  );
}

export default App;