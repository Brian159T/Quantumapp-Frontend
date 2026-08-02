import axios from 'axios'
import { AuthResponse, Credenciales } from './Usuario'

const API_URL = 'http://192.168.0.19:4000/api/auth' // TODO: mover a variable de entorno

async function login({ correo, contrasena }: Credenciales): Promise<AuthResponse> {
  const response = await axios.post(
    `${API_URL}/login`,
    {
        correo,
        contrasena,
    }
)

return response.data.body
}

async function registro({ correo, contrasena }: Credenciales): Promise<AuthResponse> {
  const response = await axios.post<AuthResponse>(`${API_URL}/registro`, {
    correo,
    contrasena,
  })
  return response.data
}

export default {
  login,
  registro,
}