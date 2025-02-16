'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const fetchUserIdFromUsuario = async (username) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/usuario/obtener-id/?username=${username}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('userId', data.id);
        console.log('User ID almacenado:', data.id);
        return data.id;
      } else {
        const error = await res.json();
        throw new Error(error.error || 'Error desconocido.');
      }
    } catch (error) {
      console.error('Error al buscar usuario:', error.message);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'No se pudo encontrar el usuario correspondiente.',
      });
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://127.0.0.1:8000/api/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        const { access, refresh } = await res.json();
        localStorage.setItem('access_token', access);
        localStorage.setItem('refresh_token', refresh);

        console.log('Tokens almacenados correctamente.');

        const userId = await fetchUserIdFromUsuario(username);

        if (userId) {
          Swal.fire({
            icon: 'success',
            title: 'Inicio de sesión exitoso',
            text: 'Serás redirigido al panel principal.',
            timer: 2000,
            showConfirmButton: false,
          }).then(() => {
            router.push('/dashboard');
          });
        }
      } else {
        const error = await res.json();
        Swal.fire({
          icon: 'error',
          title: 'Error de autenticación',
          text: error.detail
            ? 'No se encontró una cuenta activa con las credenciales proporcionadas.'
            : 'Hubo un problema al verificar tus credenciales.',
        });
      }
    } catch (error) {
      console.error('Error al comunicarse con el servidor:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error de conexión',
        text: 'Hubo un problema al iniciar sesión. Por favor, intenta nuevamente.',
      });
    }
  };

  const redirectToAdminLogin = () => {
    window.location.href = 'http://localhost:8000/admin/login/?next=/admin/';
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 relative">
      <button
        onClick={redirectToAdminLogin}
        className="absolute top-4 right-4 px-4 py-2 text-sm rounded-lg transition border-2 border-[#712b39] text-[#712b39] hover:bg-[#712b39] hover:text-white"
      >
        Acceso Administrador
      </button>
      
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-sm">
        <div className="flex justify-center mb-6">
          <img src="/img/logo.webp" alt="Logo de la empresa" className="h-16" />
        </div>
        <h1 className="text-2xl font-bold mb-6 text-center" style={{ color: '#712b39' }}>
          Iniciar Sesión
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="usuario"
              className="block text-sm font-medium"
              style={{ color: '#712b39' }}
            >
              Usuario
            </label>
            <input
              id="usuario"
              type="text"
              placeholder="Ingresa tu usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>
          <div>
            <label
              htmlFor="contraseña"
              className="block text-sm font-medium"
              style={{ color: '#712b39' }}
            >
              Contraseña
            </label>
            <input
              id="contraseña"
              type="password"
              placeholder="Ingresa tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 rounded-lg text-white transition"
            style={{ backgroundColor: '#712b39' }}
          >
            Iniciar sesión
          </button>
        </form>
        <p className="text-sm text-center text-gray-600 mt-4">
          ¿Eres un nuevo empleado? Por favor, contacta con tu administrador para obtener acceso.
        </p>
      </div>
    </div>
  );
}