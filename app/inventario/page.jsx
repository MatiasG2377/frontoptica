'use client';
import { useRouter } from 'next/navigation';
import { useAuth } from '../hooks/useAuth';
import useInventario from '../hooks/useInventario';

import HeaderInventario from '../components/inventario/HeaderInventario';
import CardProducto from '../components/inventario/CardProducto';
import FormularioProducto from '../components/inventario/FormularioProducto';
import { useState } from 'react';

export default function InventoryManagementPage() {
  const router = useRouter();
  const { logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const {
    productos,
    categorias,
    proveedores,
    selectedProducto,
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
        setMenuOpen= {setMenuOpen}
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
