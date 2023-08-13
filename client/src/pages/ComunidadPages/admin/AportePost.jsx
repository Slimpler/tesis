import React, { useState } from 'react';
import axios from '../../../api/axios';

const AportePost = ({ aporte, onDeleteAporte }) => {
  const [currentState, setCurrentState] = useState(aporte.state);

  const handleToggleState = async () => {
    try {
      // Call the API to toggle the state of the aporte
      await axios.put(`/comunidad/aceptarAporte/${aporte._id}`);
      // Update the current state locally
      setCurrentState((prevState) => !prevState);
    } catch (error) {
      console.error('Error toggling aporte state:', error);
    }
  };

  const handleDeleteAporte = async () => {
    try {
      // Show a confirmation message before deleting the aporte
      const isConfirmed = window.confirm('¿Estás seguro de eliminar el aporte?');
      if (isConfirmed) {
        // Call the onDeleteAporte function with the ID of the aporte
        await onDeleteAporte(aporte._id);
        // Perform any additional actions after deleting the aporte (if necessary)
      }
    } catch (error) {
      console.error('Error al eliminar el aporte:', error);
    }
  };

  const buttonClass = currentState ? 'bg-red-500' : 'bg-green-500';

  return (
    <div className="bg-white rounded-md shadow-md p-4 mb-4">
      <h2 className="text-xl font-bold mb-2">{aporte.titulo}</h2>
      {aporte.aporte && <p className="text-gray-600 mb-2">{aporte.aporte}</p>}
      {aporte.url && (
        <a href={aporte.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
          {aporte.url}
        </a>
      )}
      <p className="text-gray-400 text-sm mb-1">Author: {aporte.user.nombre}</p>
      <p className="text-gray-400 text-sm">Date: {new Date(aporte.date).toLocaleDateString()}</p>
      <div className="flex items-center mt-2">
        <p className="text-gray-400 text-sm mr-2">State: {currentState ? 'Aceptado' : 'Rechazado'}</p>
        <button
          onClick={handleToggleState}
          className={`px-2 py-1 text-white rounded-md ${buttonClass}`}
        >
          {currentState ? 'Rechazar' : 'Aceptar'}
        </button>
        {/* Botón de eliminar aporte */}
        <button
          className="bg-red-500 text-white px-4 py-1 ml-2 rounded-md"
          onClick={handleDeleteAporte}
        >
          Delete 
        </button>
      </div>
    </div>
  );
};

export default AportePost;
