// hooks/useKardex.js
'use client';
import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';

export default function useKardex() {
  const router = useRouter();
  const [productos, setProductos] = useState([]);
  const [filteredProductos, setFilteredProductos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [kardexMovimientos, setKardexMovimientos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchProductos = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/producto/');
        if (!response.ok) throw new Error('Error al cargar los productos');
        const data = await response.json();
        setProductos(data);
        setFilteredProductos(data);
      } catch (error) {
        console.error(error);
        Swal.fire('Error', 'No se pudo cargar el listado de productos.', 'error');
      }
    };

    fetchProductos();
  }, []);

  const handleSearch = (term) => {
    const value = term.toLowerCase();
    setSearchTerm(value);
    const filtered = productos.filter(p => p.nombre_producto.toLowerCase().includes(value));
    setFilteredProductos(filtered);
  };

  const handleSelectProducto = async (productoId) => {
    setIsLoading(true);
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/kardex/${productoId}/`);
      if (res.status === 404 || !res.ok) {
        Swal.fire('Información', 'No hay movimientos registrados para este producto.', 'info');
        setKardexMovimientos([]);
        return;
      }
      const data = await res.json();
      if (!data.length) {
        Swal.fire('Información', 'No hay movimientos registrados para este producto.', 'info');
        setKardexMovimientos([]);
        return;
      }
      setKardexMovimientos(data);
      Swal.fire('Éxito', 'Movimientos del Kardex cargados correctamente.', 'success');
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'No se pudo cargar los movimientos del Kardex.', 'error');
      setKardexMovimientos([]);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    productos,
    filteredProductos,
    searchTerm,
    kardexMovimientos,
    isLoading,
    handleSearch,
    handleSelectProducto,
  };
}
