import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';
import { isValidCI, isValidEmail, isValidPhone, calculateCartTotal } from '../utils/ventaHelpers';

export default function useVenta() {
  const router = useRouter();
  const [cart, setCart] = useState([]);
  const [clienteData, setClienteData] = useState({
    ci_cliente: '',
    nombre_cliente: '',
    telefono_cliente: '',
    correo_cliente: '',
    direccion_cliente: '',
    informacion_cliente: '',
  });
  const [clienteExistente, setClienteExistente] = useState(false);
  const [metodoVenta, setMetodoVenta] = useState('Efectivo');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progreso, setProgreso] = useState(1);

  const usuarioVenta = 1;
  const sucursalVenta = 1;

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
  }, [router]);

  useEffect(() => {
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
    const updated = { ...clienteData, [name]: value };
    setClienteData(updated);

    if (name === 'ci_cliente' && value.length >= 10) {
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/cliente/buscar_por_ci/?ci_cliente=${value}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            'Content-Type': 'application/json',
          },
        });

        if (res.ok) {
          const resultado = await res.json();
          const cliente = resultado.find(c => c.ci_cliente.toString() === value.toString());

          if (cliente) {
            setClienteData({
              ...cliente,
              informacion_cliente: cliente.informacion_cliente || '',
            });
            setClienteExistente(true);
            Swal.fire('Cliente encontrado', 'Se han cargado los datos.', 'info');
          } else {
            setClienteExistente(false);
          }
        }
      } catch (error) {
        console.error('Error al buscar el cliente:', error);
      }
    }
  };

  const handleSubmit = async () => {
    if (
      !isValidCI(clienteData.ci_cliente) ||
      !clienteData.nombre_cliente ||
      !isValidPhone(clienteData.telefono_cliente) ||
      !isValidEmail(clienteData.correo_cliente) ||
      !clienteData.direccion_cliente
    ) {
      Swal.fire('Error', 'Complete todos los campos correctamente.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      let cliente = clienteExistente ? clienteData : await registrarCliente(clienteData);
      const total = calculateCartTotal(cart);

      const venta = await registrarVenta(cliente.id, total);
      await Promise.all(cart.map((producto) => procesarProducto(venta.id, producto)));

      Swal.fire('Éxito', 'La venta se ha registrado correctamente.', 'success').then(() => {
        router.push('/dashboard');
      });

      localStorage.removeItem('cart');
      setCart([]);
      setClienteData({
        ci_cliente: '',
        nombre_cliente: '',
        telefono_cliente: '',
        correo_cliente: '',
        direccion_cliente: '',
        informacion_cliente: '',
      });
      setClienteExistente(false);
      setProgreso(3);
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'Ocurrió un error al registrar la venta.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    Swal.fire({
      title: '¿Cancelar?',
      text: '¿Seguro que deseas cancelar la operación?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#712b39',
      cancelButtonColor: '#D1D5DB',
      confirmButtonText: 'Sí, cancelar',
      cancelButtonText: 'No, regresar',
    }).then((result) => {
      if (result.isConfirmed) router.push('/dashboard');
    });
  };

  const registrarCliente = async (data) => {
    const res = await fetch('http://127.0.0.1:8000/api/cliente/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Error al registrar el cliente');
    return await res.json();
  };

  const registrarVenta = async (clienteId, total) => {
    const res = await fetch('http://127.0.0.1:8000/api/venta/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cliente_venta: clienteId,
        usuario_venta: usuarioVenta,
        sucursal_venta: sucursalVenta,
        total_venta: total,
        estado_venta: 'F',
        metodo_venta: metodoVenta,
      }),
    });
    if (!res.ok) throw new Error('Error al registrar la venta');
    return await res.json();
  };

  const procesarProducto = async (ventaId, producto) => {
    const cantidad = producto.cantidad || 1;
  
    // ✅ Paso 1: obtener el producto actualizado desde backend
    const resProd = await fetch(`http://127.0.0.1:8000/api/producto/${producto.id}/`);
    const productoActualizado = await resProd.json();
  
    const nuevoStock = productoActualizado.cantidad_producto - cantidad;
  
    // Paso 2: Artículo de venta
    await fetch('http://127.0.0.1:8000/api/articuloventa/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        venta_articuloVenta: ventaId,
        producto_articuloVenta: producto.id,
        cantidad_articuloVenta: cantidad,
        pvp_articuloVenta: producto.pvp_producto,
        descuento_articuloVenta: 0,
      }),
    });
  
    // Paso 3: Movimiento de inventario
    await fetch('http://127.0.0.1:8000/api/movimiento/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        producto_movimientoInventario: producto.id,
        usuario_movimientoInventario: usuarioVenta,
        tipo_movimientoInventario: 'Salida',
        cantidad_movimientoInventario: cantidad,
        motivo_movimientoInventario: 'Venta realizada',
      }),
    });
  
    // ✅ Paso 4: Kardex con stock actualizado real
    const kardexRes = await fetch('http://127.0.0.1:8000/api/kardex/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        producto_kardex: producto.id,
        tipo_kardex: 'Salida',
        cantidad_kardex: cantidad,
        costo_unitario_kardex: producto.costo_producto,
        costo_total_kardex: producto.costo_producto * cantidad,
        saldo_cantidad_kardex: nuevoStock,
        saldo_costo_kardex: nuevoStock * producto.costo_producto,
        referencia_kardex: `Venta #${ventaId}`,
      }),
    });
    
    if (!kardexRes.ok) {
      const errorText = await kardexRes.text();
      console.error('❌ Error al registrar en el Kardex:', errorText);
      Swal.fire('Error', `No se pudo registrar el movimiento en el Kardex: ${errorText}`, 'error');
    }
    
  
    // Paso 5: Actualizar stock en el producto
    await fetch(`http://127.0.0.1:8000/api/producto/${producto.id}/`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cantidad_producto: nuevoStock,
      }),
    });
  };
  

  return {
    cart,
    clienteData,
    handleInputChange,
    handleSubmit,
    handleCancel,
    isSubmitting,
    metodoVenta,
    setMetodoVenta,
    progreso,
  };
}
