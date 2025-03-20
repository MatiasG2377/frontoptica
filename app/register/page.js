'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';

export default function RegisterPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [apellidoUsuario, setApellidoUsuario] = useState('');
  const [telefonoUsuario, setTelefonoUsuario] = useState('');
  const [rolUsuario, setRolUsuario] = useState('Usuario');
  const [sucursalUsuario, setSucursalUsuario] = useState('');
  const [sucursales, setSucursales] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchSucursales = async () => {
      try {
        const res = await fetch('http://127.0.0.1:8000/api/sucursal/');
        if (res.ok) {
          const data = await res.json();
          setSucursales(data);
        } else {
          Swal.fire({
            title: 'Error',
            text: 'Error al cargar las sucursales.',
            icon: 'error',
            confirmButtonColor: '#712b39'
          });
        }
      } catch (error) {
        console.error('Error al obtener las sucursales:', error);
        Swal.fire({
          title: 'Error',
          text: 'Error al conectar con el servidor.',
          icon: 'error',
          confirmButtonColor: '#712b39'
        });
      }
    };

    fetchSucursales();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const registerRes = await fetch('http://127.0.0.1:8000/api/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      });

      if (registerRes.ok) {
        const registerData = await registerRes.json();

        const usuarioRes = await fetch('http://127.0.0.1:8000/api/usuario/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username_usuario: username,
            nombre_usuario: username, // Cambiado de username_usuario a nombre_usuario
            apellido_usuario: apellidoUsuario,
            email_usuario: email,
            telefono_usuario: telefonoUsuario,
            rol_usuario: rolUsuario,
            sucursal_usuario: sucursalUsuario,
            activo_usuario: true,
          }),
        });
        

        if (usuarioRes.ok) {
          Swal.fire({
            title: 'Éxito',
            text: 'Usuario registrado exitosamente.',
            icon: 'success',
            confirmButtonColor: '#712b39'
          }).then(() => {
            router.push('/login');
          });
        } else {
          const usuarioErrorData = await usuarioRes.json();
          Swal.fire({
            title: 'Error',
            text: `Error al registrar datos adicionales: ${JSON.stringify(usuarioErrorData)}`,
            icon: 'error',
            confirmButtonColor: '#712b39'
          });
        }
      } else {
        const registerErrorData = await registerRes.json();
        Swal.fire({
          title: 'Error',
          text: `Error al registrarse: ${JSON.stringify(registerErrorData)}`,
          icon: 'error',
          confirmButtonColor: '#712b39'
        });
      }
    } catch (error) {
      console.error('Error al registrar el usuario:', error);
      Swal.fire({
        title: 'Error',
        text: 'Hubo un problema al registrar el usuario.',
        icon: 'error',
        confirmButtonColor: '#712b39'
      });
    }
  };

  const handleLogout = async () => {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      Swal.fire({
        title: 'Error',
        text: 'No se encontró el token de refresco. Inicia sesión nuevamente.',
        icon: 'error',
        confirmButtonColor: '#712b39'
      });
      return;
    }

    try {
      const res = await fetch('http://127.0.0.1:8000/api/logout/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
        body: JSON.stringify({
          refresh_token: refreshToken,
        }),
      });

      if (res.ok) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        Swal.fire({
          title: 'Sesión cerrada',
          text: 'Has cerrado sesión exitosamente.',
          icon: 'success',
          confirmButtonColor: '#712b39',
        }).then(() => {
          router.push('/login');
        });
      } else {
        const data = await res.json();
        Swal.fire({
          title: 'Error',
          text: `Error al cerrar sesión: ${data.detail}`,
          icon: 'error',
          confirmButtonColor: '#712b39',
        });
      }
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      Swal.fire({
        title: 'Error',
        text: 'Ocurrió un error al intentar cerrar sesión.',
        icon: 'error',
        confirmButtonColor: '#712b39'
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="w-full flex justify-between items-center bg-[#712b39] text-white p-4 shadow-md border-b border-black relative">
        <button onClick={() => setMenuOpen(!menuOpen)} className="text-xl font-bold absolute left-4">☰</button>
        <h1 className="text-2xl font-bold mx-auto">Registro de usuarios</h1>
      </div>
      {menuOpen && (
        <div className="absolute top-16 left-0 bg-white shadow-lg rounded-lg w-64 z-50">
          <ul className="flex flex-col text-black">
            <li className="p-4 hover:bg-gray-200 cursor-pointer" onClick={() => router.push('/inventario')}>Gestión de Productos</li>
            <li className="p-4 hover:bg-gray-200 cursor-pointer" onClick={() => router.push('/ingresos')}>Entradas al Inventario</li>
            <li className="p-4 hover:bg-gray-200 cursor-pointer" onClick={() => router.push('/visualizacion-reportes')}>Visualización de Reportes</li>
            <li className="p-4 hover:bg-gray-200 cursor-pointer" onClick={() => router.push('/dashboard')}>Venta</li>
            <li className="p-4 hover:bg-gray-200 cursor-pointer" onClick={() => router.push('/kardex')}>Kardex</li>
            <li
                className="p-4 hover:bg-gray-200 cursor-pointer"
                onClick={() => router.push('/register')}
              >
                Registrar usuario
              </li>
            <li className="p-4 hover:bg-gray-200 cursor-pointer" onClick={handleLogout}>Cerrar Sesión</li>
          </ul>
        </div>
      )}

      <div className="flex items-center justify-center p-4">
        <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-4xl">
          <h1 className="text-2xl font-bold mb-6 text-center" style={{ color: '#712b39' }}>
            Crear Usuario
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium" style={{ color: '#712b39' }}>
                  Nombre de Usuario
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Ingrese el nombre de usuario"
                  className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium" style={{ color: '#712b39' }}>
                  Correo Electrónico
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Ingrese el correo"
                  className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium" style={{ color: '#712b39' }}>
                  Contraseña
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ingrese la contraseña"
                  className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none"
                  required
                />
              </div>

              <div>
                <label htmlFor="nombreUsuario" className="block text-sm font-medium" style={{ color: '#712b39' }}>
                  Nombre
                </label>
                <input
                  id="nombreUsuario"
                  type="text"
                  value={nombreUsuario}
                  onChange={(e) => setNombreUsuario(e.target.value)}
                  placeholder="Ingrese el nombre"
                  className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="apellidoUsuario" className="block text-sm font-medium" style={{ color: '#712b39' }}>
                  Apellido
                </label>
                <input
                  id="apellidoUsuario"
                  type="text"
                  value={apellidoUsuario}
                  onChange={(e) => setApellidoUsuario(e.target.value)}
                  placeholder="Ingrese el apellido"
                  className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="telefonoUsuario" className="block text-sm font-medium" style={{ color: '#712b39' }}>
                  Teléfono
                </label>
                <input
                  id="telefonoUsuario"
                  type="text"
                  value={telefonoUsuario}
                  onChange={(e) => setTelefonoUsuario(e.target.value)}
                  placeholder="Ingrese el teléfono"
                  className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="rolUsuario" className="block text-sm font-medium" style={{ color: '#712b39' }}>
                  Rol de Usuario
                </label>
                <select
                  id="rolUsuario"
                  value={rolUsuario}
                  onChange={(e) => setRolUsuario(e.target.value)}
                  className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none"
                >
                  <option value="Administrador">Administrador</option>
                  <option value="Gerente">Gerente</option>
                  <option value="Usuario">Usuario</option>
                </select>
              </div>

              <div>
                <label htmlFor="sucursalUsuario" className="block text-sm font-medium" style={{ color: '#712b39' }}>
                  Sucursal
                </label>
                <select
                  id="sucursalUsuario"
                  value={sucursalUsuario}
                  onChange={(e) => setSucursalUsuario(e.target.value)}
                  className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none"
                >
                  <option value="">Seleccione una sucursal</option>
                  {sucursales.map((sucursal) => (
                    <option key={sucursal.id} value={sucursal.id}>
                      {sucursal.nombre_sucursal}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2 px-4 rounded-lg text-white"
              style={{ backgroundColor: '#712b39' }}
            >
              Registrar Usuario
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}