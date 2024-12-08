'use client';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import '@fortawesome/fontawesome-free/css/all.min.css';

export default function VentaPage() {
  const [cart, setCart] = useState([]); // Productos seleccionados
  const [clienteData, setClienteData] = useState({
    ci_cliente: '',
    nombre_cliente: '',
    telefono_cliente: '',
    correo_cliente: '',
    direccion_cliente: '',
    informacion_cliente: '',
  }); // Información del cliente
  const [isSubmitting, setIsSubmitting] = useState(false); // Estado para manejar envíos
  const [usuarioVenta] = useState(1); // ID del usuario que realiza la venta
  const [sucursalVenta] = useState(1); // ID de la sucursal (puedes personalizar)
  const [clienteExistente, setClienteExistente] = useState(false); // Indica si el cliente ya está registrado

  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  const handleInputChange = async (e) => {
    const { name, value } = e.target;
    setClienteData({ ...clienteData, [name]: value });

    if (name === 'ci_cliente' && value.length >= 10) {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/cliente/?ci_cliente=${value}`);
        if (response.ok) {
          const cliente = await response.json();
          if (cliente.length > 0) {
            setClienteData(cliente[0]);
            setClienteExistente(true);
            Swal.fire('Cliente encontrado', 'El cliente ha sido cargado correctamente para la venta.', 'success');
          } else {
            setClienteExistente(false);
          }
        }
      } catch (error) {
        console.error('Error al buscar el cliente:', error);
      }
    }
  };

  const total = cart
    .reduce((acc, item) => acc + parseFloat(item.pvp_producto) * (item.cantidad || 1), 0)
    .toFixed(2);

  const handleSubmit = async () => {
    if (!clienteData.ci_cliente || !clienteData.nombre_cliente) {
      Swal.fire('Error', 'Por favor, complete al menos el Cédula/ID y Nombre del cliente.', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      let cliente = null;

      if (!clienteExistente) {
        const clienteResponse = await fetch('http://127.0.0.1:8000/api/cliente/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(clienteData),
        });

        if (!clienteResponse.ok) {
          throw new Error('Error al registrar el cliente');
        }

        cliente = await clienteResponse.json();
      } else {
        cliente = clienteData;
      }

      console.log('Cliente procesado:', cliente);

      const ventaResponse = await fetch('http://127.0.0.1:8000/api/venta/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cliente_venta: cliente.id,
          usuario_venta: usuarioVenta,
          sucursal_venta: sucursalVenta,
          total_venta: total,
          estado_venta: 'F',
        }),
      });

      if (!ventaResponse.ok) {
        throw new Error('Error al registrar la venta');
      }

      const venta = await ventaResponse.json();
      console.log('Venta creada:', venta);

      for (const producto of cart) {
        const articuloResponse = await fetch('http://127.0.0.1:8000/api/articuloventa/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            venta_articuloVenta: venta.id,
            producto_articuloVenta: producto.id,
            cantidad_articuloVenta: producto.cantidad || 1,
            pvp_articuloVenta: producto.pvp_producto,
            descuento_articuloVenta: 0,
          }),
        });

        if (!articuloResponse.ok) {
          throw new Error('Error al registrar un artículo de venta');
        }

        const movimientoResponse = await fetch('http://127.0.0.1:8000/api/movimiento/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            producto_movimientoInventario: producto.id,
            usuario_movimientoInventario: usuarioVenta,
            tipo_movimientoInventario: 'Salida',
            cantidad_movimientoInventario: producto.cantidad || 1,
            motivo_movimientoInventario: 'Venta realizada',
          }),
        });

        if (!movimientoResponse.ok) {
          Swal.fire('Información', 'No hay movimientos para este producto.', 'info');
          continue;
        }

        const kardexResponse = await fetch('http://127.0.0.1:8000/api/kardex/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            producto_kardex: producto.id,
            tipo_kardex: 'Salida',
            cantidad_kardex: producto.cantidad || 1,
            costo_unitario_kardex: producto.costo_producto,
            costo_total_kardex: producto.costo_producto * (producto.cantidad || 1),
            saldo_cantidad_kardex: producto.cantidad_producto - (producto.cantidad || 1),
            saldo_costo_kardex:
              (producto.cantidad_producto - (producto.cantidad || 1)) * producto.costo_producto,
            referencia_kardex: `Venta #${venta.id}`,
          }),
        });

        if (kardexResponse.status === 404) {
          console.warn('No hay movimientos registrados en el Kardex para este producto.');
        } else if (!kardexResponse.ok) {
          throw new Error('Error al registrar el movimiento en el Kardex');
        }
      }

      Swal.fire('Éxito', 'La venta ha sido registrada correctamente.', 'success');
      localStorage.removeItem('cart');
      setClienteData({
        ci_cliente: '',
        nombre_cliente: '',
        telefono_cliente: '',
        correo_cliente: '',
        direccion_cliente: '',
        informacion_cliente: '',
      });
      setCart([]);
      setClienteExistente(false);
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'Ocurrió un error al registrar la venta. Intente nuevamente.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-[#712b39] mb-6">Registrar Venta</h1>

      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-2xl font-bold mb-4">Información del Cliente</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-bold">Cédula/ID:</label>
            <input
              type="text"
              name="ci_cliente"
              value={clienteData.ci_cliente}
              onChange={handleInputChange}
              className="w-full border p-2 rounded"
              placeholder="Ingrese la cédula o identificación"
            />
          </div>
          <div>
            <label className="block font-bold">Nombre:</label>
            <input
              type="text"
              name="nombre_cliente"
              value={clienteData.nombre_cliente}
              onChange={handleInputChange}
              className="w-full border p-2 rounded"
              placeholder="Ingrese el nombre del cliente"
            />
          </div>
          <div>
            <label className="block font-bold">Teléfono:</label>
            <input
              type="text"
              name="telefono_cliente"
              value={clienteData.telefono_cliente}
              onChange={handleInputChange}
              className="w-full border p-2 rounded"
              placeholder="Ingrese el teléfono del cliente"
            />
          </div>
          <div>
            <label className="block font-bold">Correo Electrónico:</label>
            <input
              type="email"
              name="correo_cliente"
              value={clienteData.correo_cliente}
              onChange={handleInputChange}
              className="w-full border p-2 rounded"
              placeholder="Ingrese el correo del cliente"
            />
          </div>
          <div className="col-span-2">
            <label className="block font-bold">Dirección:</label>
            <input
              type="text"
              name="direccion_cliente"
              value={clienteData.direccion_cliente}
              onChange={handleInputChange}
              className="w-full border p-2 rounded"
              placeholder="Ingrese la dirección del cliente"
            />
          </div>
          <div className="col-span-2">
            <label className="block font-bold">Información Adicional:</label>
            <textarea
              name="informacion_cliente"
              value={clienteData.informacion_cliente}
              onChange={handleInputChange}
              className="w-full border p-2 rounded"
              placeholder="Ingrese información adicional"
            />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Productos Seleccionados</h2>
        <ul className="divide-y divide-gray-200">
          {cart.map((item, index) => (
            <li key={index} className="py-2 flex justify-between items-center">
              <span className="font-bold">
                {item.nombre_producto} (x{item.cantidad || 1})
              </span>
              <span>${(item.pvp_producto * (item.cantidad || 1)).toFixed(2)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 text-right">
          <h3 className="text-xl font-bold">Total: ${total}</h3>
          <button
            onClick={handleSubmit}
            className={`mt-2 bg-[#712b39] text-white py-2 px-4 rounded-lg hover:bg-[#5e242e] transition-colors ${
              isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Registrando...' : 'Registrar Venta'}
          </button>
        </div>
      </div>
    </div>
  );
}
