import { calculateCartTotal } from '../../utils/ventaHelpers';

export default function CartResumenVenta({ cart, isSubmitting, handleSubmit, handleCancel }) {
  const total = calculateCartTotal(cart);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Productos Seleccionados</h2>
      <ul className="divide-y divide-gray-200">
        {cart.map((item, index) => (
          <li key={index} className="py-2 flex justify-between items-center">
            <span className="font-bold">
              {item.nombre_producto} (x{item.cantidad || 1})
            </span>
            <span>${(item.pvp_producto * (item.cantidad || 1)).toFixed(2)}</span>
          </li>
        ))}
      </ul>
      <div className="mt-4 text-right">
        <h3 className="text-xl font-bold">Total: ${total}</h3>
        <button
          id="submitButton"
          onClick={handleSubmit}
          className={`mt-2 bg-[#712b39] text-white py-2 px-4 rounded-lg hover:bg-[#5e242e] transition-colors ${
            isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Registrando...' : 'Registrar Venta'}
        </button>
        <button
          onClick={handleCancel}
          className="mt-2 ml-4 bg-gray-300 text-black py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
