"use client";

import Header from "../components/common/Header2";
import AbonoTabla from "../components/abonos/AbonoTabla";
import AbonoModal from "../components/abonos/AbonoModal";
import { useAbonos } from "../hooks/useAbonoRead";
import { useAuth } from "../hooks/useAuth";
import { useState, useEffect } from "react";

export default function AbonosPage() {
  const { logout } = useAuth();
  const API_URL = "http://127.0.0.1:8000/api";

  const {
    abonos,
    setAbonos,
    loading,
    setLoading,
    fetchAbonos,
  } = useAbonos(API_URL);

  const [abonoSeleccionado, setAbonoSeleccionado] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    fetchAbonos();
  }, []);

  const handleReducirPendiente = async (abono) => {
    const total = parseFloat(abono.venta?.total_venta || 0);
    const pagado = parseFloat(abono.monto);
    const restante = total - pagado;

    const cantidad = prompt(`Restante: $${restante.toFixed(2)}. ¿Cuánto desea abonar?`);
    if (!cantidad) return;

    const montoNuevo = parseFloat(cantidad);
    const precision = 0.0001;
    if (isNaN(montoNuevo) || montoNuevo <= 0) {
      alert("Ingrese un monto válido");
      return;
    }
    if (montoNuevo - restante > precision) {
      alert(`El monto ingresado ($${montoNuevo.toFixed(2)}) excede el restante ($${restante.toFixed(2)})`);
      return;
    }

    try {
      setLoading(true);
      const nuevoMonto = pagado + montoNuevo;
      const actualizado = {
        ...abono,
        cliente: abono.cliente?.id || abono.cliente,
        venta: abono.venta?.id || abono.venta,
        monto: nuevoMonto,
        fecha: new Date().toISOString(),
      };

      const res = await fetch(`${API_URL}/abono/${abono.id}/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(actualizado),
      });

      if (!res.ok) throw new Error("Error al actualizar el abono");

      await fetchAbonos();
      alert(`Abono de $${montoNuevo.toFixed(2)} registrado correctamente.`);
    } catch (error) {
      console.error("Error al registrar el abono:", error);
      alert("Ocurrió un error al procesar el abono.");
    } finally {
      setLoading(false);
    }
  };

  const abrirModalEdicion = (abono) => {
    setAbonoSeleccionado({ ...abono });
    setMostrarModal(true);
  };

  const handleChange = (field, value) => {
    setAbonoSeleccionado((prev) => ({ ...prev, [field]: value }));
  };

  const guardarEdicion = async () => {
    try {
      setLoading(true);
      const monto = parseFloat(abonoSeleccionado.monto);

      if (isNaN(monto) || monto < 0) {
        alert("Por favor ingrese un monto válido");
        return;
      }

      const res = await fetch(`${API_URL}/abono/${abonoSeleccionado.id}/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...abonoSeleccionado,
          cliente: abonoSeleccionado.cliente?.id || abonoSeleccionado.cliente,
          venta: abonoSeleccionado.venta?.id || abonoSeleccionado.venta,
          monto,
        }),
      });

      if (!res.ok) throw new Error("Error al actualizar el abono");

      await fetchAbonos();
      setMostrarModal(false);
      alert("Abono actualizado correctamente");
    } catch (error) {
      console.error("Error al actualizar el abono:", error);
      alert("Ocurrió un error al actualizar el abono.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-100">
      <Header
        title="Abonos"
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        handleLogout={logout}
      />

      <div className="w-full px-6 py-10">
        <div className="w-full bg-white rounded-xl shadow-lg p-6">
          <h1 className="text-3xl font-bold text-[#712b39] mb-6">
            Historial de Abonos
          </h1>

          {loading ? (
            <p className="text-gray-500">Cargando datos...</p>
          ) : (
            <AbonoTabla
              abonos={abonos}
              onAbonar={handleReducirPendiente}
              onEditar={abrirModalEdicion}
              loading={loading}
            />
          )}

          {mostrarModal && abonoSeleccionado && (
            <AbonoModal
              abono={abonoSeleccionado}
              loading={loading}
              onClose={() => setMostrarModal(false)}
              onSave={guardarEdicion}
              onChange={handleChange}
            />
          )}
        </div>
      </div>
    </div>
  );
}