import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';
import { useParams, useNavigate } from 'react-router-dom';
import UserForm from './UserForm/UserForm'; // Importando el formulario
import RoleCheckboxes from './RoleCheckBoxes/RoleCheckboxes'; 
import { validateRut, validateForm } from "./Validation/Validation"

const CrearUsuarioPage = () => {
  // Estados del componente
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

  // Efecto de carga inicial para obtener las opciones de roles
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

// Función para manejar cambios en los campos del formulario
const handleChange = (e) => {
  const { name, value } = e.target;
  if (name === 'email') {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  } else if (name === 'confirmEmail') {
    setConfirmEmail(value);
  } else if (name === 'password') {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  } else if (name === 'confirmPassword') {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  } else {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }
};



// Función para manejar cambios en las opciones de roles
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

const handleSubmit = async (e) => {
  e.preventDefault();

  const { formIsValid, errors } = validateForm(formData, confirmEmail); // Utilizando la función de validación del formulario

  if (!formIsValid) {
    setErrors(errors);
    return;
  }

  const isConfirmed = window.confirm('¿Estás seguro de crear este usuario?');
  if (!isConfirmed) {
    return;
  }

  setIsLoading(true);

  try {
    // Realizar la solicitud para crear el usuario en el backend
    const response = await axios.post('/user/users', formData);

    // Limpiar el formulario y redirigir
    if (response.status === 201) {
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
      setConfirmEmail('');
      navigate('/ListaUsuarios');
    }
  } catch (error) {
    if (error.response && error.response.status === 409) {
      setErrors({ duplicate: 'El rut o el email ya están registrados.' });
    } else {
      console.error('Error al guardar los datos:', error);
    }
  } finally {
    setIsLoading(false);
  }
};
// Renderización del componente
return (
  <div className="max-w-screen-lg mx-auto p-9">
    <h2 className="text-2xl font-bold mb-6">Crear Usuario</h2>
    <UserForm
      formData={formData}
      confirmEmail={confirmEmail}
      rolesOptions={rolesOptions}
      errors={errors}
      isLoading={isLoading}
      handleChange={handleChange}
      handleRolesChange={handleRolesChange}
      handleSubmit={handleSubmit}
    />
  </div>
);
};

export default CrearUsuarioPage;
