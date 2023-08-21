import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../../api/axios';

const CreateAportePage = () => {
  const [titulo, setTitulo] = useState('');
  const [aporte, setAporte] = useState('');
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [showError, setShowError] = useState(false); // Estado para controlar la visualización del error
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateAporte = async () => {
    if (titulo.trim() === '' || aporte.trim() === '') {
      setShowError(true); // Mostrar error si el título o el contenido están vacíos
      return;
    }
    setIsLoading(true)
    try {
      setLoading(true);
      
      await axios.post('/comunidad/createAporte', { titulo, aporte, url });
      setLoading(false);
      setIsLoading(false);
      navigate('/ComunidadPage');
    } catch (error) {
      console.error('Error creando el aporte:', error);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 bg-gray-100 rounded-lg shadow-md text-black">
      <h2 className="text-xl font-bold mb-2 text-black">Crear nuevo aporte</h2>
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Título"
          value={titulo}
          onChange={(e) => {
            setTitulo(e.target.value);
            setShowError(false); // Ocultar el error al modificar el título
          }}
          className="border border-gray-300 p-2 rounded-md w-full text-black"
        />
        <textarea
          placeholder="Contenido del aporte"
          value={aporte}
          onChange={(e) => {
            setAporte(e.target.value);
            setShowError(false); // Ocultar el error al modificar el contenido
          }}
          className="border border-gray-300 p-2 rounded-md w-full h-32 resize-none text-black"
        />
        <input
          type="text"
          placeholder="URL (opcional)"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="border border-gray-300 p-2 rounded-md w-full text-black"
        />
        {showError && (
          <p className="text-red-500">El título y el contenido no pueden estar vacíos.</p>
        )}
        <button
          onClick={handleCreateAporte}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 rounded-md text-black"
        >
            
            {isLoading ? (
              <svg
                className="animate-spin h-5 w-5 mr-3"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.86 3.182 7.98l2.828-2.828z"
                ></path>
              </svg>
            ) : (
              'Crear Aporte'
            )}
        </button>
      </div>
    </div>
  );
};

export default CreateAportePage;
