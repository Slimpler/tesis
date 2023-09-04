import React, { useState } from "react";
import axios from "../../api/axios";
import { useAuth } from "../../context/authContext";
import { useNavigate } from "react-router-dom";
import { AudioRecorder } from "react-audio-voice-recorder";

const ReportarSintomasPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [blobAudio, setBlobAudio] = useState(null); // Ahora, blobAudio manejará tanto el audio como la imagen
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({
    sintoma: "",
    escala: "",
    date: "",
  });
  const [selectedImage, setSelectedImage] = useState(null); // Nuevo estado para la imagen seleccionada

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({
      ...data,
      [name]: value,
    });
  };

  const addAudioElement = (blob) => {
    const url = URL.createObjectURL(blob);
    setBlobAudio(blob);
    const audio = document.createElement("audio");
    audio.src = url;
    audio.controls = true;
    const span = document.getElementById("audio");
    span.innerHTML = "";
    span.appendChild(audio);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (data.sintoma.trim() === "") {
      console.log("El campo de síntoma no puede estar vacío");
      return;
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
      formData.append("imagen", selectedImage); // Agregar la imagen al formData

      setIsLoading(true);
      const res = await axios.post("/reportes/createReporte", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setIsLoading(false);
      navigate("/PacienteProfile");
      console.log("Nuevo reporte creado:", res.data);
    } catch (error) {
      console.error("Error al hacer la solicitud:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold text-black mb-4">Reportar Síntomas</h1>
      <form
        onSubmit={handleSubmit}
        className="space-y-4"
        encType="multipart/form-data"
      >
        <div>
          <label htmlFor="sintoma" className="block font-medium text-black">
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
          <label htmlFor="audio" className="block font-medium text-black">
            Audio:
          </label>
          <div className="flex flex-col sm:flex-row justify-left items-center">
            <div style={{ flex: 1 }}>
              <AudioRecorder
                style={{ width: "80%", height: "20px" }}
                onRecordingComplete={addAudioElement}
                audioTrackConstraints={{
                  noiseSuppression: true,
                  echoCancellation: true,
                }}
              />
            </div>
            <div id="audio" className="mt-2 sm:mt-0 sm:ml-4"></div>
          </div>
        </div>
        <div>
          <label htmlFor="imagen" className="block font-medium text-black">
            Imagen:
          </label>
          <input
            type="file"
            id="imagen"
            name="imagen"
            onChange={handleImageChange}
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none text-black focus:border-blue-500"
          />
          {selectedImage && (
            <div>
              <img
                src={URL.createObjectURL(selectedImage)}
                alt="Vista previa de la imagen"
                style={{ maxWidth: "100%", marginTop: "10px" }}
              />
            </div>
          )}
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
            "Crear Reporte"
          )}
        </button>
      </form>
    </div>
  );
};

export default ReportarSintomasPage;
