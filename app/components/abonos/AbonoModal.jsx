// components/abonos/AbonoModal.jsx
export default function AbonoModal({ abono, loading, onClose, onSave, onChange }) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
        <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-lg space-y-4">
          <h2 className="text-xl font-semibold text-[#712b39]">
            Editar Abono de {abono.cliente?.nombre_cliente || "cliente"}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Monto</label>
              <input
                type="number"
                value={abono.monto}
                onChange={(e) => onChange("monto", e.target.value)}
                className="w-full p-2 border rounded-md"
                disabled={loading}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Método de Pago</label>
              <input
                type="text"
                value={abono.metodo_pago}
                onChange={(e) => onChange("metodo_pago", e.target.value)}
                className="w-full p-2 border rounded-md"
                disabled={loading}
              />
            </div>
          </div>
          <div className="flex justify-end gap-4">
            <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100" disabled={loading}>
              Cancelar
            </button>
            <button onClick={onSave} className="px-4 py-2 bg-[#712b39] text-white rounded-md hover:bg-[#5e2131] disabled:bg-gray-400" disabled={loading}>
              {loading ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </div>
      </div>
    );
  }
  