import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../api/axios';

const ITEMS_PER_PAGE = 8;

const ListaUsuariosPage = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [orderBy, setOrderBy] = useState({ field: 'name', order: 'asc' });

  const cargarUsuarios = async () => {
    try {
      const response = await axios.get('/user/usersTrue');
      setUsuarios(response.data);
    } catch (error) {
      console.error('Error al cargar la lista de usuarios:', error);
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const deleteUser = async (userId) => {
    try {
      await axios.put(`/user/changeState/${userId}`);
      cargarUsuarios();
    } catch (error) {
      console.error('Error al eliminar el usuario:', error);
    }
  };

  const showAlert = (action, user) => {
    const isConfirmed = window.confirm(`¿Estás seguro de ${action} al usuario ${user.name}?`);
    if (isConfirmed) {
      if (action === 'eliminar') {
        deleteUser(user._id);
      }
    }
  };

  const sortUsuarios = (field, order) => {
    const sortedUsuarios = usuarios.slice().sort((a, b) => {
      const aValue = a[field].toLowerCase();
      const bValue = b[field].toLowerCase();
      return order === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
    });
    setUsuarios(sortedUsuarios);
    setOrderBy({ field, order });
  };

  const filteredUsuarios = usuarios.filter((usuario) => {
    const searchText = `${usuario.name} ${usuario.lastname} ${usuario.rut} ${usuario.especialidad}`.toLowerCase();
    return searchText.includes(searchTerm.toLowerCase());
  });

  const totalPages = Math.ceil(filteredUsuarios.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const visibleUsuarios = filteredUsuarios.slice(startIndex, endIndex);

  return (
    <div className="max-w-screen-lg mx-auto p-4 md:p-9">
      <h2 className="text-2xl font-bold mb-4">Lista de Usuarios</h2>
      <div className="mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar por nombre, apellido, rut, etc."
          className="border border-gray-300 px-4 py-2 rounded-md w-full text-black"
        />
      </div>
      {Array.isArray(visibleUsuarios) && visibleUsuarios.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-blue-500 text-white">
                <th className="px-4 py-2">
                  <button
                    onClick={() => sortUsuarios('name', orderBy.field === 'name' && orderBy.order === 'asc' ? 'desc' : 'asc')}
                  >
                    Nombre
                  </button>
                </th>
                <th className="px-4 py-2">
                  <button
                    onClick={() =>
                      sortUsuarios('lastname', orderBy.field === 'lastname' && orderBy.order === 'asc' ? 'desc' : 'asc')
                    }
                  >
                    Apellido
                  </button>
                </th>
                <th className="px-4 py-2">
                  <button
                    onClick={() =>
                      sortUsuarios('especialidad', orderBy.field === 'especialidad' && orderBy.order === 'asc' ? 'desc' : 'asc')
                    }
                  >
                    Especialidad
                  </button>
                </th>
                <th className="px-4 py-2">
                  <button
                    onClick={() =>
                      sortUsuarios('roles', orderBy.field === 'roles' && orderBy.order === 'asc' ? 'desc' : 'asc')
                    }
                  >
                    Roles
                  </button>
                </th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {visibleUsuarios.map((usuario) => (
                <tr key={usuario._id}>
                  <td className="border border-gray-200 px-4 py-2 max-w-sm">{usuario.name}</td>
                  <td className="border border-gray-200 px-4 py-2 max-w-sm">{usuario.lastname}</td>
                  <td className="border border-gray-200 px-4 py-2 max-w-sm">{usuario.especialidad}</td>
                  <td className="border border-gray-200 px-4 py-2 max-w-sm">
                    {usuario.roles.map((rol) => (
                      <span key={rol} className="mr-2">
                        {rol}
                      </span>
                    ))}
                  </td>
                  <td className="border border-gray-200 px-4 py-2 max-w-sm">{usuario.email}</td>
                  <td className="border border-gray-200 px-4 py-2 max-w-sm">
                    <button onClick={() => showAlert('eliminar', usuario)} className="text-red-500 mr-2">
                      Eliminar
                    </button>
                    <Link to={`/editarusuario/${usuario._id}`}>
                      <button className="text-blue-500">Editar</button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No se encontraron usuarios activos en la base de datos.</p>
      )}
      {totalPages > 1 && (
        <div className="flex justify-center mt-4">
          <button
            onClick={() => setCurrentPage(currentPage > 1 ? currentPage - 1 : currentPage)}
            className="bg-gray-200 text-black font-semibold rounded-md px-4 py-2 mr-2"
          >
            Anterior
          </button>
          <button
            onClick={() => setCurrentPage(currentPage < totalPages ? currentPage + 1 : currentPage)}
            className="bg-gray-200 text-black font-semibold rounded-md px-4 py-2"
          >
            Siguiente
          </button>
        </div>
      )}
      <div className="flex justify-center mt-4">
        <Link to="/crearusuario">
          <button className="bg-green-500 text-white font-semibold rounded-md px-4 py-2">
            Crear Nuevo Usuario
          </button>
        </Link>
      </div>
    </div>
  );
};

export default ListaUsuariosPage;
