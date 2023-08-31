import React from 'react';

const UserForm = ({
  formData,
  confirmEmail,
  rolesOptions,
  errors,
  isLoading,
  handleChange,
  handleRolesChange,
  handleSubmit
}) => {
  return (
    <div className="max-w-screen-lg mx-auto p-9">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label htmlFor="name">Nombre:</label>
            <input
              type="text"
              name="name"
              placeholder="María"
              value={formData.name}
              onChange={handleChange}
              required
              className="rounded-lg px-4 py-2 border border-gray-300 focus:outline-none focus:border-blue-500 text-black"
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          </div>
          <div className="flex flex-col">
            <label htmlFor="lastname">Apellido:</label>
            <input
              type="text"
              name="lastname"
              placeholder="Perez"
              value={formData.lastname}
              onChange={handleChange}
              required
              className="rounded-lg px-4 py-2 border border-gray-300 focus:outline-none focus:border-blue-500 text-black"
            />
            {errors.lastname && <p className="text-red-500 text-sm">{errors.lastname}</p>}
          </div>
          <div className="flex flex-col">
            <label htmlFor="rut">RUT:</label>
            <input
              type="text"
              name="rut"
              placeholder="12345678-9"
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
              placeholder="email@correo.com"
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
              placeholder="email@correo.com"
              value={confirmEmail}
              onChange={handleChange}
              required
              className="rounded-lg px-4 py-2 border border-gray-300 focus:outline-none focus:border-blue-500 text-black"
            />
            {errors.confirmEmail && <p className="text-red-500 text-sm">{errors.confirmEmail}</p>}
          </div>
          <div className="flex flex-col">
          <label>Especialidad:</label>
          <input
            type="text"
            name="especialidad"
            placeholder="Médico General"
            value={formData.especialidad}
            onChange={handleChange}
            className="rounded-lg px-4 py-2 border border-gray-300 focus:outline-none focus:border-blue-500 text-black"
          />
        </div>
        <div className="flex flex-col">
            <label htmlFor="password">Contraseña:</label>
            <input
                type="password"
                name="password"
                placeholder="Contraseña"
                value={formData.password}
                onChange={handleChange}
                required
                className="rounded-lg px-4 py-2 border border-gray-300 focus:outline-none focus:border-blue-500 text-black"
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
            </div>
            <div className="flex flex-col">
            <label htmlFor="confirmPassword">Confirmar Contraseña:</label>
            <input
                type="password"
                name="confirmPassword"
                placeholder="Confirmar Contraseña"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="rounded-lg px-4 py-2 border border-gray-300 focus:outline-none focus:border-blue-500 text-black"
            />
            {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
            </div>
          {/* Más campos y secciones del formulario */}
        </div>

        <div className="flex flex-col">
          <label>Roles:</label>
          <div className="space-y-2">
            {rolesOptions.map((role) => (
              <label key={role._id} className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="roles"
                  value={role._id}
                  checked={formData.roles.includes(role._id)}
                  onChange={handleRolesChange}
                  className="form-radio text-blue-500 focus:ring-blue-500 h-4 w-4"
                />
                <span className="text-white">{role.name}</span>
              </label>
            ))}
          </div>
          {errors.roles && <p className="text-red-500 text-sm">{errors.roles}</p>}
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

export default UserForm;
