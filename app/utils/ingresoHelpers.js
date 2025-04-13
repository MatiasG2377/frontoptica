export function isPositiveNumber(value) {
    return /^\d+(\.\d{1,2})?$/.test(value) && parseFloat(value) > 0;
  }
  
  export function formatearMoneda(numero) {
    return parseFloat(numero).toFixed(2);
  }
  