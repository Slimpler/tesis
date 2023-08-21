import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

export function Navbar() {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const getHomeRoute = () => {
    if (isAuthenticated) {
      // Si el usuario está autenticado, obtener los roles como un arreglo
      const { roles } = user;
  
      // Verificar si el rol "paciente" está presente en el arreglo de roles
      if (roles.includes("paciente")) {
        return "/PacienteProfile";
      } else if (roles.includes("admin")) {
        return "/AdminProfile";
      } else if (roles.includes("moderator")){
        return "/ModeratorProfile";
      }else{
        // Si el rol no coincide con ninguno de los roles esperados, redirigir a la ruta predeterminada
        return "/";
      }
    } else {
      // Si el usuario no está autenticado, redirigir a la ruta predeterminada
      return "/";
    }
  };

  return (
    <nav className="bg-pink-500 my-3 py-5 px-2 sm:px-5 lg:px-10 rounded-lg">
      <div className="flex items-center justify-between max-w-screen-md mx-auto">
        <h1 className="text-2xl font-bold">
          <Link to={getHomeRoute()}>Inicio</Link>
        </h1>
        <ul className="flex gap-x-2">
          {isAuthenticated ? (
            <>
              <li className="text-white font-semibold">
                Hola, {user.name} {user.lastname}
              </li>
              <li>
                <button className="logout-btn" onClick={handleLogout}>
                  Cerrar Sesión
                </button>
              </li> 
            </>
          ) : (
            <>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}
