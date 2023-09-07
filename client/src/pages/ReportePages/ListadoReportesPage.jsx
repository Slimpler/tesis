import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../../api/axios";

const ListadoReportesPacientesPage = () => {
  const [reportes, setReportes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const reportsPerPage = 5;

  useEffect(() => {
    cargarReportes();
  }, []);

  const cargarReportes = async () => {
    try {
      const response = await axios.get("/reportes/getReportes", {
        withCredentials: true,
      });
      console.log(response.data);
      
      if (Array.isArray(response.data)) {
        setReportes(response.data);
      } else {
        console.error(
          "La respuesta del servidor no es un array:",
          response.data
        );
        setReportes([]);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error al cargar la lista de reportes:", error);
      setLoading(false);
    }
  };

  const navigate = useNavigate();

  const filteredReports = reportes.filter((reporte) => {
    const searchText = `${reporte.user ? reporte.user.name : ""} ${
      reporte.user ? reporte.user.lastname : ""
    } ${reporte.sintoma}`;
    return searchText.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const indexOfLastReport = currentPage * reportsPerPage;
  const indexOfFirstReport = indexOfLastReport - reportsPerPage;
  const currentReports = filteredReports.slice(
    indexOfFirstReport,
    indexOfLastReport
  );

  const handleSearch = (e) => {
    const searchTerm = e.target.value;
    setSearchTerm(searchTerm);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(filteredReports.length / reportsPerPage);

  return (
    <div className="max-w-screen-lg mx-auto p-4 md:p-9">
      <h2 className="text-2xl font-bold mb-4">Lista de Reportes de Pacientes</h2>
      <div className="mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Buscar por nombre, apellido, síntoma, etc."
          className="border border-gray-300 px-4 py-2 rounded-md w-full text-black"
        />
      </div>
      <div className="overflow-x-auto">
        {loading ? (
          <p>Cargando reportes...</p>
        ) : currentReports.length === 0 ? (
          <p>No hay reportes que coincidan con la búsqueda.</p>
        ) : (
          <table className="table w-full border-collapse border border-gray-200">
         <thead>
            <tr className="bg-blue-500 text-white">
                <th className="px-4 py-2">Paciente</th>
                <th className="px-4 py-2">Síntoma</th>
                <th className="px-4 py-2">Fecha</th>
                <th className="px-4 py-2">Audio</th>
                <th className="px-4 py-2">Imagen</th>
                <th className="px-4 py-2">Respuesta</th>
            </tr>
            </thead>
            <tbody>
            {currentReports.map((reporte) => (
                <tr key={reporte._id}>
                <td className="border border-gray-200 px-4 py-2">
                    {reporte.user ? (
                    <Link className="text-blue-500 hover:underline">
                        {reporte.user.name} {reporte.user.lastname}
                    </Link>
                    ) : (
                    "N/A"
                    )}
                </td>
                <td className="border border-gray-200 px-4 py-2">
                    {reporte.sintoma}
                </td>
                <td className="border border-gray-200 px-4 py-2">
                    {new Date(reporte.date).toLocaleDateString()}
                </td>
                <td className="border border-gray-200 px-4 py-2">
                    <audio
                    src={reporte.audio}
                    controls
                    className="ml-2"
                    style={{ width: "240px", height: "40px" }}
                    />
                </td>
                <td className="border border-gray-200 px-4 py-2">
                    {reporte.imagen ? (
                    <div className="mt-4 justify-center">
                        <a href={reporte.imagen} download target="_blank">
                        <img
                            src={reporte.imagen}
                            alt="Imagen del reporte"
                            style={{ width: "120px", height: "auto", cursor: "pointer" }}
                        />
                        </a>
                    </div>
                    ) : (
                    "N/A"
                    )}
                </td>
                <td className="border border-gray-200 px-4 py-2">
                  {reporte.respuesta && reporte.respuesta.length > 0 ? (
                    reporte.respuesta.map((respuestaItem, index) => (
                      <div key={index}>
                        <div><strong>Respuesta:</strong> {respuestaItem.respuesta}</div>
                        <div><strong>Médico:</strong> {respuestaItem.medico ? respuestaItem.medico.nombre : "N/A"}</div>
                        <div><strong>Especialidad:</strong> {respuestaItem.medico ? respuestaItem.medico.especialidad : "N/A"}</div>
                      </div>
                    ))
                  ) : (
                    "N/A"
                  )}
                </td>
                </tr>
            ))}
            </tbody>
          </table>
        )}
      </div>
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
            disabled={indexOfLastReport >= filteredReports.length}
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
};

export default ListadoReportesPacientesPage;
