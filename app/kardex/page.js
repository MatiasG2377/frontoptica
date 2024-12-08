'use client';
import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf'; // Para PDF
import autoTable from 'jspdf-autotable'; // Para generar tablas en PDF
import { utils, writeFile } from 'xlsx'; // Para Excel
import { FaDownload } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

export default function KardexPage() {
  const [productos, setProductos] = useState([]);
  const [filteredProductos, setFilteredProductos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [kardexMovimientos, setKardexMovimientos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado del modal
  const router = useRouter(); // Para la navegación

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/producto/');
        if (!response.ok) {
          throw new Error('Error al cargar los productos');
        }
        const data = await response.json();
        setProductos(data);
        setFilteredProductos(data);
      } catch (error) {
        console.error(error);
        Swal.fire('Error', 'No se pudo cargar el listado de productos.', 'error');
      }
    };

    fetchProductos();
  }, []);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = productos.filter((producto) =>
      producto.nombre_producto.toLowerCase().includes(term)
    );
    setFilteredProductos(filtered);
  };

  const handleSelectProducto = async (productoId) => {
    setIsLoading(true);
  
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/kardex/${productoId}/`);
      
      // Verificamos si la respuesta es 404 o si no hay datos
      if (response.status === 404) {
        Swal.fire(
          'Información',
          'No hay movimientos registrados en el Kardex para este producto.',
          'info'
        );
        setKardexMovimientos([]); // Aseguramos que la tabla esté vacía
        return;
      }
  
      if (!response.ok) {
        throw new Error('Error al cargar los movimientos del Kardex');
      }
  
      const data = await response.json();
      
      // Si la API devuelve una lista vacía
      if (data.length === 0) {
        Swal.fire(
          'Información',
          'No hay movimientos registrados en el Kardex para este producto.',
          'info'
        );
        setKardexMovimientos([]); // Aseguramos que la tabla esté vacía
        return;
      }
  
      setKardexMovimientos(data);
      Swal.fire('Éxito', 'Movimientos del Kardex cargados correctamente.', 'success');
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'No se pudo cargar los movimientos del Kardex.', 'error');
      setKardexMovimientos([]); // Limpiamos los movimientos para evitar datos inconsistentes
    } finally {
      setIsLoading(false);
    }
  };
  

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text('Movimientos del Kardex', 20, 10);
    autoTable(doc, {
      startY: 20,
      head: [
        ['Fecha', 'Tipo', 'Cantidad', 'Costo Unitario', 'Costo Total', 'Saldo Cantidad', 'Saldo Costo', 'Referencia'],
      ],
      body: kardexMovimientos.map((mov) => [
        new Date(mov.fecha_kardex).toLocaleString(),
        mov.tipo_kardex,
        mov.cantidad_kardex,
        `$${parseFloat(mov.costo_unitario_kardex || 0).toFixed(2)}`,
        `$${parseFloat(mov.costo_total_kardex || 0).toFixed(2)}`,
        mov.saldo_cantidad_kardex,
        `$${parseFloat(mov.saldo_costo_kardex || 0).toFixed(2)}`,
        mov.referencia_kardex,
      ]),
    });
    doc.save('Kardex.pdf');
  };

  const downloadExcel = () => {
    const worksheet = utils.json_to_sheet(
      kardexMovimientos.map((mov) => ({
        Fecha: new Date(mov.fecha_kardex).toLocaleString(),
        Tipo: mov.tipo_kardex,
        Cantidad: mov.cantidad_kardex,
        'Costo Unitario': `$${parseFloat(mov.costo_unitario_kardex || 0).toFixed(2)}`,
        'Costo Total': `$${parseFloat(mov.costo_total_kardex || 0).toFixed(2)}`,
        'Saldo Cantidad': mov.saldo_cantidad_kardex,
        'Saldo Costo': `$${parseFloat(mov.saldo_costo_kardex || 0).toFixed(2)}`,
        Referencia: mov.referencia_kardex,
      }))
    );
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, 'Kardex');
    writeFile(workbook, 'Kardex.xlsx');
  };

  const downloadBoth = () => {
    downloadPDF();
    downloadExcel();
  };

  const handleLogout = () => {
    Swal.fire('Sesión Cerrada', 'Has salido correctamente.', 'info').then(() => {
      router.push('/login');
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <div className="relative">
        <div className="flex justify-between items-center bg-[#712b39] text-white p-4 shadow-md border-b border-black">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-xl font-bold"
          >
            ☰
          </button>
          <h1 className="text-2xl font-bold">Óptica Dashboard</h1>
        </div>

        {/* Menú flotante */}
        {menuOpen && (
          <div className="absolute top-16 left-0 bg-white shadow-lg rounded-lg w-64 z-50">
            <ul className="flex flex-col text-black">
              <li
                className="p-4 hover:bg-gray-200 cursor-pointer"
                onClick={() => router.push('/inventario')}
              >
                Gestión de Stock
              </li>
              <li
                className="p-4 hover:bg-gray-200 cursor-pointer"
                onClick={() => router.push('/ingresos')}
              >
                Entradas al Inventario
              </li>
              <li
                className="p-4 hover:bg-gray-200 cursor-pointer"
                onClick={() => router.push('/visualizacion-reportes')}
              >
                Visualización de Reportes
              </li>
              <li
                className="p-4 hover:bg-gray-200 cursor-pointer"
                onClick={() => router.push('/dashboard')}
              >
                Venta
              </li>
              <li
                className="p-4 hover:bg-gray-200 cursor-pointer"
                onClick={() => router.push('/kardex')}
              >
                Kardex
              </li>
              <li
                className="p-4 hover:bg-gray-200 cursor-pointer"
                onClick={handleLogout}
              >
                Cerrar Sesión
              </li>
            </ul>
          </div>
        )}
      </div>

      <div className="flex-1 flex flex-col p-6">
        <h1 className="text-3xl font-bold text-[#712b39] mb-6">Gestión de Kardex</h1>
        <div className="bg-white p-4 rounded-lg shadow-md mb-6 flex-1">
          <h2 className="text-2xl font-bold mb-4">Buscar Producto</h2>
          <input
            type="text"
            className="w-full p-2 border rounded"
            placeholder="Escribe el nombre del producto..."
            value={searchTerm}
            onChange={handleSearch}
          />
          {filteredProductos.length > 0 ? (
            <ul className="mt-4 max-h-40 overflow-y-auto border rounded shadow-md">
              {filteredProductos.map((producto) => (
                <li
                  key={producto.id}
                  className="p-2 cursor-pointer hover:bg-gray-200"
                  onClick={() => handleSelectProducto(producto.id)}
                >
                  {producto.nombre_producto}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-gray-500">No se encontraron productos.</p>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md flex-1">
          <h2 className="text-2xl font-bold mb-4">Movimientos del Kardex</h2>
          <div className="mb-4">
            <FaDownload
              className="text-2xl cursor-pointer text-[#712b39]"
              onClick={() => setIsModalOpen(true)}
            />
          </div>

          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-96">
                <h2 className="text-lg font-bold mb-4">Descargar Kardex</h2>
                <div className="flex flex-col gap-4">
                  <button
                    className="bg-[#f5a623] text-white py-2 px-4 rounded-lg hover:bg-[#f3b853]"
                    onClick={() => {
                      downloadPDF();
                      setIsModalOpen(false);
                    }}
                  >
                    Descargar PDF
                  </button>
                  <button
                    className="bg-[#34c759] text-white py-2 px-4 rounded-lg hover:bg-[#5adb78]"
                    onClick={() => {
                      downloadExcel();
                      setIsModalOpen(false);
                    }}
                  >
                    Descargar Excel
                  </button>
                  <button
                    className="bg-[#007aff] text-white py-2 px-4 rounded-lg hover:bg-[#3394ff]"
                    onClick={() => {
                      downloadBoth();
                      setIsModalOpen(false);
                    }}
                  >
                    Descargar Ambos
                  </button>
                </div>
                <button
                  className="mt-4 text-gray-500 hover:text-gray-700"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}

          {isLoading ? (
            <p className="text-gray-500">Cargando movimientos...</p>
          ) : kardexMovimientos.length > 0 ? (
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 p-2">Fecha</th>
                  <th className="border border-gray-300 p-2">Tipo</th>
                  <th className="border border-gray-300 p-2">Cantidad</th>
                  <th className="border border-gray-300 p-2">Costo Unitario</th>
                  <th className="border border-gray-300 p-2">Costo Total</th>
                  <th className="border border-gray-300 p-2">Saldo Cantidad</th>
                  <th className="border border-gray-300 p-2">Saldo Costo</th>
                  <th className="border border-gray-300 p-2">Referencia</th>
                </tr>
              </thead>
              <tbody>
                {kardexMovimientos.map((movimiento) => (
                  <tr key={movimiento.id}>
                    <td className="border border-gray-300 p-2">
                      {new Date(movimiento.fecha_kardex).toLocaleString()}
                    </td>
                    <td className="border border-gray-300 p-2">{movimiento.tipo_kardex}</td>
                    <td className="border border-gray-300 p-2">{movimiento.cantidad_kardex}</td>
                    <td className="border border-gray-300 p-2">
                      ${parseFloat(movimiento.costo_unitario_kardex || 0).toFixed(2)}
                    </td>
                    <td className="border border-gray-300 p-2">
                      ${parseFloat(movimiento.costo_total_kardex || 0).toFixed(2)}
                    </td>
                    <td className="border border-gray-300 p-2">{movimiento.saldo_cantidad_kardex}</td>
                    <td className="border border-gray-300 p-2">
                      ${parseFloat(movimiento.saldo_costo_kardex || 0).toFixed(2)}
                    </td>
                    <td className="border border-gray-300 p-2">{movimiento.referencia_kardex}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-500">No hay movimientos registrados para este producto.</p>
          )}
        </div>
      </div>
    </div>
  );
}
