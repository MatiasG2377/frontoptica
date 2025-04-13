import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

export default function useIngresoProducto(router) {
  const [productos, setProductos] = useState([]);
  const [filteredProductos, setFilteredProductos] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [selectedProveedor, setSelectedProveedor] = useState(null);
  const [searchProducto, setSearchProducto] = useState('');
  const [selectedProducto, setSelectedProducto] = useState(null);
  const [cantidadIngreso, setCantidadIngreso] = useState(0);
  const [costoUnitario, setCostoUnitario] = useState('');
  const [motivo, setMotivo] = useState('');
  const [fechaCaducidad, setFechaCaducidad] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [marca, setMarca] = useState('');
  const [metodoValoracion, setMetodoValoracion] = useState('Promedio');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      router.push('/login');
      return;
    }
    fetchProductos();
    fetchProveedores();
  }, []);

  const fetchProductos = async () => {
    const res = await fetch('http://127.0.0.1:8000/api/producto/');
    const data = await res.json();
    setProductos(data);
    setFilteredProductos(data);
  };

  const fetchProveedores = async () => {
    const res = await fetch('http://127.0.0.1:8000/api/proveedor/');
    const data = await res.json();
    setProveedores(data);
  };

  const handleSearchProducto = (term) => {
    setSearchProducto(term);
    setFilteredProductos(
      productos.filter((producto) =>
        producto.nombre_producto.toLowerCase().includes(term.toLowerCase())
      )
    );
  };

  const resetFormulario = () => {
    setCantidadIngreso(0);
    setCostoUnitario('');
    setMotivo('');
    setFechaCaducidad('');
    setDescripcion('');
    setMarca('');
    setSelectedProveedor(null);
    setSearchProducto('');
    setSelectedProducto(null);
  };

  const handleIngreso = async () => {
    const usuarioId = localStorage.getItem('userId');
    if (!usuarioId) {
      Swal.fire('Error', 'Usuario no autenticado. Inicie sesión nuevamente.', 'error');
      return;
    }

    if (!selectedProducto || !cantidadIngreso || !costoUnitario || !selectedProveedor) {
      Swal.fire('Error', 'Por favor, complete todos los campos obligatorios.', 'error');
      return;
    }

    setIsLoading(true);

    try {
      const cantidad = parseInt(cantidadIngreso, 10);
      const costo = parseFloat(costoUnitario);
      const productoActualizado = {
        ...selectedProducto,
        cantidad_producto: selectedProducto.cantidad_producto + cantidad,
        descripcion_producto: descripcion || selectedProducto.descripcion_producto,
        marca_producto: marca || selectedProducto.marca_producto,
        metodo_valoracion: metodoValoracion,
      };

      await fetch(`http://127.0.0.1:8000/api/producto/${selectedProducto.id}/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productoActualizado),
      });

      await fetch('http://127.0.0.1:8000/api/movimiento/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          producto_movimientoInventario: selectedProducto.id,
          usuario_movimientoInventario: usuarioId,
          tipo_movimientoInventario: 'Entrada',
          cantidad_movimientoInventario: cantidad,
          motivo_movimientoInventario: motivo,
        }),
      });

      const kardexPayload = {
        producto_kardex: selectedProducto.id,
        tipo_kardex: 'Entrada',
        cantidad_kardex: cantidad,
        costo_unitario_kardex: costo.toFixed(2),
        costo_total_kardex: (cantidad * costo).toFixed(2),
        saldo_cantidad_kardex: productoActualizado.cantidad_producto,
        saldo_costo_kardex: (productoActualizado.cantidad_producto * costo).toFixed(2),
        referencia_kardex: motivo,
      };

      if (fechaCaducidad) {
        const resLote = await fetch('http://127.0.0.1:8000/api/lote/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            producto_lote: selectedProducto.id,
            cantidad_lote: cantidad,
            fecha_caducidad_lote: fechaCaducidad,
          }),
        });

        const loteData = await resLote.json();
        kardexPayload.lote_kardex = loteData.id;
      }

      await fetch('http://127.0.0.1:8000/api/kardex/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(kardexPayload),
      });

      await fetch('http://127.0.0.1:8000/api/productoproveedor/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          producto_productoProveedor: selectedProducto.id,
          proveedor_productoProveedor: selectedProveedor,
          costo_productoProveedor: costo.toFixed(2),
        }),
      });

      Swal.fire('Éxito', 'Ingreso registrado correctamente.', 'success');
      resetFormulario();
      fetchProductos();
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'Ocurrió un error al registrar el ingreso.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return {
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
  };
}
