'use client';
import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
export default function InventoryManagementPage() {
  const router = useRouter();
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProducto, setSelectedProducto] = useState(null);
  const [file, setFile] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

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

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile || !['image/jpeg', 'image/png'].includes(selectedFile.type)) {
      alert('Por favor, selecciona un archivo JPG o PNG válido.');
      return;
    }
    setFile(selectedFile);
  };
  
  

  const uploadImageToCloudinary = async () => {
    if (!file) {
      console.error('No se seleccionó ningún archivo.');
      return null;
    }
  
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);
  
    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );
  
      if (!res.ok) {
        const errorData = await res.json();
        console.error('Error al subir a Cloudinary:', errorData);
        throw new Error('Cloudinary upload failed');
      }
  
      const data = await res.json();
      console.log('URL de la imagen subida:', data.secure_url);
      return data.secure_url; // Devuelve la URL
    } catch (error) {
      console.error('Error al subir la imagen a Cloudinary:', error.message);
      return null;
    }
  };
  
  
  
  
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
      // Usa la URL actual de la imagen si no se selecciona un nuevo archivo
      let imageUrl = formData.imagen_producto;
  
      // Si se selecciona un archivo nuevo, súbelo a Cloudinary
      if (file) {
        imageUrl = await uploadImageToCloudinary();
        if (!imageUrl) {
          alert('Error al subir la imagen. Intenta nuevamente.');
          return;
        }
      }
  
      // Actualiza la URL de la imagen en el formulario
      formData.imagen_producto = imageUrl;
  
      // Determina si se hará POST (crear) o PUT (editar)
      const method = selectedProducto ? 'PUT' : 'POST';
      const url = selectedProducto
        ? `http://127.0.0.1:8000/api/producto/${selectedProducto.id}/`
        : 'http://127.0.0.1:8000/api/producto/';
  
      const payload = {
        ...formData,
        categoria_producto: parseInt(formData.categoria_producto) || null,
        ultima_venta_producto: formData.ultima_venta_producto || null,
      };
  
      // Eliminar el campo 'id' si existe
      delete payload.id;
  
      console.log('JSON que se enviará al backend:', JSON.stringify(payload, null, 2));
  
      // Realiza la solicitud al backend
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
  
      if (res.ok) {
        Swal.fire({
          icon: 'success',
          title: selectedProducto ? 'Producto actualizado' : 'Producto creado',
          showConfirmButton: false,
          timer: 1500
        });
        const productoData = selectedProducto || (await res.json());
        await handleProductProveedoresRelation(productoData.id, formData.proveedores_producto);
        fetchProductos();
        setModalVisible(false);
        setSelectedProducto(null);
        resetForm();
      } else {
        const errorData = await res.json();
        console.error('Errores devueltos por el backend:', errorData);
        Swal.fire({
          icon: 'error',
          title: 'Error al guardar el producto',
          text: 'Por favor, verifica los datos e intenta nuevamente.'
        });
      }
      
    } catch (error) {
      console.error('Error al guardar el producto:', error);
    }
  };
  

  const handleProductProveedoresRelation = async (productoId, proveedores) => {
    try {
      const url = 'http://127.0.0.1:8000/api/productoproveedor/';
      for (const proveedorId of proveedores) {
        const relation = {
          producto_productoProveedor: parseInt(productoId, 10),
          proveedor_productoProveedor: parseInt(proveedorId,10),
          costo_productoProveedor: parseFloat(formData.costo_producto).toFixed(2).toString(),
        };

        const res = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(relation),
        });

        if (!res.ok) {
          console.error(`Error al registrar relación: ${JSON.stringify(relation)}`, await res.json());
          throw new Error('Error al registrar una relación producto-proveedor.');
        }
      }
      console.log('Relaciones registradas correctamente.');
    } catch (error) {
      console.error('Error al guardar las relaciones:', error);
    }
  };
  
  const handleEditProducto = (producto) => {
    setSelectedProducto(producto);
    setFormData({
      ...producto,
      categoria_producto: producto.categoria_producto?.id || producto.categoria_producto||'',
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
      sucursal_producto: 1,
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

  const filteredProductos = productos.filter((producto) =>
    producto.nombre_producto?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col h-screen">
      <div className="relative">
        <div className="flex justify-between items-center bg-[#712b39] text-white p-4 shadow-md border-b border-black">
          <button onClick={() => setMenuOpen(!menuOpen)} className="text-xl font-bold">
            ☰
          </button>
          <h1 className="text-2xl font-bold">Gestión de Productos</h1>
          <input
            type="text"
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 rounded-lg text-black bg-white w-1/3 shadow-md focus:outline-none focus:ring-2 focus:ring-[#712b39]"
          />
          <button
            onClick={handleOpenModal}
            className="bg-[#F4D03F] text-black px-4 py-2 rounded-lg font-bold hover:bg-yellow-600"
          >
            Agregar Producto
          </button>
        </div>

        {menuOpen && (
          <div className="absolute top-16 left-0 bg-white shadow-lg rounded-lg w-64 z-50">
            <ul className="flex flex-col text-black">
              <li
                className="p-4 hover:bg-gray-200 cursor-pointer"
                onClick={() => router.push('/inventario')}
              >
                Gestión de Productos
              </li>
              <li
                className="p-4 hover:bg-gray-200 cursor-pointer"
                onClick={() => router.push('/ingresos')}
              >
                Entradas al Inventario
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
                onClick={() => router.push('/register')}
              >
                Registrar usuario
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

      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 bg-gray-100 overflow-y-auto p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProductos.map((producto) => (
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
                  {/* Barra de progreso */}
  <div className="flex items-center gap-2 mt-2">
    <i className="fas fa-box text-gray-500"></i>
    <div className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden">
      <div
        className="absolute h-full bg-[#712b39]"
        style={{
          width: `${((producto.cantidad_producto - producto.minimo_producto) /
            (producto.maximo_producto - producto.minimo_producto)) *
            100}%`,
        }}
      ></div>
    </div>
    <span className="text-sm">{producto.cantidad_producto}</span>
  </div>
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

      {modalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-2/3">
            <h2 className="text-xl font-bold mb-4">
              {selectedProducto ? 'Editar Producto' : 'Agregar Producto'}
            </h2>
            <div className="grid grid-cols-2 gap-6">
  {/* Primera columna */}
  <div className="flex flex-col space-y-4">
    <div>
      <label className="block text-sm font-medium text-gray-700">Nombre del Producto</label>
      <input
        name="nombre_producto"
        value={formData.nombre_producto}
        onChange={handleInputChange}
        placeholder="Nombre del Producto"
        className="p-3 border rounded-lg w-full focus:ring-[#712b39] focus:border-[#712b39]"
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700">Categoría</label>
      <select
        name="categoria_producto"
        value={formData.categoria_producto}
        onChange={handleInputChange}
        className="p-3 border rounded-lg w-full focus:ring-[#712b39] focus:border-[#712b39]"
      >
        <option value="">Seleccionar Categoría</option>
        {categorias.map((categoria) => (
          <option key={categoria.id} value={categoria.id}>
            {categoria.nombre_categoria}
          </option>
        ))}
      </select>
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700">Precio de Venta (PVP)</label>
      <input
        name="pvp_producto"
        value={formData.pvp_producto}
        onChange={handleInputChange}
        placeholder="Precio de Venta"
        type="number"
        className="p-3 border rounded-lg w-full focus:ring-[#712b39] focus:border-[#712b39]"
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700">Costo del Producto</label>
      <input
        name="costo_producto"
        value={formData.costo_producto}
        onChange={handleInputChange}
        placeholder="Costo del Producto"
        type="number"
        className="p-3 border rounded-lg w-full focus:ring-[#712b39] focus:border-[#712b39]"
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700">Cantidad</label>
      <input
        name="cantidad_producto"
        value={formData.cantidad_producto}
        onChange={handleInputChange}
        placeholder="Cantidad"
        type="number"
        className="p-3 border rounded-lg w-full focus:ring-[#712b39] focus:border-[#712b39]"
      />
    </div>

    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Stock Mínimo</label>
        <input
          name="minimo_producto"
          value={formData.minimo_producto}
          onChange={handleInputChange}
          placeholder="Stock Mínimo"
          type="number"
          className="p-3 border rounded-lg w-full focus:ring-[#712b39] focus:border-[#712b39]"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Stock Máximo</label>
        <input
          name="maximo_producto"
          value={formData.maximo_producto}
          onChange={handleInputChange}
          placeholder="Stock Máximo"
          type="number"
          className="p-3 border rounded-lg w-full focus:ring-[#712b39] focus:border-[#712b39]"
        />
      </div>
    </div>
  </div>

  {/* Segunda columna */}
  <div className="flex flex-col space-y-4">
    <div>
      <label className="block text-sm font-medium text-gray-700">Descripción</label>
      <textarea
        name="descripcion_producto"
        value={formData.descripcion_producto}
        onChange={handleInputChange}
        placeholder="Descripción del Producto"
        className="p-3 border rounded-lg w-full focus:ring-[#712b39] focus:border-[#712b39] h-28"
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700">Marca</label>
      <input
        name="marca_producto"
        value={formData.marca_producto}
        onChange={handleInputChange}
        placeholder="Marca del Producto"
        className="p-3 border rounded-lg w-full focus:ring-[#712b39] focus:border-[#712b39]"
      />
    </div>

    <div>
  <label className="block text-sm font-medium text-gray-700">Imagen del Producto</label>
  <div className="flex flex-col items-center space-y-2">
    <label
      htmlFor="fileInput"
      className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium cursor-pointer hover:bg-gray-300 transition w-full text-center border border-gray-300"
    >
      Seleccionar Archivo
    </label>
    <input
      id="fileInput"
      type="file"
      onChange={handleFileChange}
      accept="image/*"
      className="hidden"
    />
    <span className="text-sm text-gray-500">{file ? file.name : 'No se ha seleccionado ningún archivo'}</span>
  </div>
</div>



    <div>
      <label className="block text-sm font-medium text-gray-700">Proveedores</label>
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
        className="p-3 border rounded-lg w-full focus:ring-[#712b39] focus:border-[#712b39] h-32"
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