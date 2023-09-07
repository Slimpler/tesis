import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../../api/axios';
import AgregarDiagnosticoForm from './AgregarDiagnosticoForm';
import EditarDiagnosticoForm from './EditarDiagnosticoForm'; // Importa el nuevo componente

const AdministrarDiagnosticosPage = () => {
  const { pacienteId } = useParams();
  const [pacienteNombre, setPacienteNombre] = useState('');
  const [diagnosticos, setDiagnosticos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingDiagnostico, setEditingDiagnostico] = useState(null);
  const [confirmEditar, setConfirmEditar] = useState(false);

  useEffect(() => {
    cargarPaciente();
    cargarDiagnosticos();
  }, [pacienteId]);

  const cargarPaciente = async () => {
    try {
      const response = await axios.get(`/user/usersPacientes/${pacienteId}`, {
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

  const handleEditarDiagnostico = (diagnostico) => {
    setEditingDiagnostico(diagnostico);
  };

  const handleCancelarEdicion = () => {
    setEditingDiagnostico(null);
    setConfirmEditar(false); // Restablecer el estado de confirmación al cancelar la edición
  };

  const handleGuardarEdicion = async (editedDiagnostico) => {
    if (confirmEditar) { // Verificar si se ha confirmado la edición
      try {
        await axios.put(`/diagnosticos/updateDiagnostico/${editedDiagnostico._id}`, editedDiagnostico, {
          withCredentials: true,
        });
        cargarDiagnosticos();
        setEditingDiagnostico(null);
        setConfirmEditar(false); // Restablecer el estado de confirmación después de guardar
      } catch (error) {
        console.error('Error al editar el diagnóstico:', error);
      }
    } else {
      // Si no se ha confirmado la edición, mostrar el cuadro de diálogo de confirmación
      setConfirmEditar(true);
    }
  };

  return (
    <div className="max-w-screen-lg mx-auto p-4 md:p-9 text-black">
      <h2 className="text-2xl font-bold mb-4 text-white">Administrar Diagnósticos de {pacienteNombre}</h2>
      <AgregarDiagnosticoForm pacienteId={pacienteId} cargarDiagnosticos={cargarDiagnosticos} />

      {/* Renderiza el formulario de edición si editingDiagnostico tiene un valor */}
      {editingDiagnostico ? (
        <EditarDiagnosticoForm
            diagnostico={editingDiagnostico}
            onCancel={handleCancelarEdicion}
            onSave={handleGuardarEdicion}
            cargarDiagnosticos={cargarDiagnosticos}

        />
      
      ) : null}

      {loading ? (
        <p className="mt-4">Cargando diagnósticos...</p>
      ) : diagnosticos.length === 0 ? (
        <p className="mt-4 text-white">No hay diagnósticos para este paciente.</p>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estadio</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">URL del Video</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {diagnosticos.map((diagnostico) => (
                <tr key={diagnostico._id}>
                  <td className="px-6 py-4 whitespace-nowrap">{diagnostico.nombre}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{diagnostico.estadio}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{diagnostico.descripcion}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {diagnostico.url && (
                      <a href={diagnostico.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                          Ver Video
                        </button>
                      </a>
                    )}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingDiagnostico === diagnostico ? (
                      // No mostrar botón de editar cuando se está editando
                      null
                    ) : (
                      // Botón de editar
                      <button
                        className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded mr-2"
                        onClick={() => handleEditarDiagnostico(diagnostico)}
                      >
                        Editar
                      </button>
                    )}

                    {/* Botón de eliminar */}
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
