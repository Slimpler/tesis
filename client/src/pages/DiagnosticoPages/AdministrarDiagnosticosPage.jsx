import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../../api/axios';
import AgregarDiagnosticoForm from './AgregarDiagnosticoForm';

const AdministrarDiagnosticosPage = () => {
  const { pacienteId } = useParams();
  const [pacienteNombre, setPacienteNombre] = useState('');
  const [diagnosticos, setDiagnosticos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarPaciente();
    cargarDiagnosticos();
  }, [pacienteId]);

  const cargarPaciente = async () => {
    try {
      const response = await axios.get(`/user/users/${pacienteId}`, {
        withCredentials: true,
      });

      setPacienteNombre(`${response.data.name} ${response.data.lastname}`);
    } catch (error) {
      console.error('Error al cargar el paciente:', error);
    }
  };

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
    <div className="max-w-screen-lg mx-auto p-4 md:p-9 text-black">
      <h2 className="text-2xl font-bold mb-4 text-white">Administrar Diagnósticos de {pacienteNombre}</h2>
      <AgregarDiagnosticoForm pacienteId={pacienteId} cargarDiagnosticos={cargarDiagnosticos} />
      {loading ? (
        <p className="mt-4">Cargando diagnósticos...</p>
      ) : diagnosticos.length === 0 ? (
        <p className="mt-4">No hay diagnósticos para este paciente.</p>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">URL del Video</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {diagnosticos.map((diagnostico) => (
                <tr key={diagnostico._id}>
                  <td className="px-6 py-4 whitespace-nowrap">{diagnostico.nombre}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{diagnostico.descripcion}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {diagnostico.url && <a href={diagnostico.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{diagnostico.url}</a>}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      className="text-red-500 hover:underline"
                      onClick={() => handleEliminarDiagnostico(diagnostico._id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdministrarDiagnosticosPage;
