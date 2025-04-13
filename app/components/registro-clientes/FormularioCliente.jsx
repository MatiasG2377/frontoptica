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
          {['ci_cliente', 'nombre_cliente', 'telefono_cliente', 'correo_cliente', 'direccion_cliente'].map((field) => (
            <div key={field}>
              <label className="block font-bold capitalize">{field.replace('_', ' ')}:</label>
              <input
                type={field === 'correo_cliente' ? 'email' : 'text'}
                name={field}
                value={clienteData[field]}
                onChange={handleInputChange}
                className="w-full border p-2 rounded"
                placeholder={`Ingrese ${field.replace('_', ' ')}`}
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
              ? clienteExistente ? 'Actualizando...' : 'Registrando...'
              : clienteExistente ? 'Actualizar Cliente' : 'Registrar Cliente'}
          </button>
        </div>
      </div>
    );
  }
  