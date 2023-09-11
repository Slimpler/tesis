import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/authContext';
import axios from '../../api/axios';
import { Link } from 'react-router-dom';
import ReactPlayer from 'react-player';

const PacienteProfilePage = () => {
  const { user, loading } = useAuth();
  const [perfilPaciente, setPerfilPaciente] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSection, setSelectedSection] = useState(null);

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
    <div className="max-w-6xl mx-auto p-4 bg-gray-100 rounded-lg shadow-md text-black">
      <h1 className="text-3xl font-bold mb-4 text-center">{`${perfilPaciente.name} ${perfilPaciente.lastname}`}</h1>

      {/* Botones para mostrar/ocultar secciones */}
      <div className="flex flex-wrap justify-center space-y-2 md:space-y-0 md:space-x-2 mb-4">
        <button
          className={`${
            selectedSection === 'diagnostico' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'
          } px-4 py-2 rounded-lg flex-1 md:flex-initial mr-2`}
          onClick={() => setSelectedSection('diagnostico')}
        >
          Diagnósticos
        </button>
        <button
          className={`${
            selectedSection === 'tratamientos' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'
          } px-4 py-2 rounded-lg flex-1 md:flex-initial mr-2`}
          onClick={() => setSelectedSection('tratamientos')}
        >
          Tratamientos
        </button>
        <button
          className={`${
            selectedSection === 'examenes' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'
          } px-4 py-2 rounded-lg flex-1 md:flex-initial mr-2`}
          onClick={() => setSelectedSection('examenes')}
        >
          Examenes
        </button>
        <button
          className={`${
            selectedSection === 'reportes' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'
          } px-4 py-2 rounded-lg flex-1 md:flex-initial`}
          onClick={() => setSelectedSection('reportes')}
        >
          Reportes
        </button>
      </div>

      {/* Sección Diagnósticos */}
      {selectedSection === 'diagnostico' && (
        <div className="mt-4">
          <h3 className="text-lg font-bold mb-2">Diagnósticos:</h3>
          <div className="overflow-x-auto">
            {perfilPaciente.diagnosticos && perfilPaciente.diagnosticos.length > 0 ? (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nombre
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Descripción
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Video orientativo
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {perfilPaciente.diagnosticos.map((diagnostico) => (
                    <tr key={diagnostico._id}>
                      <td className="px-6 py-4 whitespace-nowrap">{diagnostico.nombre}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{diagnostico.descripcion}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {diagnostico.url ? (
                          <ReactPlayer url={diagnostico.url} width="200px" height="100px" />
                        ) : (
                          <p className="text-gray-400">No hay video disponible.</p>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No hay diagnósticos disponibles.</p>
            )}
          </div>
        </div>
      )}


      {/* Sección Tratamientos */}
      {selectedSection === 'tratamientos' && (
        <div className="mt-4">
          <h3 className="text-lg font-bold mb-2">Tratamientos:</h3>
          <div className="overflow-x-auto">
            {perfilPaciente.tratamientos && perfilPaciente.tratamientos.length > 0 ? (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nombre
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Descripción
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Video orientativo
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {perfilPaciente.tratamientos.map((tratamiento) => (
                    <tr key={tratamiento._id}>
                      <td className="px-6 py-4 whitespace-nowrap">{tratamiento.nombre}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{tratamiento.descripcion}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {new Date(tratamiento.fechaTratamiento).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {tratamiento.url ? (
                          <ReactPlayer url={tratamiento.url} width="200px" height="100px" />
                        ) : (
                          <p className="text-gray-400">No hay video disponible.</p>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No hay tratamientos disponibles.</p>
            )}
          </div>
        </div>
      )}
    
      {/* Sección Examenes */}
      {selectedSection === 'examenes' && (
      <div className="mt-4">
        <h3 className="text-lg font-bold mb-2">Tratamientos:</h3>
        <div className="overflow-x-auto">
          {perfilPaciente.tratamientos && perfilPaciente.tratamientos.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nombre
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Descripción
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Video orientativo
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {perfilPaciente.examenes.map((examen) => (
                  <tr key={examen._id}>
                    <td className="px-6 py-4 whitespace-nowrap">{examen.nombre}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{examen.descripcion}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(examen.fechaExamen).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {examen.url ? (
                        <ReactPlayer url={examen.url} width="200px" height="100px" />
                      ) : (
                        <p className="text-gray-400">No hay video disponible.</p>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No hay examenes disponibles.</p>
          )}
        </div>
      </div>
    )}

      {/* Sección Reportes */}
      {selectedSection === 'reportes' && (
       
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
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No hay Reportes disponibles.</p>
            )}
          </div>
        </div>
      )}

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
