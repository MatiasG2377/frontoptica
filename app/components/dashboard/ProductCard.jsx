export default function ProductCard({ producto, onAddToCart, onImageClick }) {
    return (
      <div className="bg-white shadow-md p-3 rounded-lg text-center hover:shadow-lg transition-shadow">
        <h3 className="font-bold">{producto.nombre_producto}</h3>
        <p className="text-sm">{producto.categoria_nombre || 'Sin Categoría'}</p>
        <p className="text-lg">${producto.pvp_producto}</p>
        {producto.imagen_producto && (
          <img
            src={producto.imagen_producto}
            alt={producto.nombre_producto}
            className="mx-auto my-2 rounded-md cursor-pointer"
            style={{ width: '90px', height: '90px', objectFit: 'cover' }}
            onClick={() => onImageClick(producto.imagen_producto)}
          />
        )}
        <button
          onClick={() => onAddToCart(producto)}
          className="mt-1 bg-[#712b39] text-white py-1 px-3 rounded-lg hover:bg-[#5e242e] transition-colors"
        >
          Agregar
        </button>
      </div>
    );
  }
  