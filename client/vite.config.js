import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // Puerto para el servidor de desarrollo
  },
  build: {
    outDir: 'dist', // Directorio de salida para la versión de producción
    minify: true, // Habilitar la minificación en producción
    manifest: true, // Agregar hash a los nombres de archivo para el control de caché
  },
})
