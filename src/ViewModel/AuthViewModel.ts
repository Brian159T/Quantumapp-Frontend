import { useState } from 'react';
import { iniciarSesion } from '../Model/AuthModel';

export function useAuthViewModel() {

    const [cargando, setCargando] = useState(false);

    const [error, setError] = useState<string | null>(null);

    async function login(
        usuario: string,
        password: string
    ) {

        try {

            setCargando(true);
            setError(null);

            const resultado = await iniciarSesion({
                usuario,
                password,
            });

            return resultado;

        } catch (error: any) {

            setError(
                error.message || 'Error al iniciar sesión'
            );

            throw error;

        } finally {

            setCargando(false);

        }
    }

    return {
        login,
        cargando,
        error,
    };
}