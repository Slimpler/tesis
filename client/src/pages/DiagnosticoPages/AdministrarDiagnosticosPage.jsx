import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../../api/axios';
import AgregarDiagnosticoForm from './AgregarDiagnosticoForm';

const AdministrarDiagnosticosPage = () => {
  const { pacienteId } = useParams();
  const [diagnosticos, setDiagnosticos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarDiagnosticos();
  }, [pacienteId]);

  const cargarDiagnosticos = async () => {
    try {
      const response = await axios.get(`/diagnosticos/getDiagnostico/${pacienteId}`, {
        withCredentials: true,
      });

      if (Array.isArray(response.data)) {
        setDiagnosticos(response.data);
      } else {
        console.error('La respuesta del servidor no es un array:', response.data);
        setDiagnosticos([]);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error al cargar los diagnósticos:', error);
      setLoading(false);
    }
  };

  const handleEliminarDiagnostico = async (diagnosticoId) => {
    const confirmarEliminar = window.confirm('¿Estás seguro de eliminar este diagnóstico?');

    if (confirmarEliminar) {
      try {
        await axios.delete(`/diagnosticos/deleteDiagnostico/${diagnosticoId}`, {
          withCredentials: true,
        });

        cargarDiagnosticos();
      } catch (error) {
        console.error('Error al eliminar el diagnóstico:', error);
      }
    }
  };

  return (
    <div className="max-w-screen-lg mx-auto p-4 md:p-9">
      <h2 className="text-2xl font-bold mb-4">Administrar Diagnósticos</h2>
      <AgregarDiagnosticoForm pacienteId={pacienteId} cargarDiagnosticos={cargarDiagnosticos} />
      {loading ? (
        <p className="mt-4">Cargando diagnósticos...</p>
      ) : diagnosticos.length === 0 ? (
        <p className="mt-4">No hay diagnósticos para este paciente.</p>
      ) : (
        <ul className="mt-4">
          {diagnosticos.map((diagnostico) => (
            <li key={diagnostico._id} className="mb-4">
              <strong>Nombre:</strong> {diagnostico.nombre} <br />
              <strong>Descripción:</strong> {diagnostico.descripcion} <br />
              <strong>Url:</strong> {diagnostico.url}{' '}
              <button
                className="text-red-500 ml-4"
                onClick={() => handleEliminarDiagnostico(diagnostico._id)}
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

export default AdministrarDiagnosticosPage;
