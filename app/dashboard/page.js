'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [selectedCategoria, setSelectedCategoria] = useState(null);
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [saleNumber, setSaleNumber] = useState(1);
  const [modalImage, setModalImage] = useState(null);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const res = await fetch('http://127.0.0.1:8000/api/categoria/');
        if (res.ok) {
          const data = await res.json();
          setCategorias(data);
        } else {
          alert('Error al cargar las categorías.');
        }
      } catch (error) {
        console.error('Error al obtener las categorías:', error);
      }
    };

    fetchCategorias();
  }, []);

  useEffect(() => {
    const fetchProductos = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        const url = selectedCategoria
          ? `http://127.0.0.1:8000/api/productos-filtrados/?categoria=${selectedCategoria}`
          : 'http://127.0.0.1:8000/api/productos-filtrados/';

        const res = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setProductos(data);
        } else {
          alert('Error al cargar los productos');
        }
      } catch (error) {
        console.error('Error al obtener los productos:', error);
        alert('Hubo un problema al cargar los productos.');
      }
    };

    fetchProductos();
  }, [selectedCategoria, router]);

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setCurrentDate(now.toLocaleDateString());
      setCurrentTime(now.toLocaleTimeString());
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  const handleAddToCart = (product) => {
    const existingProductIndex = cart.findIndex((item) => item.id === product.id);

    if (existingProductIndex >= 0) {
      // Si el producto ya está en el carrito, incrementa la cantidad
      const updatedCart = [...cart];
      updatedCart[existingProductIndex].cantidad += 1;
      setCart(updatedCart);
    } else {
      // Si no está en el carrito, agrégalo con cantidad inicial 1
      setCart([...cart, { ...product, cantidad: 1 }]);
    }

    // Guarda el carrito en localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
  };

  const handleRemoveFromCart = (index) => {
    const updatedCart = [...cart];
    updatedCart.splice(index, 1);
    setCart(updatedCart);

    // Actualiza el carrito en localStorage
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const handleFinalizeSale = () => {
    localStorage.setItem('cart', JSON.stringify(cart));
    router.push('/venta');
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
        alert('Sesión cerrada exitosamente.');
        router.push('/login');
      } else {
        const data = await res.json();
        alert(`Error al cerrar sesión: ${data.detail}`);
      }
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      alert('Ocurrió un error al intentar cerrar sesión.');
    }
  };

  const filteredProductos = productos.filter((producto) =>
    producto.nombre_producto.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="relative">
        <div className="flex justify-between items-center bg-[#712b39] text-white p-4 shadow-md border-b border-black">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-xl font-bold"
          >
            ☰
          </button>
          <h1 className="text-2xl font-bold">Óptica Dashboard</h1>
          <input
            type="text"
            placeholder="Buscar productos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-gray-200 text-black px-4 py-2 rounded-lg focus:ring-2 focus:ring-[#712b39]"
          />
        </div>

        {/* Menú flotante */}
        {menuOpen && (
          <div className="absolute top-16 left-0 bg-white shadow-lg rounded-lg w-64 z-50">
            <ul className="flex flex-col text-black">
              <li
                className="p-4 hover:bg-gray-200 cursor-pointer"
                onClick={() => router.push('/inventario')}
              >
                Gestión de Stock
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

      {/* Contenido principal */}
      <div className="flex flex-1 overflow-hidden">
        {/* Menú lateral */}
        <div
          className="w-1/5 bg-[#712b39] text-white flex flex-col items-center border-r border-black h-full"
          style={{
            minWidth: '200px',
          }}
        >
          <ul className="w-full">
            <li
              className={`p-4 cursor-pointer text-center ${
                selectedCategoria === null
                  ? 'bg-[#fcda11] text-black font-bold'
                  : 'hover:bg-[#5e242e]'
              }`}
              onClick={() => setSelectedCategoria(null)}
            >
              Todas las Categorías
            </li>
            {categorias.map((categoria) => (
              <li
                key={categoria.id}
                className={`p-4 cursor-pointer text-center ${
                  selectedCategoria === categoria.id
                    ? 'bg-[#fcda11] text-black font-bold'
                    : 'hover:bg-[#5e242e]'
                }`}
                onClick={() => setSelectedCategoria(categoria.id)}
              >
                {categoria.nombre_categoria}
              </li>
            ))}
          </ul>
        </div>

        {/* Productos */}
        <div className="flex-1 bg-gray-100 overflow-y-auto p-4">
          <h2 className="text-2xl font-bold mb-2 text-[#712b39]">Productos</h2>
          <div className="grid grid-cols-3 gap-3">
            {filteredProductos.map((producto) => (
              <div
                key={producto.id}
                className="bg-white shadow-md p-3 rounded-lg text-center hover:shadow-lg transition-shadow"
              >
                <h3 className="font-bold">{producto.nombre_producto}</h3>
                <p className="text-sm">{producto.categoria_nombre || 'Sin Categoría'}</p>
                <p className="text-lg">${producto.pvp_producto}</p>
                {producto.imagen_producto && (
                  <img
                    src={producto.imagen_producto}
                    alt={producto.nombre_producto}
                    className="mx-auto my-2 rounded-md cursor-pointer"
                    style={{ width: '90px', height: '90px', objectFit: 'cover' }}
                    onClick={() => setModalImage(producto.imagen_producto)}
                  />
                )}
                <button
                  onClick={() => handleAddToCart(producto)}
                  className="mt-1 bg-[#712b39] text-white py-1 px-3 rounded-lg hover:bg-[#5e242e] transition-colors"
                >
                  Agregar
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Resumen del pedido */}
        <div
          className="w-1/4 bg-white p-4 flex flex-col justify-between shadow-lg rounded-l-lg h-full"
          style={{ minWidth: '250px' }}
        >
          <h2 className="text-xl font-bold my-2">Carrito</h2>
          <div className="flex-1 overflow-auto bg-gray-50 p-2 rounded-md shadow-inner">
            {cart.map((item, index) => (
              <div key={index} className="flex justify-between items-center mb-2 p-2 bg-gray-100 rounded-lg">
                <div>
                  <p className="font-bold">
                    {item.nombre_producto} (x{item.cantidad})
                  </p>
                  <p className="text-sm text-gray-600">${item.pvp_producto}</p>
                </div>
                <button onClick={() => handleRemoveFromCart(index)} className="text-red-500 font-bold">
                  X
                </button>
              </div>
            ))}
          </div>
          <div>
            <h3 className="text-lg font-bold">
              Total: $
              {cart.reduce((total, item) => total + parseFloat(item.pvp_producto) * item.cantidad, 0).toFixed(2)}
            </h3>
            <button
              onClick={handleFinalizeSale}
              className="mt-2 w-full bg-[#712b39] text-white py-2 rounded-lg hover:bg-[#5e242e] transition-colors"
            >
              Finalizar venta
            </button>
          </div>
        </div>
      </div>

      {/* Modal de imagen */}
      {modalImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={() => setModalImage(null)}
        >
          <div
            className="relative bg-white p-4 rounded-lg"
            style={{
              maxWidth: '90%',
              maxHeight: '80%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
            }}
          >
            <img
              src={modalImage}
              alt="Imagen ampliada"
              className="object-contain"
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
              }}
            />
            <button
              className="absolute top-2 right-2 text-white bg-red-500 rounded-full w-8 h-8 flex items-center justify-center"
              onClick={() => setModalImage(null)}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
