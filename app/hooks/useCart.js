// hooks/useCart.js
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

export function useCart() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  const addToCart = (product) => {
    if (product.cantidad_producto <= product.minimo_producto) {
      Swal.fire({
        title: 'Stock bajo',
        text: `El producto "${product.nombre_producto}" tiene un stock bajo (${product.cantidad_producto} disponibles).`,
        icon: 'warning',
        confirmButtonColor: '#712b39',
      });
    }

    const existingProductIndex = cart.findIndex((item) => item.id === product.id);
    let newCart;

    if (existingProductIndex >= 0) {
      newCart = cart.map((item, index) =>
        index === existingProductIndex ? { ...item, cantidad: item.cantidad + 1 } : item
      );
    } else {
      newCart = [...cart, { ...product, cantidad: 1 }];
    }

    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const removeFromCart = (index) => {
    const updatedCart = [...cart];
    updatedCart.splice(index, 1);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('cart');
  };

  return { cart, addToCart, removeFromCart, clearCart };
}
