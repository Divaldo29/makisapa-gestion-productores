import React, { useState, useEffect } from 'react';
import { productoresAPI } from '../services/api';

// Nota: Vamos a ampliar la API para incluir lotes
const lotesAPI = {
  getAll: async (estado = '') => {
    const url = estado 
      ? `http://localhost:3000/api/lotes?estado=${estado}` 
      : 'http://localhost:3000/api/lotes';
    const response = await fetch(url);
    return response.json();
  },
  
  create: async (data) => {
    const response = await fetch('http://localhost:3000/api/lotes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  },
  
  update: async (id, data) => {
    const response = await fetch(`http://localhost:3000/api/lotes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  },
  
  delete: async (id) => {
    const response = await fetch(`http://localhost:3000/api/lotes/${id}`, {
      method: 'DELETE'
    });
    return response.json();
  }
};

function Lotes() {
  const [productores, setProductores] = useState([]);
  const [productorSeleccionado, setProductorSeleccionado] = useState(null);
  const [lotes, setLotes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [filtroEstado, setFiltroEstado] = useState('');
  const [formData, setFormData] = useState({
    id_productor: '',
    peso_kg: '',
    tipo_cafe: '',
    observaciones: ''
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    cargarProductores();
    cargarLotes();
  }, []);

  useEffect(() => {
    cargarLotes();
  }, [filtroEstado]);

  const cargarProductores = async () => {
    try {
      const data = await productoresAPI.getAll();
      setProductores(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const cargarLotes = async () => {
    try {
      const data = await lotesAPI.getAll(filtroEstado);
      setLotes(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const abrirFormularioParaProductor = (productor) => {
    setProductorSeleccionado(productor);
    setFormData({
      id_productor: productor.id_productor,
      peso_kg: '',
      tipo_cafe: '',
      observaciones: ''
    });
    setEditingId(null);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await lotesAPI.update(editingId, {
          estado_lote: formData.estado_lote,
          observaciones: formData.observaciones
        });
        alert('Lote actualizado correctamente');
      } else {
        await lotesAPI.create(formData);
        alert('Lote registrado correctamente');
      }
      setFormData({ id_productor: '', peso_kg: '', tipo_cafe: '', observaciones: '' });
      setEditingId(null);
      setShowForm(false);
      setProductorSeleccionado(null);
      cargarLotes();
      cargarProductores();
    } catch (error) {
      console.error('Error:', error);
      alert('Error al guardar lote');
    }
  };

  const handleEdit = (lote) => {
    setFormData({
      estado_lote: lote.estado_lote,
      observaciones: lote.observaciones
    });
    setEditingId(lote.id_lote);
    setProductorSeleccionado(lote.productor);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de eliminar este lote?')) {
      try {
        await lotesAPI.delete(id);
        alert('Lote eliminado');
        cargarLotes();
        cargarProductores();
      } catch (error) {
        console.error('Error:', error);
        alert('Error al eliminar lote');
      }
    }
  };

  const getEstadoBadge = (estado) => {
    const estilos = {
      'PENDIENTE': 'bg-yellow-100 text-yellow-800 border-yellow-300',
      'EN_CONTROL': 'bg-blue-100 text-blue-800 border-blue-300',
      'APROBADO': 'bg-green-100 text-green-800 border-green-300',
      'RECHAZADO': 'bg-red-100 text-red-800 border-red-300'
    };
    return estilos[estado] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const getLotesDelProductor = (idProductor) => {
    return lotes.filter(lote => lote.id_productor === idProductor);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">Gestión de Lotes</h2>
            <p className="text-gray-600 mt-1">Administra los lotes de café de cada productor</p>
          </div>
          
          {/* Filtros */}
          <div className="flex items-center space-x-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mr-2">Filtrar por estado:</label>
              <select
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
              >
                <option value="">Todos</option>
                <option value="PENDIENTE">Pendiente</option>
                <option value="EN_CONTROL">En Control</option>
                <option value="APROBADO">Aprobado</option>
                <option value="RECHAZADO">Rechazado</option>
              </select>
            </div>
          </div>
        </div>

        {/* Modal de formulario */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-800">
                  {editingId ? 'Editar Lote' : 'Registrar Nuevo Lote'}
                </h3>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                    setProductorSeleccionado(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {productorSeleccionado && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                  <p className="text-sm text-gray-600">Productor:</p>
                  <p className="font-semibold text-gray-800">
                    {productorSeleccionado.nombres} {productorSeleccionado.apellidos}
                  </p>
                  <p className="text-sm text-gray-600">DNI: {productorSeleccionado.dni}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {!editingId ? (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Peso (kg) *
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        required
                        value={formData.peso_kg}
                        onChange={(e) => setFormData({ ...formData, peso_kg: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                        placeholder="Ej: 50.5"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tipo de Café *
                      </label>
                      <select
                        required
                        value={formData.tipo_cafe}
                        onChange={(e) => setFormData({ ...formData, tipo_cafe: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                      >
                        <option value="">Seleccione tipo</option>
                        <option value="Arábica">Arábica</option>
                        <option value="Robusta">Robusta</option>
                        <option value="Geisha">Geisha</option>
                        <option value="Bourbon">Bourbon</option>
                        <option value="Caturra">Caturra</option>
                        <option value="Typica">Typica</option>
                      </select>
                    </div>
                  </>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Estado del Lote
                    </label>
                    <select
                      value={formData.estado_lote}
                      onChange={(e) => setFormData({ ...formData, estado_lote: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                    >
                      <option value="PENDIENTE">Pendiente</option>
                      <option value="EN_CONTROL">En Control</option>
                      <option value="APROBADO">Aprobado</option>
                      <option value="RECHAZADO">Rechazado</option>
                    </select>
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Observaciones
                  </label>
                  <textarea
                    value={formData.observaciones}
                    onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                    rows="3"
                    placeholder="Notas adicionales sobre el lote..."
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingId(null);
                      setProductorSeleccionado(null);
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold transition-colors"
                  >
                    {editingId ? 'Actualizar' : 'Registrar'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Grid de Productores con sus Lotes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {productores.map((productor) => {
            const lotesProductor = getLotesDelProductor(productor.id_productor);
            
            return (
              <div key={productor.id_productor} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                {/* Header del productor */}
                <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-4 rounded-t-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-bold">
                        {productor.nombres} {productor.apellidos}
                      </h3>
                      <p className="text-green-100 text-sm">DNI: {productor.dni}</p>
                      <p className="text-green-100 text-sm">{productor.direccion}</p>
                    </div>
                    <button
                      onClick={() => abrirFormularioParaProductor(productor)}
                      className="bg-white text-green-700 px-3 py-1 rounded-lg text-sm font-semibold hover:bg-green-50 transition-colors flex items-center space-x-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      <span>Nuevo Lote</span>
                    </button>
                  </div>
                </div>

                {/* Lotes del productor */}
                <div className="p-4">
                  {lotesProductor.length > 0 ? (
                    <div className="space-y-3">
                      {lotesProductor.map((lote) => (
                        <div
                          key={lote.id_lote}
                          className="border border-gray-200 rounded-lg p-3 hover:border-green-300 transition-colors"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <span className="text-xs font-semibold text-gray-500">
                                  LOTE #{lote.id_lote}
                                </span>
                                <span className={`text-xs px-2 py-0.5 rounded-full border ${getEstadoBadge(lote.estado_lote)}`}>
                                  {lote.estado_lote}
                                </span>
                              </div>
                              <div className="grid grid-cols-2 gap-2 text-sm">
                                <div>
                                  <span className="text-gray-600">Peso:</span>
                                  <span className="font-semibold ml-1">{lote.peso_kg} kg</span>
                                </div>
                                <div>
                                  <span className="text-gray-600">Tipo:</span>
                                  <span className="font-semibold ml-1">{lote.tipo_cafe}</span>
                                </div>
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                Recepción: {new Date(lote.fecha_recepcion).toLocaleDateString('es-PE')}
                              </div>
                              {lote.observaciones && (
                                <div className="text-xs text-gray-600 mt-1 italic">
                                  "{lote.observaciones}"
                                </div>
                              )}
                            </div>
                            <div className="flex flex-col space-y-1 ml-2">
                              <button
                                onClick={() => handleEdit(lote)}
                                className="text-blue-600 hover:text-blue-800 text-xs font-medium"
                                title="Editar"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </button>
                              <button
                                onClick={() => handleDelete(lote.id_lote)}
                                className="text-red-600 hover:text-red-800 text-xs font-medium"
                                title="Eliminar"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-gray-400">
                      <svg className="w-12 h-12 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                      </svg>
                      <p className="text-sm">Sin lotes registrados</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {productores.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <p className="text-gray-600 text-lg">No hay productores registrados</p>
            <p className="text-gray-500 text-sm mt-2">Registra productores primero en el módulo de Productores</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Lotes;