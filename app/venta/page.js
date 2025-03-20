'use client';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { useRouter } from 'next/navigation'; // Importa useRouter

export default function VentaPage() {
  const router = useRouter(); // Define router
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
  const [metodoVenta, setMetodoVenta] = useState('Efectivo');
  const [menuOpen, setMenuOpen] = useState(false);
  const [progreso, setProgreso] = useState(1); // Inicializamos en el paso 1 al cargar la página
  
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      router.push('/login');
      return;
    }

    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }

    const handleKeyDown = (event) => {
      console.log(`Key pressed: ${event.key}, Ctrl: ${event.ctrlKey}, Alt: ${event.altKey}`);
      
      if (event.ctrlKey && event.altKey && event.key === '1') {
        event.preventDefault();
        const ciInput = document.querySelector('[name="ci_cliente"]');
        if (ciInput) {
          console.log('Focusing CI input');
          ciInput.focus();
        } else {
          console.log('CI input not found in the DOM');
        }
      } else if (event.ctrlKey && event.altKey && event.key === 'Enter') {
        event.preventDefault();
        const submitButton = document.querySelector('#submitButton');
        if (submitButton && !submitButton.disabled){
          submitButton.click();
        }
      } else if (event.ctrlKey && event.altKey && event.key === '2') {
        event.preventDefault();
        console.log('Ctrl + Alt + 3 detected, triggering handleCancel');
        handleCancel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    // Verificar si todos los campos están llenos para avanzar al paso 2
    if (
      clienteData.ci_cliente &&
      clienteData.nombre_cliente &&
      clienteData.telefono_cliente &&
      clienteData.correo_cliente &&
      clienteData.direccion_cliente
    ) {
      setProgreso(2);
    }
  }, [clienteData]);

  const handleInputChange = async (e) => {
    const { name, value } = e.target;
    setClienteData({ ...clienteData, [name]: value });
    console.log(`Updated field ${name}: ${value}`); // Verifica los datos
    if (name === 'ci_cliente' && value.length >= 10) {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/cliente/?ci_cliente=${value}`);
        if (response.ok) {
          const cliente = await response.json();
          if (cliente.length > 0 && cliente[0].ci_cliente === value) {
            setClienteData(cliente[0]);
            setClienteExistente(true);
            Swal.fire({
              title: 'Cliente encontrado',
              text: 'El cliente ha sido cargado correctamente para la venta.',
              icon: 'success',
              confirmButtonColor: '#712b39', // Cambia el color del botón al burdeos
              confirmButtonText: 'OK',
            });
                      } else {
            setClienteExistente(false);
          }
        }
      } catch (error) {
        console.error('Error al buscar el cliente:', error);
      }
    }
  };

  const total = cart.reduce((acc, item) => acc + parseFloat(item.pvp_producto) * (item.cantidad || 1), 0).toFixed(2);

  const handleSubmit = async () => {
    console.log('handleSubmit invoked');
    console.log('clienteData:', clienteData);
    if (
      !clienteData.ci_cliente ||
      clienteData.ci_cliente.length < 10 || // Validar longitud de cédula
      !clienteData.nombre_cliente ||
      !clienteData.telefono_cliente ||
      clienteData.telefono_cliente.length !== 10 || // Validar longitud de teléfono
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clienteData.correo_cliente) || // Validar formato de correo
      !clienteData.direccion_cliente
    ) {
      Swal.fire(
        'Error',
        'Por favor, complete todos los campos correctamente antes de registrar la venta.',
        'error'
      );
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
          metodo_venta: metodoVenta,
        }),
      });

      if (!ventaResponse.ok) {
        const errorDetails = await ventaResponse.json();
        console.error('Error al registrar la venta:', errorDetails);
        throw new Error(`Error al registrar la venta: ${errorDetails.message || ventaResponse.statusText}`);
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
        if (!kardexResponse.ok){
          throw new Error('Error al registrar el movimiento en el kardex')
        }

        await fetch(`http://127.0.0.1:8000/api/producto/${producto.id}/`,{
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            cantidad_producto: producto.cantidad_producto - (producto.cantidad|| 1),
          })
        })
      }

      Swal.fire({
        title: 'Éxito',
        text: 'La venta ha sido registrada correctamente.',
        icon: 'success',
        confirmButtonText: 'OK',
        confirmButtonColor: '#712b39',
      }).then((result) => {
        if (result.isConfirmed) {
          // Redirige al dashboard
          router.push('/dashboard');
        }
      });
            
      setProgreso(3); // Cambiamos al paso 3 después de registrar la venta
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

  const handleCancel = () => {
    Swal.fire({
      title: '¿Cancelar?',
      text: '¿Seguro que deseas cancelar la operación? Los datos ingresados no se borrarán automáticamente.',
      icon: 'warning',
      iconColor: '#712b39',
      showCancelButton: true,
      confirmButtonColor: '#712b39', // Mismo color del botón "Registrar Venta"
      cancelButtonColor: '#D1D5DB', // Mismo color del botón "Cancelar"
      confirmButtonText: 'Sí, cancelar',
      cancelButtonText: 'No, regresar',
      customClass: {
        cancelButton: 'custom-cancel-button',
      }
    }).then((result) => {
      if (result.isConfirmed) {
        router.push('/dashboard');
      }
    });
  };
// Estilos personalizados para el botón "No, regresar"
const style = document.createElement('style');
style.innerHTML = `
  .swal2-cancel.custom-cancel-button {
    color: black !important; /* Cambia el texto a negro */
    font-weight: bold !important; /* Texto en negrita */
  }
`;
document.head.appendChild(style);

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
        <div className="flex justify-between items-center bg-[#712b39] text-white p-4 shadow-md border-b border-black">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-xl font-bold"
          >
            ☰
          </button>
          <h1 className="text-2xl font-bold text-center flex-1">Registro de Ventas</h1>
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
                onClick={handleLogout}
              >
                Cerrar Sesión
              </li>
            </ul>
          </div>
        )}
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="mb-4">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className={`bg-[#712b39] h-2.5 rounded-full transition-all duration-300`}
              style={{ width: `${(progreso / 3) * 100}%` }}
            ></div>
          </div>
          <div className="text-sm text-gray-600 text-center mt-1">
            {progreso === 1 && 'Paso 1: Selección de productos'}
            {progreso === 2 && 'Paso 2: Datos del cliente'}
            {progreso === 3 && 'Paso 3: Confirmación de la venta'}
          </div>
        </div>
        <h2 className="text-2xl font-bold mb-4">Información del Cliente</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
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
            <label className="block font-bold">Método de venta:</label>
            <select
              value={metodoVenta}
              onChange={(e) => setMetodoVenta(e.target.value)}
              className="w-full border p-2 rounded"
            >
              <option value="Efectivo">Efectivo</option>
              <option value="Tarjeta de Crédito">Tarjeta de Crédito</option>
              <option value="Transferencia">Transferencia</option>
            </select>
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
          <div>
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
          <div className="md:col-span-2">
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
          id= "submitButton"
            onClick={handleSubmit}
            className={`mt-2 bg-[#712b39] text-white py-2 px-4 rounded-lg hover:bg-[#5e242e] transition-colors ${
              isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Registrando...' : 'Registrar Venta'}
          </button>
          <button
            onClick={handleCancel}
            className="mt-2 ml-4 bg-gray-300 text-black py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
