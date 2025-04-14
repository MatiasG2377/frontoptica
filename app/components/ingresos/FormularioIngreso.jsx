export default function FormularioIngreso({
  filteredProductos,
  proveedores,
  selectedProveedor,
  setSelectedProveedor,
  searchProducto,
  selectedProducto,
  setSelectedProducto,
  cantidadIngreso,
  setCantidadIngreso,
  costoUnitario,
  setCostoUnitario,
  motivo,
  setMotivo,
  fechaCaducidad,
  setFechaCaducidad,
  descripcion,
  setDescripcion,
  marca,
  setMarca,
  metodoValoracion,
  setMetodoValoracion,
  isLoading,
  handleSearchProducto,
  handleIngreso,
}) {
  return (
    <div className="w-full bg-white shadow-md rounded-lg p-6 sm:p-8 mt-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Buscar y seleccionar producto */}
        <div className="col-span-1 sm:col-span-2 lg:col-span-4">
          <label className="block text-gray-700 font-bold mb-2">Seleccionar Producto</label>
          <input
            type="text"
            className="w-full p-3 border rounded-lg mb-4"
            placeholder="Buscar producto..."
            value={searchProducto}
            onChange={(e) => handleSearchProducto(e.target.value)}
          />
          {filteredProductos.length > 0 && (
            <ul className="max-h-40 overflow-y-auto border rounded-lg shadow-md">
              {filteredProductos.map((producto) => (
                <li
                  key={producto.id}
                  className={`p-3 cursor-pointer hover:bg-gray-100 ${
                    selectedProducto?.id === producto.id ? 'bg-gray-200' : ''
                  }`}
                  onClick={() => setSelectedProducto(producto)}
                >
                  {producto.nombre_producto}
                </li>
              ))}
            </ul>
          )}
          {selectedProducto && (
            <div className="mt-4">
              <p className="text-lg font-semibold text-gray-700">
                Producto Seleccionado:{' '}
                <span className="text-gray-900">{selectedProducto.nombre_producto}</span>
              </p>
            </div>
          )}
        </div>

        {/* Proveedor */}
        <div className="col-span-1 sm:col-span-2 lg:col-span-2">
          <label className="block text-gray-700 font-bold mb-2">Seleccionar Proveedor</label>
          <select
            className="w-full p-3 border rounded-lg mb-4"
            value={selectedProveedor || ''}
            onChange={(e) => setSelectedProveedor(e.target.value)}
          >
            <option value="">Seleccionar proveedor...</option>
            {proveedores.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nombre_proveedor}
              </option>
            ))}
          </select>
        </div>

        {/* Cantidad y Costo */}
        <div className="col-span-1">
          <label className="block text-gray-700 font-bold mb-2">Cantidad</label>
          <input
            type="number"
            className="w-full p-3 border rounded-lg"
            placeholder="Cantidad a ingresar"
            value={cantidadIngreso}
            onChange={(e) => setCantidadIngreso(e.target.value)}
          />
        </div>
        <div className="col-span-1">
          <label className="block text-gray-700 font-bold mb-2">Costo Unitario</label>
          <input
            type="number"
            className="w-full p-3 border rounded-lg"
            placeholder="Costo unitario"
            value={costoUnitario}
            onChange={(e) => setCostoUnitario(e.target.value)}
          />
        </div>

        {/* Motivo */}
        <div className="col-span-1 sm:col-span-2 lg:col-span-4">
          <label className="block text-gray-700 font-bold mb-2">Motivo del Ingreso</label>
          <textarea
            className="w-full p-3 border rounded-lg"
            placeholder="Motivo del ingreso"
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
          />
        </div>

        {/* Fecha de Caducidad y Descripción */}
        <div className="col-span-1 sm:col-span-2 lg:col-span-2">
          <label className="block text-gray-700 font-bold mb-2">Fecha de Caducidad</label>
          <input
            type="date"
            className="w-full p-3 border rounded-lg"
            value={fechaCaducidad}
            onChange={(e) => setFechaCaducidad(e.target.value)}
          />
        </div>
        <div className="col-span-1 sm:col-span-2 lg:col-span-2">
          <label className="block text-gray-700 font-bold mb-2">Descripción</label>
          <textarea
            className="w-full p-3 border rounded-lg"
            placeholder="Descripción del producto (opcional)"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
          />
        </div>

        {/* Marca y Valoración */}
        <div className="col-span-1 sm:col-span-2 lg:col-span-2">
          <label className="block text-gray-700 font-bold mb-2">Marca</label>
          <input
            type="text"
            className="w-full p-3 border rounded-lg"
            placeholder="Marca (opcional)"
            value={marca}
            onChange={(e) => setMarca(e.target.value)}
          />
        </div>
        <div className="col-span-1 sm:col-span-2 lg:col-span-2">
          <label className="block text-gray-700 font-bold mb-2">Método de Valoración</label>
          <select
            className="w-full p-3 border rounded-lg"
            value={metodoValoracion}
            onChange={(e) => setMetodoValoracion(e.target.value)}
          >
            <option value="PEPS">PEPS</option>
            <option value="UEPS">UEPS</option>
            <option value="Promedio">Promedio</option>
          </select>
        </div>
      </div>

      {/* Botón */}
      <div className="mt-6">
        <button
          onClick={handleIngreso}
          className={`w-full bg-[#712b39] text-white py-3 rounded-lg hover:bg-[#5e242e] ${
            isLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={isLoading}
        >
          {isLoading ? 'Registrando...' : 'Registrar Ingreso'}
        </button>
      </div>
    </div>
  );
}
