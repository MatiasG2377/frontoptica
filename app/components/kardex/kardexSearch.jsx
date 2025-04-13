export default function KardexSearch({ searchTerm, onSearch, productos, onSelect }) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-2xl font-bold mb-4">Buscar Producto</h2>
        <div className="relative w-full">
          <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="black" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 19a8 8 0 100-16 8 8 0 000 16z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35" />
            </svg>
          </span>
          <input
            type="text"
            className="w-full p-3 pl-10 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#712b39]"
            placeholder="Escribe el nombre del producto..."
            value={searchTerm}
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
        {productos.length > 0 && (
          <ul className="mt-4 max-h-40 overflow-y-auto border rounded shadow-md">
            {productos.map((producto) => (
              <li
                key={producto.id}
                className="p-2 cursor-pointer hover:bg-gray-200"
                onClick={() => onSelect(producto.id)}
              >
                {producto.nombre_producto}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }
  