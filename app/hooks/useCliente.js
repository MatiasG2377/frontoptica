'use client';
import { useState } from 'react';
import Swal from 'sweetalert2';

export default function useCliente() {
  const [clienteData, setClienteData] = useState({
    ci_cliente: '',
    nombre_cliente: '',
    telefono_cliente: '',
    correo_cliente: '',
    direccion_cliente: '',
    informacion_cliente: '',
  });

  const [clienteExistente, setClienteExistente] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = async (e) => {
    const { name, value } = e.target;
    const nuevoData = { ...clienteData, [name]: value };
    setClienteData(nuevoData);

    if (name === 'ci_cliente' && value.length >= 10) {
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/cliente/buscar_por_ci/?ci_cliente=${value}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
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
            Swal.fire('Cliente encontrado', 'Los datos han sido cargados para edición.', 'info');
            return;
          }
        }
        setClienteExistente(false);
      } catch (error) {
        console.error('Error al buscar cliente:', error);
      }
    }
  };

  const handleSubmit = async () => {
    const { ci_cliente, nombre_cliente, telefono_cliente, correo_cliente, direccion_cliente } = clienteData;

    if (!ci_cliente || !nombre_cliente || !telefono_cliente || !correo_cliente || !direccion_cliente) {
      Swal.fire('Error', 'Todos los campos requeridos deben estar llenos.', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      const url = clienteExistente
        ? `http://127.0.0.1:8000/api/cliente/${clienteData.id}/`
        : 'http://127.0.0.1:8000/api/cliente/';
      const method = clienteExistente ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(clienteData),
      });

      if (!res.ok) throw new Error('Error al registrar o actualizar el cliente');

      Swal.fire(
        clienteExistente ? 'Cliente actualizado' : 'Cliente registrado',
        'Los datos fueron guardados exitosamente.',
        'success'
      );

      setClienteData({
        ci_cliente: '',
        nombre_cliente: '',
        telefono_cliente: '',
        correo_cliente: '',
        direccion_cliente: '',
        informacion_cliente: '',
      });
      setClienteExistente(false);
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'No se pudo guardar el cliente.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    clienteData,
    setClienteData,
    clienteExistente,
    isSubmitting,
    handleInputChange,
    handleSubmit,
  };
}
