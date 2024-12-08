'use client';
import { useState, useEffect } from 'react';
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

  useEffect(() => {
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

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-[#712b39] mb-6">Registrar Ingreso de Productos</h1>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Seleccionar Producto</h2>
        <input
          type="text"
          className="w-full p-2 border rounded"
          placeholder="Buscar producto..."
          value={searchProducto}
          onChange={(e) => handleSearchProducto(e.target.value)}
        />
        {filteredProductos.length > 0 && (
          <ul className="mt-4 max-h-40 overflow-y-auto border rounded shadow-md">
            {filteredProductos.map((producto) => (
              <li
                key={producto.id}
                className={`p-2 cursor-pointer hover:bg-gray-200 ${
                  selectedProducto?.id === producto.id ? 'bg-[#712b39] text-white' : ''
                }`}
                onClick={() => setSelectedProducto(producto)}
              >
                {producto.nombre_producto}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mt-6">
        <h2 className="text-xl font-bold mb-4">Seleccionar Proveedor</h2>
        <select
          className="w-full p-2 border rounded"
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

      <div className="bg-white p-6 rounded-lg shadow-md mt-6">
        <h2 className="text-xl font-bold mb-4">Datos del Ingreso</h2>
        {selectedProducto && (
          <div className="mb-4">
            <p className="text-lg font-bold">{selectedProducto.nombre_producto}</p>
          </div>
        )}
        <input
          type="number"
          className="w-full p-2 border rounded mb-4"
          placeholder="Cantidad a ingresar"
          value={cantidadIngreso}
          onChange={(e) => setCantidadIngreso(e.target.value)}
        />
        <input
          type="number"
          className="w-full p-2 border rounded mb-4"
          placeholder="Costo unitario"
          value={costoUnitario}
          onChange={(e) => setCostoUnitario(e.target.value)}
        />
        <textarea
          className="w-full p-2 border rounded mb-4"
          placeholder="Motivo del ingreso"
          value={motivo}
          onChange={(e) => setMotivo(e.target.value)}
        />
        <input
          type="date"
          className="w-full p-2 border rounded mb-4"
          placeholder="Fecha de caducidad (opcional)"
          value={fechaCaducidad}
          onChange={(e) => setFechaCaducidad(e.target.value)}
        />
        <textarea
          className="w-full p-2 border rounded mb-4"
          placeholder="Descripción del producto (opcional)"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        />
        <input
          type="text"
          className="w-full p-2 border rounded mb-4"
          placeholder="Marca (opcional)"
          value={marca}
          onChange={(e) => setMarca(e.target.value)}
        />
        <select
          className="w-full p-2 border rounded mb-4"
          value={metodoValoracion}
          onChange={(e) => setMetodoValoracion(e.target.value)}
        >
          <option value="PEPS">PEPS</option>
          <option value="UEPS">UEPS</option>
          <option value="Promedio">Promedio</option>
        </select>
        <button
          onClick={handleIngreso}
          className="w-full bg-[#712b39] text-white py-2 px-4 rounded-lg hover:bg-[#5e242e]"
          disabled={isLoading}
        >
          {isLoading ? 'Registrando...' : 'Registrar Ingreso'}
        </button>
      </div>
    </div>
  );
}
