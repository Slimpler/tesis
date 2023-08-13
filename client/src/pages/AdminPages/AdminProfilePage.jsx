// AdminProfile.js
import { Link } from "react-router-dom";

const AdminProfile = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 px-4 max-w-screen-lg w-full">
        <LinkCard title="Pacientes" to="/ListaPacientes" color="blue">
          Ver Pacientes
        </LinkCard>
        <LinkCard title="Usuarios" to="/ListaUsuarios" color="blue">
          Ver Usuarios
        </LinkCard>
        <LinkCard title="Comunidad" to="/Aportes" color="blue">
          Ver Aportes
        </LinkCard>
      </div>
    </div>
  );
};

const LinkCard = ({ title, to, color, children }) => {
  return (
    <div className={`flex flex-col justify-center items-center bg-white rounded-lg shadow-md p-6 bg-${color}-500`}>
      <h2 className="text-xl font-bold mb-4 text-black">{title}</h2>
      <Link to={to}>
        <button className="w-full px-4 py-2 bg-pink-200 text-black font-semibold rounded-md">
          {children}
        </button>
      </Link>
    </div>
  );
};

export default AdminProfile;
