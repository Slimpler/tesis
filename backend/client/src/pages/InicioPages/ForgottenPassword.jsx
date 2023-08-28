import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../api/axios';

const ForgottenPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleResetPassword = async () => {
    try {
      setError('');
      setIsLoading(true);
      
      const response = await axios.post('/user/forgot-password', { email });
      setMessage(response.data.message);
      setIsLoading(false);
      
      setTimeout(() => {
        setMessage('');
        navigate('/'); // Redirecciona a la página de inicio de sesión después de 2 segundos
      }, 2000);
    } catch (error) {
      if (error.response && error.response.data) {
        setError(error.response.data.message);
      } else {
        setError('Error al solicitar restablecimiento de contraseña');
      }
      setIsLoading(false);
      console.error('Error al solicitar restablecimiento de contraseña:', error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="max-w-md w-full bg-white p-8 shadow-md rounded-md">
        <h2 className="text-xl font-semibold mb-4 text-black">Contraseña Olvidada</h2>
        {error && <p className="text-red-600 mb-2">{error}</p>}
        {message && <p className="text-green-600 mb-2">{message}</p>}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Correo electrónico</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 p-2 border rounded-md w-full focus:ring focus:ring-blue-300 text-black"
          />
        </div>
        <button
          onClick={handleResetPassword}
          className={`w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300 ${
            isLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={isLoading}
        >
          {isLoading ? 'Cargando...' : 'Solicitar Restablecimiento'}
        </button>
      </div>
    </div>
  );
};

export default ForgottenPassword;
