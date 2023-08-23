import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../../api/axios";

const ListaPacientesPage = () => {
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    cargarPacientes();
  }, []);

  const cargarPacientes = async () => {
    try {
      const response = await axios.get("/user/pacientes", {
        withCredentials: true,
      });
      console.log(response.data);

      if (Array.isArray(response.data)) {
        setPacientes(response.data);
      } else {
        console.error(
          "La respuesta del servidor no es un array:",
          response.data
        );
        setPacientes([]);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error al cargar la lista de pacientes:", error);
      setLoading(false);
    }
  };

  const handleEliminarReporte = async (reporteId) => {
    const confirmarEliminar = window.confirm(
      "¿Estás seguro de eliminar este reporte?"
    );

    if (confirmarEliminar) {
      try {
        await axios.delete(`/reportes/deleteReporte/${reporteId}`, {
          withCredentials: true,
        });

        cargarPacientes();
      } catch (error) {
        console.error("Error al eliminar el reporte:", error);
      }
    }
  };

  const handleResponderReporte = (reporteId) => {
    navigate(`/responderReporte/${reporteId}`);
  };

  const navigate = useNavigate();

  // Función para filtrar los pacientes por nombre, apellido o cualquier otro campo
  const filteredPacientes = pacientes.filter((paciente) => {
    const searchText = `${paciente.name} ${paciente.lastname} ${
      paciente.rut
    } ${paciente.diagnosticos
      ?.map((diagnostico) => diagnostico.nombre)
      .join(" ")}`;
    return searchText.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Restricción de aportes a mostrar (opcional)
  const MAX_APORTES = 5;

  // Función para verificar si un reporte tiene más de 2 días de antigüedad
  const isReporteAntiguo = (date) => {
    const today = new Date();
    const reporteDate = new Date(date);
    const diffInDays = (today - reporteDate) / (1000 * 3600 * 24);
    return diffInDays > 2;
  };

  return (
    <div className="max-w-screen-lg mx-auto p-4 md:p-9 ">
      <h2 className="text-2xl font-bold mb-4">Lista de Pacientes</h2>
      <div className="mb-4">
        {/* Input para el buscador */}
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar por nombre, apellido, rut, diagnóstico, etc."
          className="border border-gray-300 px-4 py-2 rounded-md w-full text-black"
        />
      </div>
      <div className="overflow-x-auto">
        {loading ? (
          <p>Cargando pacientes...</p>
        ) : filteredPacientes.length === 0 ? (
          <p>No hay pacientes que coincidan con la búsqueda.</p>
        ) : (
          <table className="table w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-blue-500 text-white">
                <th className="px-4 py-2">Nombre</th>
                <th className="px-4 py-2">Apellido</th>
                <th className="px-4 py-2">Diagnóstico</th>
                <th className="px-4 py-2">Tratamiento</th>
                <th className="px-4 py-2">Reportes</th>
                <th className="px-4 py-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredPacientes.map((paciente) => {
                const reportesToShow = paciente.reportes
                  .filter(
                    (reporte) =>
                      !reporte.respuesta.length &&
                      !isReporteAntiguo(reporte.date)
                  )
                  .slice(0, MAX_APORTES);
                return (
                  <tr key={paciente._id}>
                    <td className="border border-gray-200 px-4 py-2">
                      {paciente.name}
                    </td>
                    <td className="border border-gray-200 px-4 py-2">
                      {paciente.lastname}
                    </td>
                    <td className="border border-gray-200 px-4 py-2">
                      {paciente.diagnosticos &&
                      paciente.diagnosticos.length > 0 ? (
                        <ul className="list-disc pl-4">
                          {paciente.diagnosticos.map((diagnostico) => (
                            <li key={diagnostico._id}>
                              <strong>{diagnostico.nombre}:</strong>{" "}
                              {diagnostico.descripcion}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p>Sin diagnóstico</p>
                      )}
                    </td>
                    <td className="border border-gray-200 px-4 py-2">
                      {paciente.tratamientos &&
                      paciente.tratamientos.length > 0 ? (
                        <ul className="list-disc pl-4">
                          {paciente.tratamientos.map((tratamiento) => (
                            <li key={tratamiento._id}>
                              <strong>{tratamiento.nombre}:</strong>{" "}
                              {tratamiento.descripcion}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p>Sin tratamiento</p>
                      )}
                    </td>
                    <td className="border border-gray-200 px-4 py-2">
                      {reportesToShow.length > 0 ? (
                        <ul className="list-disc pl-4">
                          {reportesToShow.map((reporte) => (
                            <li key={reporte._id}>
                              <strong>Síntoma:</strong> {reporte.sintoma} -{" "}
                              <strong>Fecha:</strong>{" "}
                              {new Date(reporte.date).toLocaleDateString()}
                              <button
                                className="text-yellow-500 ml-2"
                                onClick={() =>
                                  handleResponderReporte(reporte._id)
                                }
                              >
                                Responder
                              </button>
                              <button
                                className="text-red-500 ml-2"
                                onClick={() =>
                                  handleEliminarReporte(reporte._id)
                                }
                              >
                                Eliminar
                              </button>
                              {/* <audio
                                src={`http://localhost:4001/uploads/${reporte.audio}`}
                                controls
                                className="ml-2"
                                style={{ width: '240px', height: '40px' }}
                              /> */}
                            </li>
                          ))}
                          {paciente.reportes.filter(
                            (reporte) =>
                              !reporte.respuesta.length &&
                              !isReporteAntiguo(reporte.date)
                          ).length > MAX_APORTES && (
                            <li
                              className="text-blue-500 cursor-pointer mt-2"
                              onClick={() =>
                                navigate(`/reportes/${paciente._id}`)
                              }
                            >
                              Ver más reportes...
                            </li>
                          )}
                        </ul>
                      ) : (
                        <p>Sin reportes recientes</p>
                      )}
                    </td>
                    <td className="border border-gray-200 px-4 py-2">
                      <Link to={`/diagnosticos/${paciente._id}`}>
                        <button className="text-green-500 mr-2">
                          Diagnósticos
                        </button>
                      </Link>
                      <Link to={`/tratamientos/${paciente._id}`}>
                        <button className="text-purple-500 mr-2">
                          Tratamientos
                        </button>
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ListaPacientesPage;
