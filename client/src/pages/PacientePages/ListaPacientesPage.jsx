import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../../api/axios";

const ListaPacientesPage = () => {
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const patientsPerPage = 5;

  // Restricción de aportes a mostrar 
  const MAX_APORTES = 5;

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

  const filteredPacientes = pacientes.filter((paciente) => {
    const searchText = `${paciente.name} ${paciente.lastname} ${
      paciente.rut
    } ${paciente.diagnosticos
      ?.map((diagnostico) => diagnostico.nombre)
      .join(" ")}`;
    return searchText.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const indexOfLastPatient = currentPage * patientsPerPage;
  const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;
  const currentPatients = filteredPacientes.slice(
    indexOfFirstPatient,
    indexOfLastPatient
  );

  const isReporteAntiguo = (date) => {
    const today = new Date();
    const reporteDate = new Date(date);
    const diffInDays = (today - reporteDate) / (1000 * 3600 * 24);
    return diffInDays > 2;
  };

  const handleSearch = (e) => {
    const searchTerm = e.target.value;
    setSearchTerm(searchTerm);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(filteredPacientes.length / patientsPerPage);

  return (
    <div className="max-w-screen-lg mx-auto p-4 md:p-9 ">
      <h2 className="text-2xl font-bold mb-4">Lista de Pacientes</h2>
      <div className="mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Buscar por nombre, apellido, rut, diagnóstico, etc."
          className="border border-gray-300 px-4 py-2 rounded-md w-full text-black"
        />
      </div>
      <div className="overflow-x-auto">
        {loading ? (
          <p>Cargando pacientes...</p>
        ) : currentPatients.length === 0 ? (
          <p>No hay pacientes que coincidan con la búsqueda.</p>
        ) : (
          <table className="table w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-blue-500 text-white">
                <th className="px-4 py-2">Nombre</th>
                <th className="px-4 py-2">Apellido</th>
                <th className="px-4 py-2">Reportes</th>
                <th className="px-4 py-2">OTROS</th>
              </tr>
            </thead>
            <tbody>
              {currentPatients.map((paciente) => {
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
                      {reportesToShow.length > 0 ? (
                        <ul className="list-disc pl-4">
                          {reportesToShow.map((reporte) => (
                            <li key={reporte._id}>
                              <strong>Síntoma:</strong> {reporte.sintoma} -{" "}
                              <strong>Fecha:</strong>{" "}
                              {new Date(reporte.date).toLocaleDateString()}
                              <audio
                                src={`${reporte.audio}`}
                                controls
                                className="ml-2"
                                style={{ width: "240px", height: "40px" }}
                              />
                              {reporte.imagen && (
                                  <div className="mt-4 justify-center">
                                  <a
                                    href={reporte.imagen}
                                    download
                                    target="_blank"
                                  >
                                    <img
                                      src={reporte.imagen}
                                      alt="Imagen del reporte"
                                      style={{ width: "120px", height: "auto", cursor: "pointer" }}
                                    />
                                  </a>
                                </div>
            
                                
                                
                                )}
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
                      <Link to={`/examenes/${paciente._id}`}>
                        <button className="text-yellow-500 mr-2">
                          Examenes
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
      <button
            onClick={() =>
             navigate("/listado-reportes-pacientes")
            }
            className="bg-gray-200 mt-5 text-black font-semibold rounded-md px-4 py-2 justify-center"
            
          >
            Reportes
        </button>
      {totalPages > 1 && (
        <div className="flex justify-center mt-4">
          <button
            onClick={() =>
              setCurrentPage(currentPage > 1 ? currentPage - 1 : currentPage)
            }
            className="bg-gray-200 text-black font-semibold rounded-md px-4 py-2 mr-2"
            disabled={currentPage === 1}
          >
            Anterior
          </button>
          <button
            onClick={() =>
              setCurrentPage(
                currentPage < totalPages ? currentPage + 1 : currentPage
              )
            }
            className="bg-gray-200 text-black font-semibold rounded-md px-4 py-2"
            disabled={indexOfLastPatient >= filteredPacientes.length}
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
};

export default ListaPacientesPage;
