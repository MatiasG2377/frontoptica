export default function ClienteForm({ clienteData, handleInputChange, metodoVenta, setMetodoVenta, progreso }) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="mb-4">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-[#712b39] h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${(progreso / 3) * 100}%` }}
            ></div>
          </div>
          <div className="text-sm text-gray-600 text-center mt-1">
            {progreso === 1 && 'Paso 1: Selección de productos'}
            {progreso === 2 && 'Paso 2: Datos del cliente'}
            {progreso === 3 && 'Paso 3: Confirmación de la venta'}
          </div>
        </div>
  
        <h2 className="text-2xl font-bold mb-4">Información del Cliente</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          <div>
            <label className="block font-bold">Cédula/ID:</label>
            <input
              type="text"
              name="ci_cliente"
              value={clienteData.ci_cliente}
              onChange={handleInputChange}
              className="w-full border p-2 rounded"
              placeholder="Ingrese la cédula o identificación"
            />
          </div>
          <div>
            <label className="block font-bold">Método de venta:</label>
            <select
              value={metodoVenta}
              onChange={(e) => setMetodoVenta(e.target.value)}
              className="w-full border p-2 rounded"
            >
              <option value="Efectivo">Efectivo</option>
              <option value="Tarjeta de Crédito">Tarjeta de Crédito</option>
              <option value="Transferencia">Transferencia</option>
            </select>
          </div>
          <div>
            <label className="block font-bold">Nombre:</label>
            <input
              type="text"
              name="nombre_cliente"
              value={clienteData.nombre_cliente}
              onChange={handleInputChange}
              className="w-full border p-2 rounded"
              placeholder="Ingrese el nombre del cliente"
            />
          </div>
          <div>
            <label className="block font-bold">Teléfono:</label>
            <input
              type="text"
              name="telefono_cliente"
              value={clienteData.telefono_cliente}
              onChange={handleInputChange}
              className="w-full border p-2 rounded"
              placeholder="Ingrese el teléfono del cliente"
            />
          </div>
          <div>
            <label className="block font-bold">Correo Electrónico:</label>
            <input
              type="email"
              name="correo_cliente"
              value={clienteData.correo_cliente}
              onChange={handleInputChange}
              className="w-full border p-2 rounded"
              placeholder="Ingrese el correo del cliente"
            />
          </div>
          <div>
            <label className="block font-bold">Dirección:</label>
            <input
              type="text"
              name="direccion_cliente"
              value={clienteData.direccion_cliente}
              onChange={handleInputChange}
              className="w-full border p-2 rounded"
              placeholder="Ingrese la dirección del cliente"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block font-bold">Información Adicional:</label>
            <textarea
              name="informacion_cliente"
              value={clienteData.informacion_cliente}
              onChange={handleInputChange}
              className="w-full border p-2 rounded"
              placeholder="Ingrese información adicional"
            />
          </div>
        </div>
      </div>
    );
  }
  