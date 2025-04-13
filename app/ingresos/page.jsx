'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../components/common/Header2';
import FormularioIngreso from '../components/ingresos/FormularioIngreso';
import { useAuth } from '../hooks/useAuth';
import useIngresoProducto from '../hooks/useIngresoProducto';

export default function IngresoProductosPage() {
  const router = useRouter();
  const { logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false); // ✅ Control del menú

  const {
    productos,
    filteredProductos,
    proveedores,
    selectedProveedor,
    setSelectedProveedor,
    searchProducto,
    setSearchProducto,
    selectedProducto,
    setSelectedProducto,
    cantidadIngreso,
    setCantidadIngreso,
    costoUnitario,
    setCostoUnitario,
    motivo,
    setMotivo,
    fechaCaducidad,
    setFechaCaducidad,
    descripcion,
    setDescripcion,
    marca,
    setMarca,
    metodoValoracion,
    setMetodoValoracion,
    isLoading,
    handleSearchProducto,
    handleIngreso,
  } = useIngresoProducto(router);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header
        title="Entradas al Inventario"
        menuOpen={menuOpen}           // ✅ Estado real del menú
        setMenuOpen={setMenuOpen}     // ✅ Función que actualiza el menú
        handleLogout={logout}
      />

      <FormularioIngreso
        productos={productos}
        filteredProductos={filteredProductos}
        proveedores={proveedores}
        selectedProveedor={selectedProveedor}
        setSelectedProveedor={setSelectedProveedor}
        searchProducto={searchProducto}
        setSearchProducto={setSearchProducto}
        selectedProducto={selectedProducto}
        setSelectedProducto={setSelectedProducto}
        cantidadIngreso={cantidadIngreso}
        setCantidadIngreso={setCantidadIngreso}
        costoUnitario={costoUnitario}
        setCostoUnitario={setCostoUnitario}
        motivo={motivo}
        setMotivo={setMotivo}
        fechaCaducidad={fechaCaducidad}
        setFechaCaducidad={setFechaCaducidad}
        descripcion={descripcion}
        setDescripcion={setDescripcion}
        marca={marca}
        setMarca={setMarca}
        metodoValoracion={metodoValoracion}
        setMetodoValoracion={setMetodoValoracion}
        isLoading={isLoading}
        handleSearchProducto={handleSearchProducto}
        handleIngreso={handleIngreso}
      />
    </div>
  );
}
