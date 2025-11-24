import React, { useState, useEffect } from 'react';
import { productoresAPI } from '../services/api';

function Productores() {
  const [productores, setProductores] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    nombres: '',
    apellidos: '',
    direccion: '',
    dni: ''
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    cargarProductores();
  }, []);

  const cargarProductores = async () => {
    try {
      const data = await productoresAPI.getAll();
      setProductores(data);
    } catch (error) {
      alert('Error al cargar productores');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await productoresAPI.update(editingId, formData);
        alert('Productor actualizado correctamente');
      } else {
        await productoresAPI.create(formData);
        alert('Productor registrado correctamente');
      }
      setFormData({ nombres: '', apellidos: '', direccion: '', dni: '' });
      setEditingId(null);
      setShowForm(false);
      cargarProductores();
    } catch (error) {
      alert('Error al guardar productor');
    }
  };

  const handleEdit = (productor) => {
    setFormData({
      nombres: productor.nombres,
      apellidos: productor.apellidos,
      direccion: productor.direccion,
      dni: productor.dni
    });
    setEditingId(productor.id_productor);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de eliminar este productor?')) {
      try {
        await productoresAPI.delete(id);
        alert('Productor eliminado');
        cargarProductores();
      } catch (error) {
        alert('Error al eliminar productor');
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Gestión de Productores</h2>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
            setFormData({ nombres: '', apellidos: '', direccion: '', dni: '' });
          }}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold"
        >
          {showForm ? 'Cancelar' : '+ Nuevo Productor'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h3 className="text-xl font-semibold mb-4">
            {editingId ? 'Editar Productor' : 'Registrar Nuevo Productor'}
          </h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombres *
              </label>
              <input
                type="text"
                required
                value={formData.nombres}
                onChange={(e) => setFormData({ ...formData, nombres: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Apellidos *
              </label>
              <input
                type="text"
                required
                value={formData.apellidos}
                onChange={(e) => setFormData({ ...formData, apellidos: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                DNI *
              </label>
              <input
                type="text"
                required
                maxLength="15"
                value={formData.dni}
                onChange={(e) => setFormData({ ...formData, dni: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dirección
              </label>
              <input
                type="text"
                value={formData.direccion}
                onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div className="col-span-2">
              <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-semibold"
              >
                {editingId ? 'Actualizar' : 'Registrar'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombres</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Apellidos</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">DNI</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dirección</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {productores.map((productor) => (
              <tr key={productor.id_productor} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm">{productor.id_productor}</td>
                <td className="px-6 py-4 text-sm">{productor.nombres}</td>
                <td className="px-6 py-4 text-sm">{productor.apellidos}</td>
                <td className="px-6 py-4 text-sm">{productor.dni}</td>
                <td className="px-6 py-4 text-sm">{productor.direccion}</td>
                <td className="px-6 py-4 text-sm space-x-2">
                  <button
                    onClick={() => handleEdit(productor)}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(productor.id_productor)}
                    className="text-red-600 hover:text-red-800 font-medium"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {productores.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No hay productores registrados
          </div>
        )}
      </div>
    </div>
  );
}

export default Productores;