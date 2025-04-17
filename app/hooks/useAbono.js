// hooks/useAbono.js
import { useState } from 'react';

export default function useAbono() {
  const [abonoInicial, setAbonoInicial] = useState(false);
  const [montoAbono, setMontoAbono] = useState('');
  const [metodoAbono, setMetodoAbono] = useState('Efectivo');

  return {
    abonoInicial,
    setAbonoInicial,
    montoAbono,
    setMontoAbono,
    metodoAbono,
    setMetodoAbono,
  };
}
