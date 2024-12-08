'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    router.push('/login'); // Redirige a la página de inicio de sesión
  }, [router]);

  return null; // No muestra contenido en la página raíz
}
