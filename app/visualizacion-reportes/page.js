"use client";

import React, { useEffect, useState } from "react";
import { Grid, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import ProductosBajoStock from "./ProductosBajoStock";
import VentasPorMes from "./VentasPorMes";
import VentasPorSucursal from "./VentasPorSucursal";
import TopProductosVendidos from "./TopProductosVendidos";
import MovimientosInventarioPorMes from "./MovimientosInventarioPorMes";
import HistorialKardex from "./HistorialKardex";
import EvolucionStock from "./EvolucionStock";
import axios from "axios";
import { useRouter } from "next/navigation";

const ReportDashboard = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [productos, setProductos] = useState([]);
    const [selectedProducto, setSelectedProducto] = useState("");

    const router = useRouter();

    useEffect(() => {
        const fetchProductos = async () => {
            try {
                const response = await axios.get("http://127.0.0.1:8000/api/productos/");
                setProductos(response.data);
            } catch (error) {
                console.error("Error al cargar los productos:", error);
            }
        };

        fetchProductos();
    }, []);

    const handleChange = (event) => {
        setSelectedProducto(event.target.value);
    };

    const handleLogout = () => {
        localStorage.removeItem('userId');
        router.push('/login');
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
                    <h1 className="text-2xl font-bold">Visualización de Reportes</h1>
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

            <div style={{ padding: "20px" }}>
                <Grid container spacing={4}>
                    <Grid item xs={12} md={6} lg={4}>
                        <div style={{ boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)", padding: "15px", borderRadius: "10px" }}>
                            <h2 style={{ textAlign: "center" }}>Productos con Bajo Stock</h2>
                            <ProductosBajoStock />
                        </div>
                    </Grid>
                    <Grid item xs={12} md={6} lg={4}>
                        <div style={{ boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)", padding: "15px", borderRadius: "10px" }}>
                            <h2 style={{ textAlign: "center" }}>Ventas por Mes</h2>
                            <VentasPorMes />
                        </div>
                    </Grid>
                    <Grid item xs={12} md={6} lg={4}>
                        <div style={{ boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)", padding: "15px", borderRadius: "10px" }}>
                            <h2 style={{ textAlign: "center" }}>Ventas por Sucursal</h2>
                            <VentasPorSucursal />
                        </div>
                    </Grid>
                    <Grid item xs={12} md={6} lg={6}>
                        <div style={{ boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)", padding: "15px", borderRadius: "10px" }}>
                            <h2 style={{ textAlign: "center" }}>Top 5 Productos Más Vendidos</h2>
                            <TopProductosVendidos />
                        </div>
                    </Grid>
                    <Grid item xs={12} md={6} lg={6}>
                        <div style={{ boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)", padding: "15px", borderRadius: "10px" }}>
                            <h2 style={{ textAlign: "center" }}>Movimientos de Inventario por Mes</h2>
                            <MovimientosInventarioPorMes />
                        </div>
                    </Grid>
                    <Grid item xs={12} md={6} lg={6}>
                        <FormControl fullWidth style={{ marginBottom: "20px" }}>
                            <InputLabel>Seleccionar Producto</InputLabel>
                            <Select value={selectedProducto} onChange={handleChange}>
                                {productos.map((producto) => (
                                    <MenuItem key={producto.id} value={producto.id}>
                                        {producto.nombre_producto}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        {/* <div style={{ boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)", padding: "15px", borderRadius: "10px" }}>
                            <h2 style={{ textAlign: "center" }}>Historial Kardex</h2>
                            <HistorialKardex productoId={selectedProducto} />
                        </div> */}
                    </Grid>
                    <Grid item xs={12} md={6} lg={6}>
                        <div style={{ boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)", padding: "15px", borderRadius: "10px" }}>
                            <h2 style={{ textAlign: "center" }}>Evolución del Stock</h2>
                            <EvolucionStock productoId={selectedProducto} />
                        </div>
                    </Grid>
                </Grid>
            </div>
        </div>
    );
};

export default ReportDashboard;
