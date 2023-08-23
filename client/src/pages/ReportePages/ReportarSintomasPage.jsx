import React, { useState } from "react";
import axios from "../../api/axios";
import { useAuth } from "../../context/authContext"; // Asegúrate de importar el contexto de autenticación si no lo has hecho
import { useNavigate } from "react-router-dom";
// import { AudioRecorder } from "react-audio-voice-recorder";

const ReportarSintomasPage = () => {
  const { user } = useAuth(); // Mueve el hook dentro del componente funcional
  const navigate = useNavigate();
  // const [blobAudio, setBlobAudio] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({
    sintoma: "",
    audio: "",
    escala: "",
    date: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({
      ...data,
      [name]: value,
    });
  };

  // const addAudioElement = (blob) => {
  //   const url = URL.createObjectURL(blob);
  //   setBlobAudio(blob);
  
  //   const audio = document.createElement("audio");
  //   audio.src = url;
  //   audio.controls = true;
  
  //   const span = document.getElementById("audio");
  //   span.innerHTML = ""; // Limpiar el contenido previo
  //   span.appendChild(audio);
  // };
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (data.sintoma.trim() === "") {
      console.log("El campo de síntoma no puede estar vacío");
      return; // Detener el proceso de envío del formulario
    }
    try {
      const reporteData = {
        ...data,
        user: user.id,
      };

      const formData = new FormData();
      for (const key in reporteData) {
        formData.append(key, reporteData[key]);
      }

      formData.append("audio", blobAudio);
      // Envía la solicitud POST al endpoint de la API
      try {
        setIsLoading(true)
        const res = await axios.post("/reportes/createReporte", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      
        // Aquí puedes manejar la respuesta exitosa si es necesario
        console.log("Respuesta exitosa:", res.data);
      } catch (error) {
        // Aquí manejas los errores
        console.error("Error al hacer la solicitud:", error);
      
        // Puedes hacer cosas como mostrar un mensaje al usuario o realizar otra acción en caso de error
      }
      
      
      setIsLoading(false);
      navigate("/PacienteProfile"); // Use navigate to redirect to the home page after saving changes
      console.log("Nuevo reporte creado:", res.data);
      // Maneja el éxito o muestra un mensaje de éxito al usuario si es necesario
    } catch (error) {
      console.log("Error al crear el reporte:", error);
      // Maneja el error o muestra un mensaje de error al usuario si es necesario
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold text-black mb-4">Reportar Síntomas</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="sintoma" className="block font-medium  text-black">
            Síntoma:
          </label>
          <input
            type="text"
            id="sintoma"
            name="sintoma"
            value={data.sintoma}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none text-black focus:border-blue-500"
          />
        </div>
        {/* <div>
          <label htmlFor="audio" className="block font-medium  text-black">
            Audio:
          </label>
          <div className="flex justify-between">
            <AudioRecorder
              style={{ width: '240px', height: '40px' }}
              onRecordingComplete={addAudioElement}
              audioTrackConstraints={{
                noiseSuppression: true,
                echoCancellation: true,
              }}
              // downloadOnSavePress={true}
              // downloadFileExtension="webm"
            />
            <span id="audio"></span>
          </div>
        </div> */}
        <div>
    
        <label htmlFor="escala" className="block font-medium text-black">
          Intensidad de 1 a 10:
        </label>
        <input
          type="range"
          id="escala"
          name="escala"
          min="1"
          max="10"
          value={data.escala}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none text-black focus:border-blue-500"
        />
        {data.sintoma.trim() === "" && (
          <p className="text-red-500">El campo de síntoma no puede estar vacío</p>
        )}
        <span className="text-black">{data.escala}</span>
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
              'Crear Reporte'
            )}
          </button>
      </form>
    </div>
  );
};

export default ReportarSintomasPage;
