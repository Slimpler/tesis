import React, { useEffect, useState } from 'react';
import axios from '../../../api/axios';
import AportePost from './AportePost';
import { Link } from 'react-router-dom';

const ComunidadPage = () => {
  const [aportes, setAportes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const aportesPerPage = 5;

  useEffect(() => {
    const fetchAportes = async () => {
      try {
        const response = await axios.get('/comunidad/showAportes');
        // Ordenar los aportes del más reciente al más antiguo
        const sortedAportes = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setAportes(sortedAportes);
        setIsLoading(false);
      } catch (error) {
        console.error('Error al obtener los aportes:', error);
        setIsLoading(false);
      }
    };

    fetchAportes();
  }, []);

  if (isLoading) {
    return <p className="text-center mt-4">Cargando...</p>;
  }

  const indexOfLastAporte = currentPage * aportesPerPage;
  const indexOfFirstAporte = indexOfLastAporte - aportesPerPage;

  // Verificar si aportes es un arreglo, de lo contrario, asignar un arreglo vacío
  const currentAportes = Array.isArray(aportes) ? aportes.slice(indexOfFirstAporte, indexOfLastAporte) : [];

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Comunidad</h1>

      {currentAportes.length > 0 ? (
        currentAportes.map((aporte) => <AportePost key={aporte._id} aporte={aporte} />)
      ) : (
        <div>
          <p>No hay aportes disponibles en la comunidad.</p>
          <Link to="/PostPage" className="bg-green-500 text-white px-4 py-2 rounded flex justify-center  mb-2">
            Crear Aporte
          </Link>
        </div>
      )}

      {aportes.length > aportesPerPage || currentAportes.length > 0 ? (
        <div className="flex justify-center mt-4">
          <div className="relative">

            <div className="relative top-0 left-0 right-0 bottom-0 flex justify-center items-center flex-col"> {/* Wrap in flex-col */}
              <Link to="/PostPage" className="bg-green-500 text-white px-4 py-2 rounded flex justify-center mb-2">
                Crear Aporte
              </Link>
              <div className="flex"> {/* Wrap the buttons in a flex container */}
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
        </div>
      ) : null}
    </div>
  );
};

export default ComunidadPage;
