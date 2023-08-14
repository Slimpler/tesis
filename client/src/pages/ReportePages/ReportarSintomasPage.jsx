import React, { useState } from "react";
import axios from "../../api/axios";
import { useAuth } from "../../context/authContext"; // Asegúrate de importar el contexto de autenticación si no lo has hecho
import { useNavigate } from "react-router-dom";
// import { AudioRecorder } from "react-audio-voice-recorder";

const ReportarSintomasPage = () => {
  const { user } = useAuth(); // Mueve el hook dentro del componente funcional
  const navigate = useNavigate();
  const [blobAudio, setBlobAudio] = useState(null);
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
    try {
      const reporteData = {
        ...data,
        user: user.id,
      };

      const formData = new FormData();
      for (const key in reporteData) {
        formData.append(key, reporteData[key]);
      }

      // formData.append("audio", blobAudio);

      // Envía la solicitud POST al endpoint de la API
      const res = await axios.post("/reportes/createReporte", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        }
      });
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
        <div>
          <label htmlFor="audio" className="block font-medium  text-black">
            Audio:
          </label>
          <div className="flex justify-between">
            {/* <AudioRecorder
              style={{ width: '240px', height: '40px' }}
              onRecordingComplete={addAudioElement}
              audioTrackConstraints={{
                noiseSuppression: true,
                echoCancellation: true,
              }}
              // downloadOnSavePress={true}
              // downloadFileExtension="webm"
            />
            <span id="audio"></span> */}
          </div>
        </div>
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
  <span className="text-black">{data.escala}</span>
</div>


        <button
          type="submit"
          className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
        >
          Crear Reporte
        </button>
      </form>
    </div>
  );
};

export default ReportarSintomasPage;
