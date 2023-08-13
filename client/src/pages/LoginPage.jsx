import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../schemas/auth";
import { useAuth } from "../context/authContext";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Card, Message, Button, Input, Label } from "../components/ui";

export function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const { signin, errors: loginErrors, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const onSubmit = (data) => signin(data);

  useEffect(() => {
    if (isAuthenticated) {
      if (user.roles.includes("admin")) {
        console.log("Redirigiendo a /AdminProfile");
        navigate("/AdminProfile");
      } else if (user.roles.includes("moderator")) {
        console.log("Redirigiendo a /moderatorProfile");
        navigate("/AdminProfile");
      } else if (user.roles.includes("paciente")) {
        console.log("Redirigiendo a /PacienteProfile");
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

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="email" className="text-white">Email:</Label>
            <Input
              label="Write your email"
              type="email"
              name="email"
              placeholder="youremail@domain.tld"
              {...register("email", { required: true })}
            />
            <p className="text-red-500 text-sm">{errors.email?.message}</p>
          </div>

          <div>
            <Label htmlFor="password" className="text-white">Password:</Label>
            <Input
              type="password"
              name="password"
              placeholder="Write your password"
              {...register("password", { required: true, minLength: 6 })}
            />
            <p className="text-red-500 text-sm">{errors.password?.message}</p>
          </div>

          <Button className="w-full bg-white text-blue-500 flex justify-center">Login</Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-white">
            <Link to="/forgot-password" className="text-blue-300 hover:underline">Forgot password?</Link>
          </p>
        </div>
      </Card>
    </div>
  );
}