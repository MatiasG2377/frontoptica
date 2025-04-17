"use client";
import { useRouter } from "next/navigation";
import useInventario from "../hooks/useInventario";

import HeaderInventario from "../components/inventario/HeaderInventario";
import CardProducto from "../components/inventario/CardProducto";
import FormularioProducto from "../components/inventario/FormularioProducto";
import { useState } from "react";

/**
 * Página de gestión de inventario.
 *
 * Presenta una lista de productos con sus respectivos datos y permite
 * agregar, editar y eliminar productos. También permite filtrar los
 * productos por nombre o categoría.
 *
 *? @returns {JSX.Element} P gina de gesti n de inventario.
 */

export default function InventoryManagementPage() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const {
    categorias,
    proveedores,
    formData,
    setFormData,
    file,
    setFile,
    modalVisible,
    setModalVisible,
    searchTerm,
    setSearchTerm,
    handleOpenModal,
    handleAddOrUpdateProducto,
    handleEditProducto,
    handleDeleteProducto,
    filteredProductos,
  } = useInventario();

  return (
    <div className="flex flex-col h-screen">
      <HeaderInventario
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onOpenModal={handleOpenModal}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        router={router}
      />

      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 bg-gray-100 overflow-y-auto p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProductos.map((producto) => (
              <CardProducto
                key={producto.id}
                producto={producto}
                categorias={categorias}
                onEdit={handleEditProducto}
                onDelete={handleDeleteProducto}
              />
            ))}
          </div>
        </div>
      </div>

      {modalVisible && (
        <FormularioProducto
          isOpen={modalVisible}
          onClose={() => setModalVisible(false)}
          formData={formData}
          setFormData={setFormData}
          categorias={categorias}
          proveedores={proveedores}
          file={file}
          setFile={setFile}
          onSubmit={handleAddOrUpdateProducto}
        />
      )}
    </div>
  );
}
