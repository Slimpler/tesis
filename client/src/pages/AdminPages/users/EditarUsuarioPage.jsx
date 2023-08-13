import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../../api/axios";

const EditarUsuarioPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    lastname: "",
    especialidad: "",
    password: "",
  });



  useEffect(() => {
    const cargarUsuario = async () => {
      try {
        const response = await axios.get(`/user/users/${id}`);
        const usuario = response.data;
        setFormData({
          name: usuario.name || "",
          lastname: usuario.lastname || "",
          especialidad: usuario.especialidad || "",
          password: usuario.password || "",
        });
      } catch (error) {
        console.error("Error al cargar el usuario:", error);
      }
    };
    cargarUsuario();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Mostrar el cuadro de diálogo de confirmación
    const isConfirmed = window.confirm("¿Estás seguro de guardar los cambios?");
    if (!isConfirmed) {
      return; // Si el usuario cancela, no se envía el formulario
    }

    try {
      await axios.put(`/user/users/${id}`, formData);
      navigate("/ListaUsuarios"); // Use navigate to redirect to the home page after saving changes
    } catch (error) {
      console.error("Error al guardar los datos:", error);
    }
  };
  
  return (
    <div className="max-w-screen-lg mx-auto p-9">
      <h2 className="text-2xl font-bold mb-6">Editar Usuario</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="mb-4">
          <label htmlFor="name">Nombre:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full rounded-lg px-4 py-2 border border-gray-300 focus:outline-none focus:border-blue-500 text-black"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="lastname">Apellido:</label>
          <input
            type="text"
            name="lastname"
            value={formData.lastname}
            onChange={handleChange}
            required
            className="w-full rounded-lg px-4 py-2 border border-gray-300 focus:outline-none focus:border-blue-500 text-black"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="especialidad">Especialidad:</label>
          <input
            type="text"
            name="especialidad"
            value={formData.especialidad}
            onChange={handleChange}
            className="w-full rounded-lg px-4 py-2 border border-gray-300 focus:outline-none focus:border-blue-500 text-black"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full rounded-lg px-4 py-2 border border-gray-300 focus:outline-none focus:border-blue-500 text-black"
          />
        </div>
        <div className="flex justify-end">
          <button type="button" onClick={() => navigate("/ListaUsuarios")} className="mr-2 bg-white text-blue-500 px-4 py-2 rounded-lg">
            Cancelar
          </button>
          <button
            type="submit"
            className="bg-blue-500 text-white font-semibold rounded-lg px-4 py-2"
          >
            Guardar Cambios
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditarUsuarioPage;
