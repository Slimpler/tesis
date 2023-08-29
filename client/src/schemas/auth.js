import { z } from "zod";

// Patrón de expresión regular para validar el formato del RUT
const rutPattern = /^\d{7,8}-[0-9kK]$/;

export const loginSchema = z.object({
  rut: z.string().regex(/^\d{7,8}-[\dK]$/i, {
    message: "Por favor, ingrese un RUT válido (formato: 12345678-9)",
  }),
  password: z.string().min(6, {
    message: "La contraseña debe tener al menos 6 caracteres",
  }),
});

export const registerSchema = z
  .object({
    username: z
      .string({
        required_error: "El nombre de usuario es obligatorio",
      })
      .min(3, {
        message: "El nombre de usuario debe tener al menos 3 caracteres",
      }),
    email: z.string().email({
      message: "Por favor, ingrese una dirección de correo electrónico válida",
    }),
    password: z.string().min(6, {
      message: "La contraseña debe tener al menos 6 caracteres",
    }),
    confirmPassword: z.string().min(6, {
      message: "La contraseña debe tener al menos 6 caracteres",
    }),
    // Validación del RUT utilizando la expresión regular
    rut: z.string().refine((value) => rutPattern.test(value), {
      message: "Por favor, ingrese un RUT válido (formato: 12345678-9)",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

