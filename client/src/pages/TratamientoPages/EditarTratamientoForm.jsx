import React, { useState } from 'react';
import axios from '../../api/axios';

const EditarTratamientoForm = ({ tratamiento, onCancel, onSave, cargarTratamientos }) => {
  const [editData, setEditData] = useState({
    nombre: tratamiento.nombre,
    descripcion: tratamiento.descripcion,
    url: tratamiento.url,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false); // Nuevo estado para controlar si se han guardado los cambios

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData({
      ...editData,
      [name]: value,
    });
  };

  const handleGuardarConConfirmacion = async () => {
    const confirmarGuardar = window.confirm('¿Estás seguro de guardar los cambios?');

    if (confirmarGuardar) {
      try {
        setIsLoading(true);
        // Enviar una solicitud PUT para actualizar el diagnóstico
        await axios.put(`/tratamientos/updateTratamiento/${tratamiento._id}`, editData, {
          withCredentials: true,
        });

        setIsSaved(true); // Cambiar el estado a "guardado"
        onSave(); // Llama a la función onSave para realizar alguna acción después de guardar
        cargarTratamientos(); // Actualiza la lista de diagnósticos

        // Cerrar el formulario automáticamente después de 2 segundos
        setTimeout(() => {
          onCancel(); // Cierra el formulario
        }, 1000);
      } catch (error) {
        console.error('Error al editar el diagnóstico:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <form onSubmit={handleGuardarConConfirmacion} className="bg-white p-4 shadow rounded-lg">
      <h3 className="text-lg font-bold mb-2 text-black">Editar Diagnóstico</h3>
      <div className="mb-2">
        <label className="block font-bold text-black">Nombre:</label>
        <input
          type="text"
          name="nombre"
          value={editData.nombre}
          onChange={handleInputChange}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500 text-black"
          required
        />
      </div>
  
      <div className="mb-2">
        <label className="block font-bold text-black">Descripción:</label>
        <textarea
          name="descripcion"
          value={editData.descripcion}
          onChange={handleInputChange}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500 text-black"
          required
        />
      </div>
      <div className="mb-2">
        <label className="block font-bold text-black">URL:</label>
        <input
          type="text"
          name="url"
          value={editData.url}
          onChange={handleInputChange}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500 text-black"
        />
      </div>
      <div className="flex justify-end">
        {isSaved ? (
          // Muestra un mensaje después de guardar
          <p className="text-green-500">Cambios guardados.</p>
        ) : (
          <>
            <button
              type="button"
              className="mr-2 bg-red-500 text-white font-semibold rounded-lg px-4 py-2"
              onClick={onCancel}
            >
              Cancelar
            </button>
            <button
              type="button"
              className="bg-green-500 text-white font-semibold rounded-lg px-4 py-2"
              disabled={isLoading}
              onClick={handleGuardarConConfirmacion}
            >
              {isLoading ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </>
        )}
      </div>
    </form>
  );
};

export default EditarTratamientoForm;
