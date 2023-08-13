import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { AuthProvider } from "./context/authContext";
import { ProtectedRoute, ProtectedRouteAdmin, ProtectedRoutePaciente } from "./routes";  

//Routes
import { LoginPage } from "./pages/LoginPage"; 
import ForgottenPassword from "./pages/ForgottenPassword";

//Comunidad
import AportesPage from "./pages/ComunidadPages/admin/AportesPage";
import CreateAportePage from "./pages/ComunidadPages/paciente/PostPage";
import ComunidadPage from "./pages/ComunidadPages/paciente/ComunidadPage";

//AdminRelated
import AdminProfile from "./pages/AdminPages/AdminProfilePage";
import EditarUsuarioPage from "./pages/AdminPages/users/EditarUsuarioPage";
import CrearUsuarioPage from './pages/AdminPages/users/CrearUsuarioPage';
import ListaPacientesPage from "./pages/AdminPages/pacientes/ListaPacientesPage";
import ListaUsuariosPage from "./pages/AdminPages/users/ListaUsuariosPage";

import AdministrarDiagnosticosPage from "./pages/DiagnosticoPages/AdministrarDiagnosticosPage";
import AdministrarTratamientosPage from "./pages/TratamientoPages/AdministrarTratamientosPage";
import ResponderReportesPage from "./pages/ReportePages/ResponderReportesPage";

import ChatPage from "./pages/ChatPages/ChatPage";

//PacienteRelated
import PacienteProfilePage from "./pages/PacientePages/PacienteProfilePage";
import ReportarSintomasPage from "./pages/ReportePages/ReportarSintomasPage";



function App() {
  return (
    <AuthProvider>
      
        <BrowserRouter>
        <main className="container content-container px-10 md:px-20">
            <Navbar />
            <Routes>
              
              <Route path="/" element={<LoginPage />} />
              <Route path="/forgot-password" element={<ForgottenPassword />} />

              <Route element={<ProtectedRoute />}>
                {/* Admin and moderator */}
                <Route element={<ProtectedRouteAdmin/>}>
                  <Route path="/AdminProfile" element={<AdminProfile />} />
                  <Route path="/ListaUsuarios" element={<ListaUsuariosPage />} />
                  <Route path="/ListaPacientes" element={<ListaPacientesPage />} />

                  <Route path="/crearusuario" element={<CrearUsuarioPage />} />
                  <Route path="/editarusuario/:id" element={<EditarUsuarioPage />} />

                  <Route path="/diagnosticos/:pacienteId" element={<AdministrarDiagnosticosPage />} />
                  <Route path="/tratamientos/:pacienteId" element={<AdministrarTratamientosPage />} />
                  <Route path="/responderReporte/:reporteId" element={<ResponderReportesPage />} />

                  <Route path="/Aportes" element={<AportesPage/>}/>
                  <Route path="/Chat" element={<ChatPage/>}/>

                </Route>
                  
              </Route>
               {/* Paciente */}
              <Route element= {<ProtectedRoutePaciente/>}>   
                <Route path="/PacienteProfile" element={<PacienteProfilePage />} />
                <Route path="/ReportarSintoma" element={<ReportarSintomasPage />} />
                <Route path="/PostPage" element={<CreateAportePage/>}/>
                <Route path="/ComunidadPage" element={<ComunidadPage/>}/>
              </Route>
            </Routes> 
          </main>
        </BrowserRouter>
      
    </AuthProvider>
  );
}

export default App;
