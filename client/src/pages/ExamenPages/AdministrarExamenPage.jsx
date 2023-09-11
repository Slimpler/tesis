import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../../api/axios';
import AgregarExamenForm from './AgregarExamenForm';
import EditarExamenForm from './EditarExamenForm';

const AdministrarExamenesPage = () => {
  const { pacienteId } = useParams();
  const [pacienteNombre, setPacienteNombre] = useState('');
  const [examenes, setExamenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingExamen, setEditingExamen] = useState(null);
  const [confirmEditar, setConfirmEditar] = useState(false);
  
  useEffect(() => {
    cargarPaciente();
    cargarExamenes();
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

  const cargarExamenes = async () => {
    try {
      const response = await axios.get(`/examenes/getExamen/${pacienteId}`, {
        withCredentials: true,
      });

      if (Array.isArray(response.data)) {
        setExamenes(response.data);
      } else {
        console.error('La respuesta del servidor no es un array:', response.data);
        setExamenes([]);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error al cargar los examenes:', error);
      setLoading(false);
    }
  };

  const handleEliminarExamen = async (examenId) => {
    const confirmarEliminar = window.confirm('¿Estás seguro de eliminar este examen?');

    if (confirmarEliminar) {
      try {
        await axios.delete(`/examenes/deleteExamen/${examenId}`, {
          withCredentials: true,
        });

        cargarExamenes();
      } catch (error) {
        console.error('Error al eliminar el examen:', error);
      }
    }
  };

  const handleEditarExamen = (examen) => {
    setEditingExamen(examen);
  };

  const handleCancelarEdicion = () => {
    setEditingExamen(null);
    setConfirmEditar(false); // Restablecer el estado de confirmación al cancelar la edición
  };


  const handleGuardarEdicion = async (editedExamen) => {
    if (confirmEditar) { // Verificar si se ha confirmado la edición
      try {
        await axios.put(`/diagnosticos/updateExamen/${editedExamen._id}`, editedExamen, {
          withCredentials: true,
        });
        cargarExamenes();
        setEditingExamen(null);
        setConfirmEditar(false); // Restablecer el estado de confirmación después de guardar
      } catch (error) {
        console.error('Error al editar el examen:', error);
      }
    } else {
      // Si no se ha confirmado la edición, mostrar el cuadro de diálogo de confirmación
      setConfirmEditar(true);
    }
  };

  return (
    <div className="max-w-screen-lg mx-auto p-4 md:p-9 text-black">
      <h2 className="text-2xl font-bold mb-4 text-white">Administrar Examenes de {pacienteNombre}</h2>
      <AgregarExamenForm pacienteId={pacienteId} cargarExamenes={cargarExamenes} />
    
      {/* Renderiza el formulario de edición si editingExamen tiene un valor */}
      {editingExamen ? (
        <EditarExamenForm
            examen={editingExamen}
            onCancel={handleCancelarEdicion}
            onSave={handleGuardarEdicion}
            cargarExamenes={cargarExamenes}

        />
      
      ) : null}
    
      {loading ? (
        <p className="mt-4">Cargando examenes...</p>
      ) : examenes.length === 0 ? (
        <p className="mt-4 text-white">No hay examenes para este paciente.</p>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">URL del Video</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {examenes.map((examen) => (
                <tr key={examen._id}>
                  <td className="px-6 py-4 whitespace-nowrap">{examen.nombre}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{examen.descripcion}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(examen.fechaExamen).toLocaleString()} 
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {examen.url && (
                      <a href={examen.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                          Ver Video
                        </button>
                      </a>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingExamen === examen ? (
                      // No mostrar botón de editar cuando se está editando
                      null
                    ) : (
                      // Botón de editar
                      <button
                        className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded mr-2"
                        onClick={() => handleEditarExamen(examen)}
                      >
                        Editar
                      </button>
                    )}

                    {/* Botón de eliminar */}
                    <button
                      className="text-red-500 hover:underline"
                      onClick={() => handleEliminarExamen(examen._id)}
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

export default AdministrarExamenesPage;
