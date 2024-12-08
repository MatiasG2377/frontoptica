'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [apellidoUsuario, setApellidoUsuario] = useState('');
  const [telefonoUsuario, setTelefonoUsuario] = useState('');
  const [rolUsuario, setRolUsuario] = useState('Usuario');
  const [sucursalUsuario, setSucursalUsuario] = useState('');
  const [sucursales, setSucursales] = useState([]); // Lista de sucursales
  const router = useRouter();

  // Cargar sucursales desde la API
  useEffect(() => {
    const fetchSucursales = async () => {
      try {
        const res = await fetch('http://127.0.0.1:8000/api/sucursal/'); // Endpoint de sucursales
        if (res.ok) {
          const data = await res.json();
          setSucursales(data); // Guardar las sucursales en el estado
        } else {
          alert('Error al cargar las sucursales.');
        }
      } catch (error) {
        console.error('Error al obtener las sucursales:', error);
      }
    };

    fetchSucursales();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Registrar en el endpoint /register/
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

        // Registrar en el endpoint /usuario/
        const usuarioRes = await fetch('http://127.0.0.1:8000/api/usuario/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nombre_usuario: nombreUsuario,
            apellido_usuario: apellidoUsuario,
            email_usuario: email,
            telefono_usuario: telefonoUsuario,
            rol_usuario: rolUsuario,
            sucursal_usuario: sucursalUsuario, // Guardar el ID de la sucursal
            activo_usuario: true,
          }),
        });

        if (usuarioRes.ok) {
          alert('Usuario registrado exitosamente.');
          router.push('/login');
        } else {
          const usuarioErrorData = await usuarioRes.json();
          alert(`Error al registrar datos adicionales: ${JSON.stringify(usuarioErrorData)}`);
        }
      } else {
        const registerErrorData = await registerRes.json();
        alert(`Error al registrarse: ${JSON.stringify(registerErrorData)}`);
      }
    } catch (error) {
      console.error('Error al registrar el usuario:', error);
      alert('Hubo un problema al registrar el usuario.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-4xl">
        {/* Título */}
        <h1 className="text-2xl font-bold mb-6 text-center" style={{ color: '#712b39' }}>
          Crear Usuario
        </h1>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Nombre de Usuario */}
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

            {/* Correo Electrónico */}
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

            {/* Contraseña */}
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

            {/* Nombre */}
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

            {/* Apellido */}
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

            {/* Teléfono */}
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

            {/* Rol de Usuario */}
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

            {/* Sucursal */}
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
  );
}
