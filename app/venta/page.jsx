'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { useAuth } from '../hooks/useAuth';
import useVenta from '../hooks/useVenta';

import VentaMenu from '../components/venta/VentaMenu';
import ClienteForm from '../components/venta/ClienteForm';
import CartResumenVenta from '../components/venta/CartResumenVenta';

export default function VentaPage() {
  const router = useRouter();
  const { logout } = useAuth(); // Hook centralizado de sesión
  const [menuOpen, setMenuOpen] = useState(false);

  const {
    cart,
    clienteData,
    handleInputChange,
    handleSubmit,
    handleCancel,
    isSubmitting,
    metodoVenta,
    setMetodoVenta,
    progreso,
  } = useVenta();

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey && event.altKey && event.key === '1') {
        event.preventDefault();
        document.querySelector('[name="ci_cliente"]')?.focus();
      } else if (event.ctrlKey && event.altKey && event.key === 'Enter') {
        event.preventDefault();
        document.querySelector('#submitButton')?.click();
      } else if (event.ctrlKey && event.altKey && event.key === '2') {
        event.preventDefault();
        handleCancel();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleCancel]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <VentaMenu
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        handleLogout={logout}
        router={router}
      />

      <ClienteForm
        clienteData={clienteData}
        handleInputChange={handleInputChange}
        metodoVenta={metodoVenta}
        setMetodoVenta={setMetodoVenta}
        progreso={progreso}
      />

      <CartResumenVenta
        cart={cart}
        isSubmitting={isSubmitting}
        handleSubmit={handleSubmit}
        handleCancel={handleCancel}
      />
    </div>
  );
}
