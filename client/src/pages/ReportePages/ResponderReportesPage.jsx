import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../../api/axios';

const ResponderReportesPage = () => {
  const { reporteId } = useParams();
  const [respuesta, setRespuesta] = useState('');
  const [reporte, setReporte] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false)

  const navigate = useNavigate();

  useEffect(() => {
    cargarReporte();
  }, []);

  const cargarReporte = async () => {
    try {
      const response = await axios.get(`/reportes/getReporte/${reporteId}`);
      if (response.data) {
        setReporte(response.data);
        setRespuesta(response.data.respuesta[0]?.respuesta || ''); // Establece el valor inicial de respuesta del reporte si está disponible, de lo contrario, establece una cadena vacía.
        setLoading(false);
      } else {
        console.error('Reporte no encontrado');
        setLoading(false);
      }
    } catch (error) {
      console.error('Error al cargar el reporte:', error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.put(`/reportes/responderReporte/${reporteId}`, {
        respuesta: respuesta,
      });
      
      console.log('Respuesta enviada:', response.data);
      navigate('/listaPacientes');
    } catch (error) {
      console.error('Error al enviar la respuesta:', error);
    }
    finally{
      setIsLoading(false);
    }
  };

  if (loading) {
    return <p>Cargando el reporte...</p>;
  }

  if (!reporte) {
    return <p>El reporte no existe.</p>;
  }

  return (
    <div className="max-w-md mx-auto p-4 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Responder Reporte</h1>
      <p className="text-black">
        <strong className="text-black">Síntoma:</strong> {reporte.sintoma}
      </p>
      <p className="text-black">
        <strong className="text-black">Fecha:</strong>{' '}
        {new Date(reporte.date).toLocaleDateString()}
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="respuesta" className="block font-medium text-black">
            Respuesta:
          </label>
          <textarea
            id="respuesta"
            value={respuesta}
            onChange={(e) => setRespuesta(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none text-black focus:border-blue-500"
            rows="4"
          />
        </div>
        <button
            type="submit"
            className="bg-blue-500 text-white font-semibold rounded-lg px-4 py-2"
            disabled={isLoading} // Deshabilitar el botón mientras se procesa
          >
            {isLoading ? (
              <svg
                className="animate-spin h-5 w-5 mr-3"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.86 3.182 7.98l2.828-2.828z"
                ></path>
              </svg>
            ) : (
              'Enviar Respuesta'
            )}
          </button>
      </form> 
    </div>
  );
};

export default ResponderReportesPage;
