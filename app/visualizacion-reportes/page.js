"use client";

import React from "react";
import ProductosBajoStock from "./ProductosBajoStock";
import VentasPorMes from "./VentasPorMes";
import VentasPorSucursal from "./VentasPorSucursal";
import TopProductosVendidos from "./TopProductosVendidos";
import MovimientosInventarioPorMes from "./MovimientosInventarioPorMes";

const ReportDashboard = () => {
    return (
        <div style={{ padding: "20px" }}>
            <h1>Dashboard de Visualización de Reportes</h1>
            <section style={{ marginBottom: "40px" }}>
                <h2>Productos con Bajo Stock</h2>
                <ProductosBajoStock />
            </section>
            <section style={{ marginBottom: "40px" }}>
                <h2>Ventas por Mes</h2>
                <VentasPorMes />
            </section>
            <section style={{ marginBottom: "40px" }}>
                <h2>Ventas por Sucursal</h2>
                <VentasPorSucursal />
            </section>
            <section style={{ marginBottom: "40px" }}>
                <h2>Top 5 Productos Más Vendidos</h2>
                <TopProductosVendidos />
            </section>
            <section style={{ marginBottom: "40px" }}>
                <h2>Movimientos de Inventario por Mes</h2>
                <MovimientosInventarioPorMes />
            </section>
        </div>
    );
};

export default ReportDashboard;
