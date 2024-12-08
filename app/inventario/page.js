'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function InventoryManagementPage() {
  const router = useRouter();
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProducto, setSelectedProducto] = useState(null);
  const [formData, setFormData] = useState({
    nombre_producto: '',
    categoria_producto: '',
    pvp_producto: '',
    costo_producto: '',
    cantidad_producto: '',
    minimo_producto: '',
    maximo_producto: '',
    sucursal_producto: 1, // ID quemado de sucursal
    estado_producto: 'Disponible',
    descripcion_producto: '',
    marca_producto: '',
    imagen_producto: '',
    proveedores_producto: [],
    ultima_venta_producto: null,
  });

  useEffect(() => {
    fetchProductos();
    fetchCategorias();
    fetchProveedores();
  }, []);

  const fetchProductos = async () => {
    try {
      const res = await fetch('http://127.0.0.1:8000/api/producto/');
      if (res.ok) {
        const data = await res.json();
        setProductos(data);
      } else {
        alert('Error al cargar los productos.');
      }
    } catch (error) {
      console.error('Error al obtener los productos:', error);
    }
  };

  const fetchCategorias = async () => {
    try {
      const res = await fetch('http://127.0.0.1:8000/api/categoria/');
      if (res.ok) {
        const data = await res.json();
        setCategorias(data);
      } else {
        alert('Error al cargar las categorías.');
      }
    } catch (error) {
      console.error('Error al obtener las categorías:', error);
    }
  };

  const fetchProveedores = async () => {
    try {
      const res = await fetch('http://127.0.0.1:8000/api/proveedor/');
      if (res.ok) {
        const data = await res.json();
        setProveedores(data);
      } else {
        alert('Error al cargar los proveedores.');
      }
    } catch (error) {
      console.error('Error al obtener los proveedores:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddOrUpdateProducto = async () => {
    try {
      const method = selectedProducto ? 'PUT' : 'POST';
      const url = selectedProducto
        ? `http://127.0.0.1:8000/api/producto/${selectedProducto.id}/`
        : 'http://127.0.0.1:8000/api/producto/';

      const payload = {
        ...formData,
        categoria_producto: parseInt(formData.categoria_producto) || null,
        ultima_venta_producto: formData.ultima_venta_producto || null,
        proveedores_producto: formData.proveedores_producto || [],
      };

      // Eliminar el campo 'id' si existe
      delete payload.id;

      console.log('JSON que se enviará al backend:', JSON.stringify(payload, null, 2));

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert(selectedProducto ? 'Producto actualizado' : 'Producto creado');
        const productoData = selectedProducto || (await res.json());
        await handleProductProveedoresRelation(payload.proveedores_producto, productoData.id);
        fetchProductos();
        setModalVisible(false);
        setSelectedProducto(null);
        resetForm();
      } else {
        const errorData = await res.json();
        console.error('Errores devueltos por el backend:', errorData);
        alert('Error al guardar el producto.');
      }
    } catch (error) {
      console.error('Error al guardar el producto:', error);
    }
  };

  const handleProductProveedoresRelation = async (proveedores, productoId) => {
    try {
      const url = 'http://127.0.0.1:8000/api/productoproveedor/';

      if (!proveedores || !productoId) {
        console.error('Faltan datos para la relación producto-proveedor:', { proveedores, productoId });
        alert('No se pudo crear la relación producto-proveedor debido a datos incompletos.');
        return;
      }

      const relations = proveedores.map((proveedorId) => ({
        producto_productoProveedor: parseInt(productoId, 10), // Asegura que sea un número
        proveedor_productoProveedor: parseInt(proveedorId, 10), // Asegura que sea un número
        costo_productoProveedor: parseFloat(formData.costo_producto).toFixed(2), // Asegura que sea un decimal
      }));

      console.log('JSON:',JSON.stringify(relations,null,2));

      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(relations),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error('Errores en la relación de producto-proveedor:', errorData);
        alert('Error al guardar la relación producto-proveedor.');
      } else {
        console.log('Relación producto-proveedor creada exitosamente.');
      }
    } catch (error) {
      console.error('Error al guardar la relación producto-proveedor:', error);
      alert('Error inesperado al guardar la relación producto-proveedor.');
    }
  };

  const handleEditProducto = (producto) => {
    setSelectedProducto(producto);
    setFormData({
      ...producto,
      categoria_producto: producto.categoria_producto?.id || '',
      proveedores_producto: producto.proveedores_producto || [],
    });
    setModalVisible(true);
  };

  const handleDeleteProducto = async (id) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/producto/${id}/`, {
        method: 'DELETE',
      });

      if (res.ok) {
        alert('Producto eliminado');
        fetchProductos();
      } else {
        alert('Error al eliminar el producto.');
      }
    } catch (error) {
      console.error('Error al eliminar el producto:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      nombre_producto: '',
      categoria_producto: '',
      pvp_producto: '',
      costo_producto: '',
      cantidad_producto: '',
      minimo_producto: '',
      maximo_producto: '',
      sucursal_producto: 1, // ID quemado de sucursal
      estado_producto: 'Disponible',
      descripcion_producto: '',
      marca_producto: '',
      imagen_producto: '',
      proveedores_producto: [],
      ultima_venta_producto: null,
    });
  };

  const handleOpenModal = () => {
    setSelectedProducto(null);
    resetForm();
    setModalVisible(true);
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header con menú de hamburguesa */}
      <div className="relative">
        <div className="flex justify-between items-center bg-[#712b39] text-white p-4 shadow-md border-b border-black">
          <button onClick={() => setMenuOpen(!menuOpen)} className="text-xl font-bold">
            ☰
          </button>
          <h1 className="text-2xl font-bold">Gestión de Inventario</h1>
          <button
            onClick={handleOpenModal}
            className="bg-[#fcda11] text-black px-4 py-2 rounded-lg font-bold hover:bg-yellow-600"
          >
            Agregar Producto
          </button>
        </div>

        {/* Menú flotante */}
        {menuOpen && (
          <div className="absolute top-16 left-0 bg-white shadow-lg rounded-lg w-64 z-50">
            <ul className="flex flex-col text-black">
              <li
                className="p-4 hover:bg-gray-200 cursor-pointer"
                onClick={() => router.push('/inventario')}
              >
                Gestión de Inventario
              </li>
              <li
                className="p-4 hover:bg-gray-200 cursor-pointer"
                onClick={() => router.push('/visualizacion-reportes')}
              >
                Visualización de Reportes
              </li>
              <li
                className="p-4 hover:bg-gray-200 cursor-pointer"
                onClick={() => router.push('/dashboard')}
              >
                Venta
              </li>
              <li
                className="p-4 hover:bg-gray-200 cursor-pointer"
                onClick={() => router.push('/kardex')}
              >
                Kardex
              </li>
              <li
                className="p-4 hover:bg-gray-200 cursor-pointer"
                onClick={() => localStorage.clear() || router.push('/login')}
              >
                Cerrar Sesión
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* Productos */}
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 bg-gray-100 overflow-y-auto p-4">
          <h2 className="text-2xl font-bold mb-2 text-[#712b39]">Productos</h2>
          <div className="grid grid-cols-4 gap-4">
            {productos.map((producto) => (
              <div
                key={producto.id}
                className="bg-white shadow-md p-4 rounded-lg text-center hover:shadow-lg transition-shadow"
              >
                <h3 className="font-bold">{producto.nombre_producto}</h3>
                <p className="text-sm">
                  {categorias.find((c) => c.id === producto.categoria_producto)?.nombre_categoria ||
                    'Sin Categoría'}
                </p>
                <p className="text-lg">${producto.pvp_producto}</p>
                <p className="text-sm">Cantidad: {producto.cantidad_producto}</p>
                <p className="text-sm">Estado: {producto.estado_producto}</p>
                {producto.imagen_producto && (
                  <img
                    src={producto.imagen_producto}
                    alt={producto.nombre_producto}
                    className="mx-auto my-2 rounded-md"
                    style={{ width: '90px', height: '90px', objectFit: 'cover' }}
                  />
                )}
                <div className="flex justify-between mt-4">
                  <button
                    onClick={() => handleEditProducto(producto)}
                    className="bg-gray-200 text-black rounded-full p-3 hover:bg-gray-300 transition"
                  >
                    <i className="fas fa-pen text-xl"></i>
                  </button>
                  <button
                    onClick={() => handleDeleteProducto(producto.id)}
                    className="bg-gray-200 text-black rounded-full p-3 hover:bg-gray-300 transition"
                  >
                    <i className="fas fa-trash text-xl"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal */}
      {modalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-2/3">
            <h2 className="text-xl font-bold mb-4">
              {selectedProducto ? 'Editar Producto' : 'Agregar Producto'}
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {/* Primera columna */}
              <div className="flex flex-col space-y-4">
                <input
                  name="nombre_producto"
                  value={formData.nombre_producto}
                  onChange={handleInputChange}
                  placeholder="Nombre del Producto"
                  className="p-2 border rounded"
                />
                <select
                  name="categoria_producto"
                  value={formData.categoria_producto}
                  onChange={handleInputChange}
                  className="p-2 border rounded"
                >
                  <option value="">Seleccionar Categoría</option>
                  {categorias.map((categoria) => (
                    <option key={categoria.id} value={categoria.id}>
                      {categoria.nombre_categoria}
                    </option>
                  ))}
                </select>
                <input
                  name="pvp_producto"
                  value={formData.pvp_producto}
                  onChange={handleInputChange}
                  placeholder="Precio de Venta"
                  type="number"
                  className="p-2 border rounded"
                />
                <input
                  name="costo_producto"
                  value={formData.costo_producto}
                  onChange={handleInputChange}
                  placeholder="Costo del Producto"
                  type="number"
                  className="p-2 border rounded"
                />
                <input
                  name="cantidad_producto"
                  value={formData.cantidad_producto}
                  onChange={handleInputChange}
                  placeholder="Cantidad"
                  type="number"
                  className="p-2 border rounded"
                />
                <input
                  name="minimo_producto"
                  value={formData.minimo_producto}
                  onChange={handleInputChange}
                  placeholder="Stock Mínimo"
                  type="number"
                  className="p-2 border rounded"
                />
                <input
                  name="maximo_producto"
                  value={formData.maximo_producto}
                  onChange={handleInputChange}
                  placeholder="Stock Máximo"
                  type="number"
                  className="p-2 border rounded"
                />
              </div>
              {/* Segunda columna */}
              <div className="flex flex-col space-y-4">
                <textarea
                  name="descripcion_producto"
                  value={formData.descripcion_producto}
                  onChange={handleInputChange}
                  placeholder="Descripción del Producto"
                  className="p-2 border rounded h-24"
                />
                <input
                  name="marca_producto"
                  value={formData.marca_producto}
                  onChange={handleInputChange}
                  placeholder="Marca del Producto"
                  className="p-2 border rounded"
                />
                <input
                  name="imagen_producto"
                  value={formData.imagen_producto}
                  onChange={handleInputChange}
                  placeholder="URL de la Imagen"
                  className="p-2 border rounded"
                />
                <select
                  name="proveedores_producto"
                  multiple
                  value={formData.proveedores_producto}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      proveedores_producto: Array.from(e.target.selectedOptions, (option) => option.value),
                    })
                  }
                  className="p-2 border rounded h-32"
                >
                  <option value="">Seleccionar Proveedores</option>
                  {proveedores.map((proveedor) => (
                    <option key={proveedor.id} value={proveedor.id}>
                      {proveedor.nombre_proveedor}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex justify-end mt-4 space-x-4">
              <button
                onClick={() => setModalVisible(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddOrUpdateProducto}
                className="bg-[#712b39] text-white px-4 py-2 rounded-lg hover:bg-[#5e242e]"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}