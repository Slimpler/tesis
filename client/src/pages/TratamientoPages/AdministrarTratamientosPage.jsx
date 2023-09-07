import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../../api/axios';
import AgregarTratamientoForm from './AgregarTratamientoForm';
import EditarTratamientoForm from './EditarTratamientoForm';

const AdministrarTratamientosPage = () => {
  const { pacienteId } = useParams();
  const [pacienteNombre, setPacienteNombre] = useState('');
  const [tratamientos, setTratamientos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingTratamiento, setEditingTratamiento] = useState(null);
  const [confirmEditar, setConfirmEditar] = useState(false);

  useEffect(() => {
    cargarPaciente();
    cargarTratamientos();
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

  const handleEditarTratamiento = (tratamiento) => {
    setEditingTratamiento(tratamiento);
  };

  const handleCancelarEdicion = () => {
    setEditingTratamiento(null);
    setConfirmEditar(false); // Restablecer el estado de confirmación al cancelar la edición
  };


  const handleGuardarEdicion = async (editedTratamiento) => {
    if (confirmEditar) { // Verificar si se ha confirmado la edición
      try {
        await axios.put(`/diagnosticos/updateTratamiento/${editedTratamiento._id}`, editedTratamiento, {
          withCredentials: true,
        });
        cargarTratamientos();
        setEditingTratamiento(null);
        setConfirmEditar(false); // Restablecer el estado de confirmación después de guardar
      } catch (error) {
        console.error('Error al editar el tratamiento:', error);
      }
    } else {
      // Si no se ha confirmado la edición, mostrar el cuadro de diálogo de confirmación
      setConfirmEditar(true);
    }
  };

  return (
    <div className="max-w-screen-lg mx-auto p-4 md:p-9 text-black">
      <h2 className="text-2xl font-bold mb-4 text-white">Administrar Tratamientos de {pacienteNombre}</h2>
      <AgregarTratamientoForm pacienteId={pacienteId} cargarTratamientos={cargarTratamientos} />
    
      {/* Renderiza el formulario de edición si editingTratamiento tiene un valor */}
      {editingTratamiento ? (
        <EditarTratamientoForm
            tratamiento={editingTratamiento}
            onCancel={handleCancelarEdicion}
            onSave={handleGuardarEdicion}
            cargarTratamientos={cargarTratamientos}

        />
      
      ) : null}
    
      {loading ? (
        <p className="mt-4">Cargando tratamientos...</p>
      ) : tratamientos.length === 0 ? (
        <p className="mt-4 text-white">No hay tratamientos para este paciente.</p>
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
              {tratamientos.map((tratamiento) => (
                <tr key={tratamiento._id}>
                  <td className="px-6 py-4 whitespace-nowrap">{tratamiento.nombre}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{tratamiento.descripcion}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {tratamiento.url && (
                      <a href={tratamiento.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                          Ver Video
                        </button>
                      </a>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingTratamiento === tratamiento ? (
                      // No mostrar botón de editar cuando se está editando
                      null
                    ) : (
                      // Botón de editar
                      <button
                        className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded mr-2"
                        onClick={() => handleEditarTratamiento(tratamiento)}
                      >
                        Editar
                      </button>
                    )}

                    {/* Botón de eliminar */}
                    <button
                      className="text-red-500 hover:underline"
                      onClick={() => handleEliminarTratamiento(tratamiento._id)}
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

export default AdministrarTratamientosPage;
