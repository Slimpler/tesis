import React, { useState } from 'react';
import axios from '../../api/axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'; // Estilos de React-datepicker
import 'react-datepicker/dist/react-datepicker-cssmodules.css'; // Estilos CSS modules de React-datepicker (para Tailwind)


const AgregarExamenForm = ({ pacienteId, cargarExamenes }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [fechaExamen, setFechaExamen] = useState('');
  const [url, setUrl] = useState('');
  const [error, setError] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  const handleDateChange = (date) => {
    // Verificar si la fecha seleccionada es futura antes de actualizar el estado
    const currentDate = new Date();
    console.log(currentDate)
    if (date > currentDate) {
      // Actualiza el estado de fechaExamen
      setFechaExamen(date);
    } else {
      alert('Selecciona una fecha futura');
    }
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Verificar si fechaExamen es un objeto Date
    if (!(fechaExamen instanceof Date)) {
      alert('Selecciona una fecha futura');
      return;
    }
  
    // Crear un objeto con los datos del examen
    const data = {
      nombre,
      descripcion,
      fechaExamen: fechaExamen.toISOString(),
      userId: pacienteId,
      url,
    };
  
    try {
      // Enviar la solicitud POST para crear el examen
      setIsLoading(true);
      const response = await axios.post('/examenes/createExamen', data, {
        withCredentials: true,
      });
  
      if (response && response.data) {
        console.log(response.data);
      } else {
        console.log('Respuesta del servidor no contiene datos válidos.');
      }
  
      // El examen se creó con éxito
      // console.log('Examen creado:', response.data);
  
      // Limpiar los campos del formulario
      setNombre('');
      setDescripcion('');
      setFechaExamen(null); // Asignar null a fechaExamen
      setUrl('');
      setError(null);
  
      // Recargar la lista de diagnósticos para mostrar el examen recién creado
      cargarExamenes();
      setMostrarFormulario(false);
    } catch (error) {
      // Error al crear el examen
      console.log('Error de respuesta completa:', error.response);
      setError(error.response?.data?.message || 'Error desconocido');
  
      // Agregar una alerta o registro de error
      console.error('Error al crear el examen:', error);
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
        {mostrarFormulario ? 'Cancelar' : 'Agregar Examen'}
      </button>

      {mostrarFormulario && (
        <form onSubmit={handleSubmit} className="bg-white p-4 shadow rounded-lg">
          <h3 className="text-lg font-bold mb-2 text-black">Agregar Examen</h3>
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
            <label className="block font-bold text-black">Fecha y Hora del Examen:</label>
            <DatePicker
              selected={fechaExamen} // Cambiar selectedDate por fechaExamen
              onChange={handleDateChange}
              minDate={new Date()}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              timeCaption="Hora"
              dateFormat="dd/MM/yyyy h:mm aa"
              placeholderText="Selecciona una fecha y hora"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500 text-black"
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
              'Crear Examen'
            )}
          </button>
          {error && <p className="text-red-500 mt-2">Error al crear el examen: {error}</p>}
        </form>
      )}
    </div>
  );
};

export default AgregarExamenForm;
