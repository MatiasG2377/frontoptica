'use client';
import useCliente from '../hooks/useCliente'; // Asegúrate de que la ruta sea correcta
import FormularioCliente from '../components/registro-clientes/FormularioCliente';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Header from '../components/common/Header2';
import { useAuth } from '../hooks/useAuth'; // ajusta el path si está en otra carpeta

export default function RegistroClientePage() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const { logout } = useAuth(); // ✅ Aquí traemos la función logout directamente

  const {
    clienteData,
    setClienteData,
    clienteExistente,
    isSubmitting,
    handleInputChange,
    handleSubmit,
  } = useCliente();

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header
        title="Registro de Clientes"
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        handleLogout={logout} // ✅ Acá le pasamos el logout del hook
      />

      <FormularioCliente
        clienteData={clienteData}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        clienteExistente={clienteExistente}
      />
    </div>
  );
}
