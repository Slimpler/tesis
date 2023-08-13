import React, { useState, useEffect } from 'react';
import axios from '../../../api/axios';
import { useParams, useNavigate } from 'react-router-dom';

const CrearUsuarioPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    lastname: '',
    rut: '',
    email: '',
    password: '',
    confirmPassword: '',
    roles: [],
    especialidad: '',
  });
  const navigate = useNavigate();
  const [rolesOptions, setRolesOptions] = useState([]);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [confirmEmail, setConfirmEmail] = useState('');

  useEffect(() => {
    const fetchRolesOptions = async () => {
      try {
        const response = await axios.get('/roles/roles');
        setRolesOptions(response.data);
      } catch (error) {
        console.error('Error al obtener las opciones de roles:', error);
      }
    };

    fetchRolesOptions();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'email') {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    } else if (name === 'confirmEmail') {
      setConfirmEmail(value);
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleRolesChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData((prevData) => {
      if (checked) {
        return {
          ...prevData,
          [name]: [...prevData[name], value],
        };
      } else {
        return {
          ...prevData,
          [name]: prevData[name].filter((role) => role !== value),
        };
      }
    });
  };

  const validateForm = () => {
    let formIsValid = true;
    const newErrors = {};

    if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
      formIsValid = false;
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
      formIsValid = false;
    }

    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailPattern.test(formData.email)) {
      newErrors.email = 'El email no es válido';
      formIsValid = false;
    }

    const rutPattern = /^\d{7,8}-[0-9kK]$/;
    if (!rutPattern.test(formData.rut)) {
      newErrors.rut = 'Por favor, ingresa un RUT válido (formato: 12345678-9)';
      formIsValid = false;
    }

    if (formData.email !== confirmEmail) {
      newErrors.confirmEmail = 'Los emails no coinciden';
      formIsValid = false;
    }

    setErrors(newErrors);
    return formIsValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const isConfirmed = window.confirm('¿Estás seguro de crear este usuario?');
    if (!isConfirmed) {
      return;
    }

    setIsLoading(true);

    try {
      await axios.post('/user/users', formData);

      setFormData({
        name: '',
        lastname: '',
        rut: '',
        email: '',
        password: '',
        confirmPassword: '',
        roles: [],
        especialidad: '',
      });
      setErrors({});
      setConfirmEmail(''); // Clear confirm email field
      navigate('/ListaUsuarios');
    } catch (error) {
      console.error('Error al guardar los datos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-screen-lg mx-auto p-9">
      <h2 className="text-2xl font-bold mb-6">Crear Usuario</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label htmlFor="name">Nombre:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="rounded-lg px-4 py-2 border border-gray-300 focus:outline-none focus:border-blue-500 text-black"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="lastname">Apellido:</label>
            <input
              type="text"
              name="lastname"
              value={formData.lastname}
              onChange={handleChange}
              required
              className="rounded-lg px-4 py-2 border border-gray-300 focus:outline-none focus:border-blue-500 text-black"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="rut">RUT:</label>
            <input
              type="text"
              name="rut"
              value={formData.rut}
              onChange={handleChange}
              required
              className="rounded-lg px-4 py-2 border border-gray-300 focus:outline-none focus:border-blue-500 text-black"
            />
            {errors.rut && <p className="text-red-500 text-sm">{errors.rut}</p>}
          </div>
          <div className="flex flex-col">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="rounded-lg px-4 py-2 border border-gray-300 focus:outline-none focus:border-blue-500 text-black"
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>
          <div className="flex flex-col">
            <label htmlFor="confirmEmail">Confirmar Email:</label>
            <input
              type="email"
              name="confirmEmail"
              value={confirmEmail}
              onChange={handleChange}
              required
              className="rounded-lg px-4 py-2 border border-gray-300 focus:outline-none focus:border-blue-500 text-black"
            />
            {errors.confirmEmail && <p className="text-red-500 text-sm">{errors.confirmEmail}</p>}
          </div>

          <div className="flex flex-col">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="rounded-lg px-4 py-2 border border-gray-300 focus:outline-none focus:border-blue-500 text-black"
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
          </div>
          <div className="flex flex-col">
            <label htmlFor="confirmPassword">Confirmar Password:</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="rounded-lg px-4 py-2 border border-gray-300 focus:outline-none focus:border-blue-500 text-black"
            />
            {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
          </div>
          <div className="flex flex-col">
            <label htmlFor="especialidad">Especialidad:</label>
            <input
              type="text"
              name="especialidad"
              value={formData.especialidad}
              onChange={handleChange}
              className="rounded-lg px-4 py-2 border border-gray-300 focus:outline-none focus:border-blue-500 text-black"
            />
          </div>
          <div className="flex flex-col">
            <label>Roles:</label>
            <div className="space-y-2">
              {rolesOptions.map((role) => (
                <label key={role._id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="roles"
                    value={role._id}
                    checked={formData.roles.includes(role._id)}
                    onChange={handleRolesChange}
                    className="form-checkbox text-blue-500 focus:ring-blue-500 h-4 w-4"
                  />
                  <span className="text-white">{role.name}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
        <div className="flex justify-center">
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
              'Crear Usuario'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CrearUsuarioPage;
