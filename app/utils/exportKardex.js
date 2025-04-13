// helpers/exportKardex.js
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { utils, writeFile } from 'xlsx';

export function downloadPDF(movimientos) {
  const doc = new jsPDF();
  doc.text('Movimientos del Kardex', 20, 10);
  autoTable(doc, {
    startY: 20,
    head: [['Fecha', 'Tipo', 'Cantidad', 'Costo Unitario', 'Costo Total', 'Saldo Cantidad', 'Saldo Costo', 'Referencia']],
    body: movimientos.map((mov) => [
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
}

export function downloadExcel(movimientos) {
  const worksheet = utils.json_to_sheet(
    movimientos.map((mov) => ({
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
}
