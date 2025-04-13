import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

export default function useInventario() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [selectedProducto, setSelectedProducto] = useState(null);
  const [formData, setFormData] = useState({
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
  const [file, setFile] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchProductos();
    fetchCategorias();
    fetchProveedores();
  }, []);

  const fetchProductos = async () => {
    const res = await fetch('http://127.0.0.1:8000/api/producto/');
    const data = await res.json();
    setProductos(data);
  };

  const fetchCategorias = async () => {
    const res = await fetch('http://127.0.0.1:8000/api/categoria/');
    const data = await res.json();
    setCategorias(data);
  };

  const fetchProveedores = async () => {
    const res = await fetch('http://127.0.0.1:8000/api/proveedor/');
    const data = await res.json();
    setProveedores(data);
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
    setFile(null);
  };

  const uploadImageToCloudinary = async () => {
    if (!file) return formData.imagen_producto;
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    const cloudData = new FormData();
    cloudData.append('file', file);
    cloudData.append('upload_preset', uploadPreset);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: cloudData,
    });
    const data = await res.json();
    return data.secure_url;
  };

  const handleAddOrUpdateProducto = async () => {
    const imageUrl = await uploadImageToCloudinary();
    const payload = {
      ...formData,
      imagen_producto: imageUrl,
      categoria_producto: parseInt(formData.categoria_producto) || null,
      ultima_venta_producto: formData.ultima_venta_producto || null,
    };

    delete payload.id;

    const method = selectedProducto ? 'PUT' : 'POST';
    const url = selectedProducto
      ? `http://127.0.0.1:8000/api/producto/${selectedProducto.id}/`
      : 'http://127.0.0.1:8000/api/producto/';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      Swal.fire({ icon: 'success', title: selectedProducto ? 'Producto actualizado' : 'Producto creado', showConfirmButton: false, timer: 1500 });
      const productoData = selectedProducto || (await res.json());
      await handleProductProveedoresRelation(productoData.id, formData.proveedores_producto);
      fetchProductos();
      setModalVisible(false);
      setSelectedProducto(null);
      resetForm();
    } else {
      const errorData = await res.json();
      console.error(errorData);
      Swal.fire({ icon: 'error', title: 'Error al guardar el producto', text: 'Verifica los datos e intenta nuevamente.' });
    }
  };

  const handleProductProveedoresRelation = async (productoId, proveedoresList) => {
    for (const proveedorId of proveedoresList) {
      const relation = {
        producto_productoProveedor: parseInt(productoId, 10),
        proveedor_productoProveedor: parseInt(proveedorId, 10),
        costo_productoProveedor: parseFloat(formData.costo_producto).toFixed(2).toString(),
      };

      await fetch('http://127.0.0.1:8000/api/productoproveedor/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(relation),
      });
    }
  };

  const handleEditProducto = (producto) => {
    setSelectedProducto(producto);
    setFormData({
      ...producto,
      categoria_producto: producto.categoria_producto?.id || producto.categoria_producto || '',
      proveedores_producto: producto.proveedores_producto || [],
    });
    setModalVisible(true);
  };

  const handleDeleteProducto = async (id) => {
    const res = await fetch(`http://127.0.0.1:8000/api/producto/${id}/`, {
      method: 'DELETE',
    });
    if (res.ok) {
      Swal.fire('Eliminado', 'Producto eliminado correctamente.', 'success');
      fetchProductos();
    } else {
      Swal.fire('Error', 'No se pudo eliminar el producto.', 'error');
    }
  };

  const handleOpenModal = () => {
    setSelectedProducto(null);
    resetForm();
    setModalVisible(true);
  };

  const filteredProductos = productos.filter((p) =>
    p.nombre_producto?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return {
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
  };
}
