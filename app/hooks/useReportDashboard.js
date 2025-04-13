'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export function useReportDashboard() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [productos, setProductos] = useState([]);
  const [selectedProducto, setSelectedProducto] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/productos/');
        setProductos(response.data);
        if (response.data.length > 0) {
          setSelectedProducto(response.data[0].id);
        }
      } catch (error) {
        console.error('Error al cargar los productos:', error);
      }
    };
    fetchProductos();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userId');
    router.push('/login');
  };

  return {
    menuOpen,
    setMenuOpen,
    productos,
    selectedProducto,
    setSelectedProducto,
    handleLogout,
    router
  };
}
