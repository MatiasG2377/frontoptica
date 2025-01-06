'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';

export default function IngresoProductosPage() {
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
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter(); // Para la navegación

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
    try {
      const res = await fetch('http://127.0.0.1:8000/api/producto/');
      if (res.ok) {
        const data = await res.json();
        setProductos(data);
        setFilteredProductos(data);
      } else {
        Swal.fire('Error', 'No se pudieron cargar los productos.', 'error');
      }
    } catch (error) {
      console.error('Error al obtener productos:', error);
    }
  };

  const fetchProveedores = async () => {
    try {
      const res = await fetch('http://127.0.0.1:8000/api/proveedor/');
      if (res.ok) {
        const data = await res.json();
        setProveedores(data);
      } else {
        Swal.fire('Error', 'No se pudieron cargar los proveedores.', 'error');
      }
    } catch (error) {
      console.error('Error al obtener proveedores:', error);
    }
  };

  const handleSearchProducto = (term) => {
    setSearchProducto(term);
    setFilteredProductos(
      productos.filter((producto) =>
        producto.nombre_producto.toLowerCase().includes(term.toLowerCase())
      )
    );
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
      const productoActualizado = {
        ...selectedProducto,
        cantidad_producto: selectedProducto.cantidad_producto + parseInt(cantidadIngreso, 10),
        descripcion_producto: descripcion || selectedProducto.descripcion_producto,
        marca_producto: marca || selectedProducto.marca_producto,
        metodo_valoracion: metodoValoracion,
      };

      const resProducto = await fetch(
        `http://127.0.0.1:8000/api/producto/${selectedProducto.id}/`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(productoActualizado),
        }
      );

      if (!resProducto.ok) {
        throw new Error('Error al actualizar el producto.');
      }

      const movimientoPayload = {
        producto_movimientoInventario: selectedProducto.id,
        usuario_movimientoInventario: usuarioId,
        tipo_movimientoInventario: 'Entrada',
        cantidad_movimientoInventario: cantidadIngreso,
        motivo_movimientoInventario: motivo,
      };

      console.log('Payload Movimiento:', movimientoPayload);

      const resMovimiento = await fetch('http://127.0.0.1:8000/api/movimiento/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(movimientoPayload),
      });

      if (!resMovimiento.ok) {
        throw new Error('Error al registrar el movimiento de inventario.');
      }

      const kardexPayload = {
        producto_kardex: selectedProducto.id,
        tipo_kardex: 'Entrada',
        cantidad_kardex: cantidadIngreso,
        costo_unitario_kardex: parseFloat(costoUnitario).toFixed(2),
        costo_total_kardex: (parseFloat(costoUnitario) * parseInt(cantidadIngreso, 10)).toFixed(2),
        saldo_cantidad_kardex: productoActualizado.cantidad_producto,
        saldo_costo_kardex: (
          productoActualizado.cantidad_producto * parseFloat(costoUnitario)
        ).toFixed(2),
        referencia_kardex: motivo,
      };

      if (fechaCaducidad) {
        const lotePayload = {
          producto_lote: selectedProducto.id,
          cantidad_lote: cantidadIngreso,
          fecha_caducidad_lote: fechaCaducidad,
        };

        const resLote = await fetch('http://127.0.0.1:8000/api/lote/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(lotePayload),
        });

        if (!resLote.ok) {
          throw new Error('Error al registrar el lote.');
        }

        const loteData = await resLote.json();
        kardexPayload.lote_kardex = loteData.id;
      }

      const resKardex = await fetch('http://127.0.0.1:8000/api/kardex/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(kardexPayload),
      });

      if (!resKardex.ok) {
        throw new Error('Error al registrar en Kardex.');
      }

      const relation = {
        producto_productoProveedor: selectedProducto.id,
        proveedor_productoProveedor: selectedProveedor,
        costo_productoProveedor: parseFloat(costoUnitario).toFixed(2),
      };

      const resRelacion = await fetch('http://127.0.0.1:8000/api/productoproveedor/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(relation),
      });

      if (!resRelacion.ok) {
        throw new Error('Error al registrar la relación producto-proveedor.');
      }

      Swal.fire('Éxito', 'Ingreso registrado correctamente.', 'success');
      setCantidadIngreso(0);
      setCostoUnitario('');
      setMotivo('');
      setFechaCaducidad('');
      setDescripcion('');
      setMarca('');
      setSelectedProveedor(null);
      setSearchProducto('');
      setSelectedProducto(null);
      fetchProductos();
    } catch (error) {
      console.error('Error al registrar ingreso:', error);
      Swal.fire('Error', 'Ocurrió un error al registrar el ingreso.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      alert('No se encontró el token de refresco. Inicia sesión nuevamente.');
      return;
    }
  
    try {
      const res = await fetch('http://127.0.0.1:8000/api/logout/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
        body: JSON.stringify({
          refresh_token: refreshToken,
        }),
      });
  
      if (res.ok) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        Swal.fire({
          title: 'Sesión cerrada',
          text: 'Has cerrado sesión exitosamente.',
          icon: 'success',
          confirmButtonColor: '#712b39',
        }).then(() => {
          router.push('/login');
        });
      } else {
        const data = await res.json();
        Swal.fire({
          title: 'Error',
          text: `Error al cerrar sesión: ${data.detail}`,
          icon: 'error',
          confirmButtonColor: '#712b39',
        });    }
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      alert('Ocurrió un error al intentar cerrar sesión.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <div className="relative">
        {/* Header */}
        <div className="flex justify-between items-center bg-[#712b39] text-white p-4 shadow-md border-b border-black relative">
        <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-xl font-bold absolute left-4"
            >
            ☰
          </button>
          <h1 className="text-2xl font-bold mx-auto">Entradas al Inventario</h1>
          </div>
  
        {/* Menú flotante */}
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
                onClick={handleLogout}
              >
                Cerrar Sesión
              </li>
            </ul>
          </div>
        )}
      </div>
  
      {/* Formulario */}
      <div className="w-full bg-white shadow-md rounded-lg p-8 mt-6">
  
        {/* Todo en una sola sección */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Producto */}
          <div className="col-span-4">
            <label className="block text-gray-700 font-bold mb-2">Seleccionar Producto</label>
            <input
              type="text"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring focus:ring-gray-200 mb-4"
              placeholder="Buscar producto..."
              value={searchProducto}
              onChange={(e) => handleSearchProducto(e.target.value)}
            />
            {filteredProductos.length > 0 && (
              <ul className="max-h-40 overflow-y-auto border rounded-lg shadow-md">
                {filteredProductos.map((producto) => (
                  <li
                    key={producto.id}
                    className={`p-3 cursor-pointer hover:bg-gray-100 ${
                      selectedProducto?.id === producto.id ? 'bg-gray-200' : ''
                    }`}
                    onClick={() => setSelectedProducto(producto)}
                  >
                    {producto.nombre_producto}
                  </li>
                ))}
              </ul>
            )}
            {selectedProducto && (
              <div className="mt-4">
                <p className="text-lg font-semibold text-gray-700">
                  Producto Seleccionado: <span className="text-gray-900">{selectedProducto.nombre_producto}</span>
                </p>
              </div>
            )}
          </div>
  
          {/* Proveedor */}
          <div className="col-span-4 lg:col-span-2">
            <label className="block text-gray-700 font-bold mb-2">Seleccionar Proveedor</label>
            <select
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring focus:ring-gray-200 mb-4"
              value={selectedProveedor || ''}
              onChange={(e) => setSelectedProveedor(e.target.value)}
            >
              <option value="">Seleccionar proveedor...</option>
              {proveedores.map((proveedor) => (
                <option key={proveedor.id} value={proveedor.id}>
                  {proveedor.nombre_proveedor}
                </option>
              ))}
            </select>
          </div>
  
          {/* Cantidad y Costo */}
          <div className="lg:col-span-1">
            <label className="block text-gray-700 font-bold mb-2">Cantidad</label>
            <input
              type="number"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring focus:ring-gray-200"
              placeholder="Cantidad a ingresar"
              value={cantidadIngreso}
              onChange={(e) => setCantidadIngreso(e.target.value)}
            />
          </div>
          <div className="lg:col-span-1">
            <label className="block text-gray-700 font-bold mb-2">Costo Unitario</label>
            <input
              type="number"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring focus:ring-gray-200"
              placeholder="Costo unitario"
              value={costoUnitario}
              onChange={(e) => setCostoUnitario(e.target.value)}
            />
          </div>
  
          {/* Motivo */}
          <div className="col-span-4">
            <label className="block text-gray-700 font-bold mb-2">Motivo del Ingreso</label>
            <textarea
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring focus:ring-gray-200"
              placeholder="Motivo del ingreso"
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
            />
          </div>
  
          {/* Fecha y Descripción */}
          <div className="lg:col-span-2">
            <label className="block text-gray-700 font-bold mb-2">Fecha de Caducidad</label>
            <input
              type="date"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring focus:ring-gray-200"
              placeholder="Fecha de caducidad (opcional)"
              value={fechaCaducidad}
              onChange={(e) => setFechaCaducidad(e.target.value)}
            />
          </div>
          <div className="lg:col-span-2">
            <label className="block text-gray-700 font-bold mb-2">Descripción</label>
            <textarea
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring focus:ring-gray-200"
              placeholder="Descripción del producto (opcional)"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
            />
          </div>
  
          {/* Marca y Método de Valoración */}
          <div className="lg:col-span-2">
            <label className="block text-gray-700 font-bold mb-2">Marca</label>
            <input
              type="text"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring focus:ring-gray-200"
              placeholder="Marca (opcional)"
              value={marca}
              onChange={(e) => setMarca(e.target.value)}
            />
          </div>
          <div className="lg:col-span-2">
            <label className="block text-gray-700 font-bold mb-2">Método de Valoración</label>
            <select
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring focus:ring-gray-200"
              value={metodoValoracion}
              onChange={(e) => setMetodoValoracion(e.target.value)}
            >
              <option value="PEPS">PEPS</option>
              <option value="UEPS">UEPS</option>
              <option value="Promedio">Promedio</option>
            </select>
          </div>
        </div>
  
        {/* Botón Registrar */}
        <div className="mt-6">
        <button
  onClick={handleIngreso}
  className={`w-full bg-[#712b39] text-white py-3 rounded-lg hover:bg-[#5e242e] ${
    isLoading ? 'opacity-50 cursor-not-allowed' : ''
  }`}
  disabled={isLoading}
>
  {isLoading ? 'Registrando...' : 'Registrar Ingreso'}
</button>

        </div>
      </div>
    </div>
  );
}  