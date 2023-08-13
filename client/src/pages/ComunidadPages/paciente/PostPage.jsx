import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importar useNavigate
import axios from '../../../api/axios';

const CreateAportePage = () => {
  const [titulo, setTitulo] = useState('');
  const [aporte, setAporte] = useState('');
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Obtener la función navigate

  const handleCreateAporte = async () => {
    try {
      setLoading(true);
      // Llamar a la API para crear el aporte
      await axios.post('/comunidad/createAporte', { titulo, aporte, url });
      setLoading(false);
      navigate('/ComunidadPage'); // Navegar a la página ComunidadPage
    } catch (error) {
      console.error('Error creando el aporte:', error);
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-md shadow-md p-4 mb-4">
      <h2 className="text-xl font-bold mb-2 text-black">Crear nuevo aporte</h2>
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Título"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          className="border border-gray-300 p-2 rounded-md w-full text-black"
        />
        <textarea
          placeholder="Contenido del aporte"
          value={aporte}
          onChange={(e) => setAporte(e.target.value)}
          className="border border-gray-300 p-2 rounded-md w-full h-32 resize-none text-black"
        />
        <input
          type="text"
          placeholder="URL (opcional)"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="border border-gray-300 p-2 rounded-md w-full text-black"
        />
        <button
          onClick={handleCreateAporte}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 rounded-md text-black"
        >
          {loading ? 'Creando...' : 'Crear Aporte'}
        </button>
      </div>
    </div>
  );
};

export default CreateAportePage;
