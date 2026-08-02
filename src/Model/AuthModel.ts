const API_URL = 'http://192.168.0.19:4000/api';

export interface LoginData {
    usuario: string;
    password: string;
}

export interface Usuario {
    id_usuario: number;
    nombre_usuario: string;
    correo: string;
    id_rol: number;
    rol: string;
}

export interface LoginResponse {
    token: string;
    usuario: Usuario;
}

export async function iniciarSesion(
    datos: LoginData
): Promise<LoginResponse> {

    const respuesta = await fetch(
        `${API_URL}/auth/login`,
        {
            method: 'POST',

            headers: {
                'Content-Type': 'application/json',
            },

            body: JSON.stringify(datos),
        }
    );

    const resultado = await respuesta.json();

    if (!respuesta.ok || resultado.error) {
        throw new Error(
            resultado.body || 'Error al iniciar sesión'
        );
    }

    return resultado.body;
}