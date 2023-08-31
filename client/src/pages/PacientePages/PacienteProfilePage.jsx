import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/authContext';
import axios from '../../api/axios';
import { Link } from 'react-router-dom';
import ReactPlayer from 'react-player';

const PacienteProfilePage = () => {
  const { user, loading } = useAuth();
  const [perfilPaciente, setPerfilPaciente] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPerfilPaciente = async () => {
      try {
        const res = await axios.get('/user/profile');
        setPerfilPaciente(res.data.data);
        setIsLoading(false);
      } catch (error) {
        console.log('Error al obtener el perfil del paciente:', error);
        setPerfilPaciente(null);
        setIsLoading(false);
      }
    };

    fetchPerfilPaciente();
  }, []);

  if (loading || isLoading) {
    return <p className="text-center mt-4">Cargando...</p>;
  }

  const reportesRecientes = perfilPaciente.reportes.filter((reporte) => {
    const fechaReporte = new Date(reporte.date);
    const fechaActual = new Date();
    const diferenciaDias = (fechaActual - fechaReporte) / (1000 * 60 * 60 * 24);
    return diferenciaDias <= 2;
  });

  return (
    <div className="max-w-4xl mx-auto p-4 bg-gray-100 rounded-lg shadow-md text-black">
      <h1 className="text-3xl font-bold mb-4 text-center">{`${perfilPaciente.name} ${perfilPaciente.lastname}`}</h1>

      {/* Sección Diagnósticos */}
      <div className="mt-4">
        <h3 className="text-lg font-bold mb-2">Diagnósticos:</h3>
        <div className="overflow-x-auto">
          {perfilPaciente.diagnosticos && perfilPaciente.diagnosticos.length > 0 ? (
            <table className="min-w-full table-auto border-collapse mb-4">
              <thead>
                <tr>
                  <th className="border border-gray-400 px-4 py-2 font-bold">Nombre</th>
                  <th className="border border-gray-400 px-4 py-2 font-bold">Descripción</th>
                  <th className="border border-gray-400 px-4 py-2 font-bold">Video orientativo</th>
                  <th className="border border-gray-400 px-4 py-2 font-bold">Médico</th>
                  <th className="border border-gray-400 px-4 py-2 font-bold">Especialidad</th>
                </tr>
              </thead>
              <tbody>
                {perfilPaciente.diagnosticos.map((diagnostico) => (
                  <tr key={diagnostico._id}>
                    <td className="border border-gray-400 px-4 py-2">{diagnostico.nombre}</td>
                    <td className="border border-gray-400 px-4 py-2">{diagnostico.descripcion}</td>
                    <td className="border border-gray-400 px-4 py-2">
                      {diagnostico.url ? (
                         <ReactPlayer
                         url={diagnostico.url}
                         width="300px"
                         height="200px"
                       />
                     ) : (
                       <p>No hay video disponible.</p>
                      )}
                    </td>
                    <td className="border border-gray-400 px-4 py-2">{diagnostico.medico?.nombre}</td>
                    <td className="border border-gray-400 px-4 py-2">{diagnostico.medico?.especialidad}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No hay diagnósticos disponibles.</p>
          )}
        </div>
      </div>

      {/* Sección Tratamientos */}
      <div className="mt-4">
        <h3 className="text-lg font-bold mb-2">Tratamientos:</h3>
        <div className="overflow-x-auto">
          {perfilPaciente.tratamientos && perfilPaciente.tratamientos.length > 0 ? (
            <table className="min-w-full table-auto border-collapse mb-4">
              <thead>
                <tr>
                  <th className="border border-gray-400 px-4 py-2 font-bold">Nombre</th>
                  <th className="border border-gray-400 px-4 py-2 font-bold">Descripción</th>
                  <th className="border border-gray-400 px-4 py-2 font-bold">Video orientativo</th>
                  <th className="border border-gray-400 px-4 py-2 font-bold">Médico</th>
                  <th className="border border-gray-400 px-4 py-2 font-bold">Especialidad</th>
                </tr>
              </thead>
              <tbody>
                {perfilPaciente.tratamientos.map((tratamiento) => (
                  <tr key={tratamiento._id}>
                    <td className="border border-gray-400 px-4 py-2">{tratamiento.nombre}</td>
                    <td className="border border-gray-400 px-4 py-2">{tratamiento.descripcion}</td>
                    <td className="border border-gray-400 px-4 py-2">
                      {tratamiento.url ? (
                         <ReactPlayer
                         url={tratamiento.url}
                         width="300px"
                         height="200px"
                       />
                     ) : (
                       <p>No hay video disponible.</p>
                      )}
                    </td>
                    <td className="border border-gray-400 px-4 py-2">{tratamiento.medico?.nombre}</td>
                    <td className="border border-gray-400 px-4 py-2">{tratamiento.medico?.especialidad}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No hay tratamientos disponibles.</p>
          )}
        </div>
      </div>

      {/* Sección Reportes */}
      <div className="mt-4">
        <h3 className="text-lg font-bold mb-2">Reportes:</h3>
        <div className="overflow-x-auto">
          {reportesRecientes && reportesRecientes.length > 0 ? (
            <table className="min-w-full table-auto border-collapse mb-4">
              <thead>
                <tr>
                  <th className="border border-gray-400 px-4 py-2 font-bold">Síntoma</th>
                  <th className="border border-gray-400 px-4 py-2 font-bold">Escala</th>
                  <th className="border border-gray-400 px-4 py-2 font-bold">Respuesta</th>
                  <th className="border border-gray-400 px-4 py-2 font-bold">Médico</th>
                  <th className="border border-gray-400 px-4 py-2 font-bold">Especialidad</th>
                </tr>
              </thead>
              <tbody>
                {reportesRecientes.map((reporte) => (
                  <tr key={reporte._id}>
                    <td className="border border-gray-400 px-4 py-2">{reporte.sintoma}</td>
                    <td className="border border-gray-400 px-4 py-2">{reporte.escala}</td>
                    <td className="border border-gray-400 px-4 py-2">
                      {reporte.respuesta.map((respuesta) => (
                        <div key={respuesta._id}>{respuesta.respuesta}</div>
                      ))}
                    </td>
                    <td className="border border-gray-400 px-4 py-2">
                      {reporte.respuesta.map((respuesta) => (
                        <div key={respuesta._id}>{respuesta.medico?.nombre}</div>
                      ))}
                    </td>
                    <td className="border border-gray-400 px-4 py-2">
                      {reporte.respuesta.map((respuesta) => (
                        <div key={respuesta._id}>{respuesta.medico?.especialidad}</div>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No hay Reportes disponibles.</p>
          )}
        </div>
      </div>

      <div className="mt-8 flex flex-wrap justify-center">
        <Link
          to="/ReportarSintoma"
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg block mx-2 mb-2"
        >
          Reportar Síntoma
        </Link>

        <Link
          to="/ComunidadPage"
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg block mx-2 mb-2"
        >
          Comunidad
        </Link>
      </div>
    </div>
  );
};

export default PacienteProfilePage;
