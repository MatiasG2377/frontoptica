'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { useAuth } from '../hooks/useAuth';
import { useRegisterForm } from '../hooks/useRegisterForm';

import Header from '../components/common/Header2';
import RegisterForm from '../components/register/RegisterForm';

export default function RegisterPage() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const { logout } = useAuth();

  const {
    username, setUsername,
    email, setEmail,
    password, setPassword,
    nombreUsuario, setNombreUsuario,
    apellidoUsuario, setApellidoUsuario,
    telefonoUsuario, setTelefonoUsuario,
    rolUsuario, setRolUsuario,
    sucursalUsuario, setSucursalUsuario,
    sucursales,
    handleSubmit,
  } = useRegisterForm(router);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header reutilizable */}
      <Header
        title="Registro de usuarios"
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        handleLogout={logout}
      />

      <div className="flex items-center justify-center p-4">
        <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-4xl">
          <h1 className="text-2xl font-bold mb-6 text-center" style={{ color: '#712b39' }}>
            Crear Usuario
          </h1>

          <RegisterForm
            username={username} setUsername={setUsername}
            email={email} setEmail={setEmail}
            password={password} setPassword={setPassword}
            nombreUsuario={nombreUsuario} setNombreUsuario={setNombreUsuario}
            apellidoUsuario={apellidoUsuario} setApellidoUsuario={setApellidoUsuario}
            telefonoUsuario={telefonoUsuario} setTelefonoUsuario={setTelefonoUsuario}
            rolUsuario={rolUsuario} setRolUsuario={setRolUsuario}
            sucursalUsuario={sucursalUsuario} setSucursalUsuario={setSucursalUsuario}
            sucursales={sucursales}
            handleSubmit={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
}
