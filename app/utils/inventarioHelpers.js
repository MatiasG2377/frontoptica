export function formatPrecio(numero) {
    return parseFloat(numero).toFixed(2);
  }
  
  export function esImagenValida(file) {
    const tiposPermitidos = ['image/jpeg', 'image/png'];
    return file && tiposPermitidos.includes(file.type);
  }
  
  export function validarProducto(producto) {
    const requeridos = ['nombre_producto', 'categoria_producto', 'pvp_producto', 'costo_producto', 'cantidad_producto'];
    for (const campo of requeridos) {
      if (!producto[campo]) {
        return `El campo "${campo.replace('_', ' ')}" es obligatorio.`;
      }
    }
    return null;
  }
  
  export function generarPayloadProducto(formData) {
    return {
      ...formData,
      categoria_producto: parseInt(formData.categoria_producto) || null,
      ultima_venta_producto: formData.ultima_venta_producto || null,
    };
  }
  