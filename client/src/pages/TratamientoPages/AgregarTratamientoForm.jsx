import React, { useState } from 'react';
import axios from '../../api/axios';

const AgregarTratamientoForm = ({ pacienteId, cargarTratamientos }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [url, setUrl] = useState('');
  const [error, setError] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

 // Crear un objeto con los datos del tratamiento
const data = {
  nombre,
  descripcion,
  userId: pacienteId,
  url,
};

    try {
      // Enviar la solicitud POST para crear el tratamiento
      setIsLoading(true);
      const response = await axios.post('/tratamientos/createTratamiento', data, {
        withCredentials: true,
      });

      // El tratamiento se creó con éxito
      console.log('Tratamiento creado:', response.data);

      // Limpiar los campos del formulario
      setNombre('');
      setDescripcion('');
      setUrl('');
      setError(null);

      // Recargar la lista de diagnósticos para mostrar el tratamiento recién creado
      cargarTratamientos();
    } catch (error) {
      // Error al crear el tratamiento
      setError(error.response.data.message);
    } finally {
      setIsLoading(false);
    }

  };
  
  const toggleMostrarFormulario = () => {
    setMostrarFormulario((prevState) => !prevState);
  };

  return (
    <div>
      <button onClick={toggleMostrarFormulario} className="text-blue-500 underline mb-2">
        {mostrarFormulario ? 'Cancelar' : 'Agregar Tratamiento'}
      </button>

      {mostrarFormulario && (
        <form onSubmit={handleSubmit} className="bg-white p-4 shadow rounded-lg">
          <h3 className="text-lg font-bold mb-2 text-black">Agregar Tratamiento</h3>
          <div className="mb-2">
            <label className="block font-bold text-black">Nombre:</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500 text-black" // Changed text color to black
              required
            />
          </div>
          <div className="mb-2">
            <label className="block font-bold text-black">Descripción:</label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500 text-black" // Changed text color to black
              required
            />
          </div>
          <div className="mb-2">
            <label className="block font-bold text-black">URL:</label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500 text-black" // Changed text color to black
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
              'Crear Tratamiento'
            )}
          </button>
          {error && <p className="text-red-500 mt-2">Error al crear el tratamiento: {error}</p>}
        </form>
      )}
    </div>
  );
};

export default AgregarTratamientoForm;
