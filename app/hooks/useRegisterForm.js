// hooks/useRegisterForm.js
import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

export function useRegisterForm(router) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [apellidoUsuario, setApellidoUsuario] = useState('');
  const [telefonoUsuario, setTelefonoUsuario] = useState('');
  const [rolUsuario, setRolUsuario] = useState('Usuario');
  const [sucursalUsuario, setSucursalUsuario] = useState('');
  const [sucursales, setSucursales] = useState([]);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/sucursal/')
      .then(res => res.json())
      .then(setSucursales)
      .catch(() => Swal.fire('Error', 'No se pudieron cargar las sucursales.', 'error'));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const registerRes = await fetch('http://127.0.0.1:8000/api/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });

      if (!registerRes.ok) throw await registerRes.json();

      await fetch('http://127.0.0.1:8000/api/usuario/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username_usuario: username,
          nombre_usuario: nombreUsuario,
          apellido_usuario: apellidoUsuario,
          email_usuario: email,
          telefono_usuario: telefonoUsuario,
          rol_usuario: rolUsuario,
          sucursal_usuario: sucursalUsuario,
          activo_usuario: true,
        }),
      });

      Swal.fire('Éxito', 'Usuario registrado exitosamente.', 'success')
        .then(() => router.push('/login'));
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'No se pudo registrar el usuario.', 'error');
    }
  };

  return {
    username, setUsername,
    email, setEmail,
    password, setPassword,
    nombreUsuario, setNombreUsuario,
    apellidoUsuario, setApellidoUsuario,
    telefonoUsuario, setTelefonoUsuario,
    rolUsuario, setRolUsuario,
    sucursalUsuario, setSucursalUsuario,
    sucursales,
    handleSubmit
  };
}
