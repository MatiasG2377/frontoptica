/**
 * Componente que renderiza un formulario para registrar o actualizar un cliente.
 *
 * Este formulario contiene inputs para los siguientes campos:
 * - `ci_cliente`: Cédula o identificación del cliente.
 * - `nombre_cliente`: Nombre del cliente.
 * - `telefono_cliente`: Teléfono del cliente.
 * - `correo_cliente`: Correo electrónico del cliente.
 * - `direccion_cliente`: Dirección del cliente.
 * - `informacion_cliente`: Información adicional del cliente.
 *
 * El formulario también contiene un botón para registrar o actualizar el cliente.
 * Si el cliente ya existe, el botón mostrará "Actualizar Cliente" y se
 * deshabilitará mientras se esté procesando el formulario.
 * Si el cliente no existe, el botón mostrará "Registrar Cliente" y se
 * deshabilitará mientras se esté procesando el formulario.
 *
 *? @param {Object} props - Las props del componente.
 *? @param {Object} props.clienteData - Los datos actuales del cliente.
 *? @param {Function} props.handleInputChange - Función para actualizar los datos
 *?   del cliente.
 *? @param {Function} props.handleSubmit - Función para registrar o actualizar el
 *?   cliente.
 *? @param {boolean} props.isSubmitting - Indica si el formulario se está
 *?   procesando.
 *? @param {boolean} props.clienteExistente - Indica si el cliente ya existe.
 *? @returns {ReactElement} El formulario para registrar o actualizar un cliente.
 */
export default function FormularioCliente({
  clienteData,
  handleInputChange,
  handleSubmit,
  isSubmitting,
  clienteExistente,
}) {
  return (
    <div className="bg-white p-6 m-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Información del Cliente</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
        {[
          "ci_cliente",
          "nombre_cliente",
          "telefono_cliente",
          "correo_cliente",
          "direccion_cliente",
        ].map((field) => (
          <div key={field}>
            <label className="block font-bold capitalize">
              {field.replace("_", " ")}:
            </label>
            <input
              type={field === "correo_cliente" ? "email" : "text"}
              name={field}
              value={clienteData[field]}
              onChange={handleInputChange}
              className="w-full border p-2 rounded"
              placeholder={`Ingrese ${field.replace("_", " ")}`}
            />
          </div>
        ))}
        <div className="md:col-span-2">
          <label className="block font-bold">Información Adicional:</label>
          <textarea
            name="informacion_cliente"
            value={clienteData.informacion_cliente}
            onChange={handleInputChange}
            className="w-full border p-2 rounded"
            placeholder="Notas u observaciones"
          />
        </div>
      </div>
      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="bg-[#712b39] text-white py-2 px-4 rounded-lg hover:bg-[#5e242e] transition-colors"
        >
          {isSubmitting
            ? clienteExistente
              ? "Actualizando..."
              : "Registrando..."
            : clienteExistente
            ? "Actualizar Cliente"
            : "Registrar Cliente"}
        </button>
      </div>
    </div>
  );
}
