import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';

export function useAuth({ redirectToLogin = true } = {}) {
  const router = useRouter();

  const accessToken = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  const refreshToken = typeof window !== 'undefined' ? localStorage.getItem('refresh_token') : null;

  // Redirige si no hay token y está activado el redirect
  useEffect(() => {
    if (redirectToLogin && !accessToken) {
      router.push('/login');
    }
  }, [accessToken, redirectToLogin, router]);

  const logout = async () => {
    if (!refreshToken) {
      Swal.fire('Error', 'No se encontró el token de sesión.', 'error');
      router.push('/login');
      return;
    }

    try {
      const res = await fetch('http://127.0.0.1:8000/api/logout/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');

      if (res.ok) {
        Swal.fire({
          title: 'Sesión cerrada',
          text: 'Has cerrado sesión exitosamente.',
          icon: 'success',
          confirmButtonColor: '#712b39',
        }).then(() => router.push('/login'));
      } else {
        const data = await res.json();
        Swal.fire('Error', data.detail || 'Error al cerrar sesión.', 'error');
      }
    } catch (error) {
      console.error('Error en logout:', error);
      Swal.fire('Error', 'No se pudo cerrar sesión.', 'error');
    }
  };

  return {
    accessToken,
    refreshToken,
    logout,
    isAuthenticated: !!accessToken,
  };
}
