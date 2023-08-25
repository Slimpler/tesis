import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { AuthProvider } from "./context/authContext";
import { ProtectedRoute, ProtectedRouteAdmin, ProtectedRoutePaciente, ProtectedRouteModerator } from "./routes";  

// InicioPages
import { LoginPage } from "./pages/InicioPages/LoginPage";
import ForgottenPassword from "./pages/InicioPages/ForgottenPassword";
import ResetPassword from "./pages/InicioPages/ResetPassword";

// ComunidadPages
import AportesPage from "./pages/ComunidadPages/admin/AportesPage";
import CreateAportePage from "./pages/ComunidadPages/paciente/PostPage";
import ComunidadPage from "./pages/ComunidadPages/paciente/ComunidadPage";

// AdminPages
import AdminProfile from "./pages/AdminPages/AdminProfilePage";

// UsersPages (Admin)
import EditarUsuarioPage from "./pages/UsersPages/EditarUsuarioPage";
import CrearUsuarioPage from './pages/UsersPages/CrearUsuarioPage';
import ListaUsuariosPage from "./pages/UsersPages/ListaUsuariosPage";

// PacientePages
import ListaPacientesPage from "./pages/PacientePages/ListaPacientesPage";

// DiagnosticoPages (Admin)
import AdministrarDiagnosticosPage from "./pages/DiagnosticoPages/AdministrarDiagnosticosPage";

// TratamientoPages (Admin)
import AdministrarTratamientosPage from "./pages/TratamientoPages/AdministrarTratamientosPage";

// ReportePages (Admin)
import ResponderReportesPage from "./pages/ReportePages/ResponderReportesPage";

// PacientePages
import PacienteProfilePage from "./pages/PacientePages/PacienteProfilePage";

// ReportePages (Paciente)
import ReportarSintomasPage from "./pages/ReportePages/ReportarSintomasPage";

import ModeratorProfile from "./pages/ModeratorPages/ModeratorProfilePage";

function App() {
  return (
    <AuthProvider>
      
        <BrowserRouter>
        <main className="container content-container px-10 md:px-20">
            <Navbar />
            <Routes>
              
              <Route path="/" element={<LoginPage />} />
              <Route path="/forgot-password" element={<ForgottenPassword />} />
              <Route path="/reset-password/" element={<ResetPassword />} />
              
              <Route element={<ProtectedRoute />}>
                {/* Admin and moderator */}
                <Route element={<ProtectedRouteAdmin/>}>
                  <Route path="/AdminProfile" element={<AdminProfile />} />
                  <Route path="/ListaUsuarios" element={<ListaUsuariosPage />} />
                  <Route path="/ListaPacientes" element={<ListaPacientesPage />} />

                  <Route path="/crearusuario" element={<CrearUsuarioPage />} />
                  <Route path="/editarusuario/:id" element={<EditarUsuarioPage />} />

                  <Route element={<ProtectedRouteModerator/>}>
                    <Route path="/diagnosticos/:pacienteId" element={<AdministrarDiagnosticosPage />} />
                    <Route path="/tratamientos/:pacienteId" element={<AdministrarTratamientosPage />} />
                    <Route path="/responderReporte/:reporteId" element={<ResponderReportesPage />} />

                    <Route path="/Aportes" element={<AportesPage/>}/>
                    <Route path="/ModeratorProfile" element={<ListaPacientesPage />} />
                  </Route>

                </Route>
                  
              
               {/* Paciente */}
                <Route element= {<ProtectedRoutePaciente/>}>   
                  <Route path="/PacienteProfile" element={<PacienteProfilePage />} />
                  <Route path="/ReportarSintoma" element={<ReportarSintomasPage />} />
                  <Route path="/PostPage" element={<CreateAportePage/>}/>
                  <Route path="/ComunidadPage" element={<ComunidadPage/>}/>
                </Route>
                </Route>
            </Routes> 
          </main>
        </BrowserRouter>
      
    </AuthProvider>
  );
}

export default App;
