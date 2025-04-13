'use client';
export default function HeaderInventario({ searchTerm, setSearchTerm, onOpenModal, menuOpen, setMenuOpen, router }) {
  return (
    <div className="relative">
      <div className="flex justify-between items-center bg-[#712b39] text-white p-4 shadow-md border-b border-black">
        <button onClick={() => setMenuOpen(!menuOpen)} className="text-xl font-bold">
          ☰
        </button>
        <h1 className="text-2xl font-bold">Gestión de Productos</h1>
        <input
          type="text"
          placeholder="Buscar productos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 rounded-lg text-black bg-white w-1/3 shadow-md focus:outline-none focus:ring-2 focus:ring-[#712b39]"
        />
        <button
          onClick={onOpenModal}
          className="bg-[#F4D03F] text-black px-4 py-2 rounded-lg font-bold hover:bg-yellow-600"
        >
          Agregar Producto
        </button>
      </div>

      {menuOpen && (
        <div className="absolute top-16 left-0 bg-white shadow-lg rounded-lg w-64 z-50">
          <ul className="flex flex-col text-black">
            {[
              { path: '/inventario', label: 'Gestión de Productos' },
              { path: '/ingresos', label: 'Entradas al Inventario' },
              { path: '/registro-clientes', label: 'Registro de Clientes' },
              { path: '/visualizacion-reportes', label: 'Visualización de Reportes' },
              { path: '/dashboard', label: 'Venta' },
              { path: '/kardex', label: 'Kardex' },
              { path: '/register', label: 'Registrar usuario' },
              { path: '/login', label: 'Cerrar Sesión', logout: true }
            ].map(({ path, label, logout }) => (
              <li
                key={path}
                className="p-4 hover:bg-gray-200 cursor-pointer"
                onClick={() => {
                  if (logout) localStorage.clear();
                  router.push(path);
                }}
              >
                {label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
