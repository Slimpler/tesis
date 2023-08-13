import React, { useEffect, useState } from 'react';
import axios from '../../../api/axios';
import AportePost from './AportePost';

const AportesPage = () => {
  const [aportes, setAportes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const aportesPerPage = 5;

  useEffect(() => {
    const fetchAportes = async () => {
      try {
        const response = await axios.get('/comunidad/getAportes');
        // Verificar si la respuesta contiene datos antes de actualizar el estado
        if (Array.isArray(response.data)) {
          setAportes(response.data);
        } else {
          console.error('La respuesta del servidor no contiene datos de aportes:', response.data);
        }
      } catch (error) {
        console.error('Error fetching aportes:', error);
      }
    };

    fetchAportes();
  }, []);

  const indexOfLastAporte = currentPage * aportesPerPage;
  const indexOfFirstAporte = indexOfLastAporte - aportesPerPage;
  const currentAportes = aportes.slice(indexOfFirstAporte, indexOfLastAporte);

  const handleDeleteAporte = async (aporteId) => {
    try {
      await axios.delete(`/comunidad/deleteAporte/${aporteId}`);
      const updatedAportes = aportes.filter((aporte) => aporte._id !== aporteId);
      setAportes(updatedAportes);
    } catch (error) {
      console.error('Error al eliminar el aporte:', error);
    }
  };

  return (
    <div className="min-h-screen bg-pink-200 flex items-center justify-center text-black">
      <div className="w-full max-w-md p-5">
        <h1 className="text-3xl font-bold text-white mb-6">Aportes</h1>
        <div className="aportes-list">
          {Array.isArray(currentAportes) && currentAportes.length > 0 ? (
            currentAportes.map((aporte) => (
              <AportePost
                key={aporte._id}
                aporte={aporte}
                onDeleteAporte={handleDeleteAporte}
              />
            ))
          ) : (
            <p>No hay aportes disponibles.</p>
          )}
        </div>
        <div className="flex justify-center mt-4">
          <button
            className="bg-blue-500 text-white px-4 py-2 mx-2 rounded"
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Anterior
          </button>
          <button
            className="bg-blue-500 text-white px-4 py-2 mx-2 rounded"
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={indexOfLastAporte >= aportes.length}
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
};

export default AportesPage;
