import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../../api/axios';
import AgregarTratamientoForm from './AgregarTratamientoForm';

const AdministrarTratamientosPage = () => {
  const { pacienteId } = useParams();
  const [tratamientos, setTratamientos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarTratamientos();
  }, [pacienteId]);

  const cargarTratamientos = async () => {
    try {
      const response = await axios.get(`/tratamientos/getTratamiento/${pacienteId}`, {
        withCredentials: true,
      });

      if (Array.isArray(response.data)) {
        setTratamientos(response.data);
      } else {
        console.error('La respuesta del servidor no es un array:', response.data);
        setTratamientos([]);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error al cargar los tratamientos:', error);
      setLoading(false);
    }
  };

  const handleEliminarTratamiento = async (tratamientoId) => {
    const confirmarEliminar = window.confirm('¿Estás seguro de eliminar este tratamiento?');

    if (confirmarEliminar) {
      try {
        await axios.delete(`/tratamientos/deleteTratamiento/${tratamientoId}`, {
          withCredentials: true,
        });

        cargarTratamientos();
      } catch (error) {
        console.error('Error al eliminar el tratamiento:', error);
      }
    }
  };

  return (
    <div className="max-w-screen-lg mx-auto p-4 md:p-9">
      <h2 className="text-2xl font-bold mb-4">Administrar Tratamientos</h2>
      <AgregarTratamientoForm pacienteId={pacienteId} cargarTratamientos={cargarTratamientos} />
      {loading ? (
        <p className="mt-4">Cargando tratamientos...</p>
      ) : tratamientos.length === 0 ? (
        <p className="mt-4">No hay tratamientos para este paciente.</p>
      ) : (
        <ul className="mt-4">
          {tratamientos.map((tratamiento) => (
            <li key={tratamiento._id} className="mb-4">
              <strong>Nombre:</strong> {tratamiento.nombre} <br />
              <strong>Descripción:</strong> {tratamiento.descripcion} <br />
              <button
                className="text-red-500 mt-2"
                onClick={() => handleEliminarTratamiento(tratamiento._id)}
              >
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdministrarTratamientosPage;
