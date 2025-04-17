"use client";
import useCliente from "../hooks/useCliente";
import FormularioCliente from "../components/registro-clientes/FormularioCliente";
import { useState } from "react";
import Header from "../components/common/Header2";
import { useAuth } from "../hooks/useAuth";

/**
 * Página de registro de clientes.
 *
 * Esta página permite a los usuarios registrar nuevos clientes.
 * Incluye un formulario para capturar los datos del cliente y
 * un botón para guardar los cambios.
 *
 *? @return {JSX.Element} La p gina de registro de clientes.
 */
export default function RegistroClientePage() {
  const [menuOpen, setMenuOpen] = useState(false);

  const { logout } = useAuth();

  const {
    clienteData,
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
        handleLogout={logout}
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
