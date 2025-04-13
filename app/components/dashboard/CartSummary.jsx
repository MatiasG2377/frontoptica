export default function CartSummary({ cart, onRemove, onFinalize }) {
    const total = cart.reduce((total, item) => total + parseFloat(item.pvp_producto) * item.cantidad, 0).toFixed(2);
  
    return (
      <div className="w-1/4 bg-white p-4 flex flex-col justify-between shadow-lg rounded-l-lg h-full" style={{ minWidth: '250px' }}>
        <h2 className="text-xl font-bold my-2">Carrito</h2>
        <div className="flex-1 overflow-auto bg-gray-50 p-2 rounded-md shadow-inner">
          {cart.map((item, index) => (
            <div key={index} className="flex justify-between items-center mb-2 p-2 bg-gray-100 rounded-lg">
              <div>
                <p className="font-bold">{item.nombre_producto} (x{item.cantidad})</p>
                <p className="text-sm text-gray-600">${item.pvp_producto}</p>
              </div>
              <button onClick={() => onRemove(index)} className="text-red-500 font-bold">X</button>
            </div>
          ))}
        </div>
        <div>
          <h3 className="text-lg font-bold">Total: ${total}</h3>
          <button
            onClick={onFinalize}
            className="mt-2 w-full bg-[#712b39] text-white py-2 rounded-lg hover:bg-[#5e242e] transition-colors"
          >
            Finalizar venta
          </button>
        </div>
      </div>
    );
  }
  