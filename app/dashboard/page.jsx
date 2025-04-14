'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';

import Header from '../components/common/Header';
import Sidebar from '../components/dashboard/Sidebar';
import ProductCard from '../components/dashboard/ProductCard';
import CartSummary from '../components/dashboard/CartSummary';
import ImageModal from '../components/dashboard/ImageModal';

import { useCart } from '../hooks/useCart';
import { calculateTotal } from '../utils/cartHelpers';
import { useAuth } from '../hooks/useAuth';

export default function DashboardPage() {
  const router = useRouter();
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [selectedCategoria, setSelectedCategoria] = useState(null);
  const [search, setSearch] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [modalImage, setModalImage] = useState(null);

  const { cart, addToCart, removeFromCart } = useCart();
  const { logout, accessToken } = useAuth(); // <- Aquí usamos el nuevo hook

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
      if (!accessToken) return;

      try {
        const url = selectedCategoria
          ? `http://127.0.0.1:8000/api/productos-filtrados/?categoria=${selectedCategoria}`
          : 'http://127.0.0.1:8000/api/productos-filtrados/';

        const res = await fetch(url, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
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
  }, [selectedCategoria, accessToken]);

  const handleFinalizeSale = () => {
    if (cart.length === 0) {
      Swal.fire({
        title: 'Carrito vacío',
        text: 'Agrega al menos un producto antes de finalizar la venta.',
        icon: 'warning',
        confirmButtonColor: '#712b39',
      });
      return;
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    router.push('/venta');
  };

  const filteredProductos = productos
  .filter((producto) => Number(producto.cantidad_producto) > 0)
  .filter((producto) =>
    producto.nombre_producto.toLowerCase().includes(search.toLowerCase())
  );


  return (
    <div className="flex flex-col h-screen">
      <Header
        title="Ventas"
        search={search}
        setSearch={setSearch}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        handleLogout={logout} // <- directamente usamos logout del hook
      />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          categorias={categorias}
          selectedCategoria={selectedCategoria}
          setSelectedCategoria={setSelectedCategoria}
        />

        <div className="flex-1 bg-gray-100 overflow-y-auto p-4">
          <h2 className="text-2xl font-bold mb-2 text-[#712b39]">Productos</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredProductos.map((producto) => (
              <ProductCard
                key={producto.id}
                producto={producto}
                onAddToCart={addToCart}
                onImageClick={setModalImage}
              />
            ))}
          </div>
        </div>

        <CartSummary
          cart={cart}
          onRemove={removeFromCart}
          onFinalize={handleFinalizeSale}
          total={calculateTotal(cart)}
        />
      </div>

      {modalImage && (
        <ImageModal image={modalImage} onClose={() => setModalImage(null)} />
      )}
    </div>
  );
}
