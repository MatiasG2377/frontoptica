'use client';

import React from 'react';
import { Grid } from '@mui/material';
import { useReportDashboard } from '../hooks/useReportDashboard';
import Header from '../components/common/Header2';

import ProductosBajoStock from '../components/visualizacion-reportes/charts/ProductosBajoStock';
import VentasPorMes from '../components/visualizacion-reportes/charts/VentasPorMes';
import VentasPorSucursal from '../components/visualizacion-reportes/charts/VentasPorSucursal';
import IngresosPorSucursal from '../components/visualizacion-reportes/charts/IngresosSucursal';
import TopProductosVendidos from '../components/visualizacion-reportes/charts/TopProductosVendidos';
import MovimientosInventarioPorMes from '../components/visualizacion-reportes/charts/MovimientosInventarioPorMes';
import EvolucionStock from '../components/visualizacion-reportes/charts/EvolucionStock';

export default function ReportDashboard() {
  const {
    menuOpen, setMenuOpen,
    productos, selectedProducto, setSelectedProducto,
    handleLogout, router
  } = useReportDashboard();

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header
        title="Dashboard Estadístico"
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        handleLogout={handleLogout}
      />

      <div style={{ padding: '20px' }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Card title="Productos con Bajo Stock">
              <ProductosBajoStock />
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card title="Top Productos Vendidos">
              <TopProductosVendidos />
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card title="Ventas por Mes">
              <VentasPorMes />
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card title="Ventas por Sucursal">
              <VentasPorSucursal />
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card title="Ingresos por Sucursal">
              <IngresosPorSucursal />
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card title="Movimientos de Inventario por Mes">
              <MovimientosInventarioPorMes />
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card title="Evolución de Stock">
              <select
                value={selectedProducto}
                onChange={(e) => setSelectedProducto(e.target.value)}
                className="border rounded p-2 w-full mb-4"
              >
                {productos.map((producto) => (
                  <option key={producto.id} value={producto.id}>
                    {producto.nombre_producto}
                  </option>
                ))}
              </select>
              <EvolucionStock productoId={selectedProducto} />
            </Card>
          </Grid>
        </Grid>
      </div>
    </div>
  );
}

function Card({ title, children }) {
  return (
    <div className="shadow-md bg-white rounded-lg p-4">
      <h2 className="text-center font-bold text-lg mb-4">{title}</h2>
      {children}
    </div>
  );
}
