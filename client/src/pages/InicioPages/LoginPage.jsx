import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../../schemas/auth";
import { useAuth } from "../../context/authContext";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Card, Message, Button, Input, Label } from "../../components/ui";
import { RiEyeFill, RiEyeOffFill } from 'react-icons/ri';

export function LoginPage() {
  const [loginError, setLoginError] = useState(""); 
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const { signin, errors: loginErrors, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data) => {
    const success = await signin(data);
    if (!success) {
      setLoginError("RUT o contraseña inválidos");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  useEffect(() => {
    if (isAuthenticated) {
      if (user.roles.includes("admin")) {
        navigate("/AdminProfile");
      } else if (user.roles.includes("moderator")) {
        navigate("/ModeratorProfile");
      } else if (user.roles.includes("paciente")) {
        navigate("/PacienteProfile");
      }
    }
  }, [isAuthenticated, user, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-pink-300">
      <Card className="w-full max-w-md p-5">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-white">Inicio de sesión</h1>
          <p className="text-sm text-gray-100">Ingresa tus credenciales.</p>
        </div>

        {loginErrors.map((error, i) => (
          <Message message={error} key={i} />
        ))}

        {loginError && <Message message={loginError} />}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="rut" className="text-white">RUT:</Label>
            <Input
              label="Escribe tu RUT"
              type="text"
              name="rut"
              placeholder="12345678-9"
              {...register("rut")}
            />
            <p className="text-red-500 text-sm">{errors.rut?.message}</p>
          </div>

          <div className="relative">
            <Label htmlFor="password" className="text-white">Password:</Label>
            <Input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Escribe tu contraseña"
              {...register("password", { required: true, minLength: 6 })}
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute top-1/2 right-2 transform -translate-y-1/2 text-blue-500 focus:outline-none mt-3"
            >
              {showPassword ? <RiEyeOffFill /> : <RiEyeFill />}
            </button>
            <p className="text-red-500 text-sm">{errors.password?.message}</p>
          </div>

          <Button className="w-full bg-white text-blue-500 flex justify-center">Iniciar Sesión</Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-white">
            <Link to="/forgot-password" className="text-blue-300 hover:underline">¿Olvidaste tu contraseña?</Link>
          </p>
        </div>
      </Card>
    </div>
  );
}
