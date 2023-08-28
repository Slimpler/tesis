import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../../api/axios';

const ResponderReportesPage = () => {
  const { reporteId } = useParams();
  const [respuesta, setRespuesta] = useState('');
  const [reporte, setReporte] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    cargarReporte();
  }, []);

  const cargarReporte = async () => {
    try {
      const response = await axios.get(`/reportes/getReporte/${reporteId}`);
      if (response.data) {
        setReporte(response.data);
        setRespuesta(response.data.respuesta[0]?.respuesta || '');
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

    if (respuesta.trim() === '') {
      setErrorMessage('La respuesta no puede estar vacía.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.put(`/reportes/responderReporte/${reporteId}`, {
        respuesta: respuesta,
      });

      console.log('Respuesta enviada:', response.data);
      navigate('/listaPacientes');
    } catch (error) {
      console.error('Error al enviar la respuesta:', error);
    } finally {
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

      {errorMessage && (
        <p className="text-red-500 mb-2">{errorMessage}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="respuesta" className="block font-medium text-black">
            Respuesta:
          </label>
          <textarea
            id="respuesta"
            value={respuesta}
            onChange={(e) => {
              setRespuesta(e.target.value);
              setErrorMessage(''); // Clear error message when user starts typing
            }}
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none text-black focus:border-blue-500"
            rows="4"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white font-semibold rounded-lg px-4 py-2"
          disabled={isLoading}
        >
          {isLoading ? (
            <svg
              className="animate-spin h-5 w-5 mr-3"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              {/* ... (existing SVG code) */}
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
