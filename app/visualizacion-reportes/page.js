"use client";

import React, { useEffect, useState } from "react";
import { Grid, Select, MenuItem, FormControl, InputLabel, Button } from "@mui/material";
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

    const [models, setModels] = useState([]); // Modelos disponibles
    const [selectedModel, setSelectedModel] = useState("Venta"); // Modelo seleccionado
    const [chartData, setChartData] = useState({
        model: "Venta",
        xField: "",
        yField: "",
        chartType: "bar",
        filters: {},
        options: {
            title: "",
            xLabel: "",
            yLabel: "",
            color: "#2196F3"
        }
    });
    const [availableFields, setAvailableFields] = useState([]);
    const [chartImage, setChartImage] = useState(null);

    const router = useRouter();

    useEffect(() => {
        const fetchModels = async () => {
            try {
                const response = await axios.get("http://127.0.0.1:8000/api/models/");
                setModels(response.data.models);
            } catch (error) {
                console.error("Error al cargar los modelos:", error);
            }
        };

        const fetchProductos = async () => {
            try {
                const response = await axios.get("http://127.0.0.1:8000/api/productos/");
                setProductos(response.data);
            } catch (error) {
                console.error("Error al cargar los productos:", error);
            }
        };

        fetchModels();
        fetchProductos();
    }, []);

    useEffect(() => {
        const fetchFields = async () => {
            if (selectedModel) {
                try {
                    const response = await axios.get(`http://127.0.0.1:8000/api/model-fields/${selectedModel}/`);
                    setAvailableFields(response.data.fields);
                    setChartData((prev) => ({ ...prev, model: selectedModel }));
                } catch (error) {
                    console.error("Error al cargar los campos del modelo:", error);
                }
            }
        };

        fetchFields();
    }, [selectedModel]);

    const handleChange = (event) => {
        setSelectedProducto(event.target.value);
    };

    const handleLogout = () => {
        localStorage.removeItem('userId');
        router.push('/login');
    };

    const handleGenerateChart = async () => {
        try {
            const response = await axios.post("http://127.0.0.1:8000/api/generate-chart/", chartData);
            setChartImage(response.data.image);
        } catch (error) {
            console.error("Error generando el gráfico:", error);
        }
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
                                Gestión de Productos
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

                    {/* Sección de Personalización de Gráficos */}
                    <Grid item xs={12}>
                        <div style={{ boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)", padding: "20px", borderRadius: "10px" }}>
                            <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Personalización de Gráficos</h2>
                            <FormControl fullWidth style={{ marginBottom: "20px" }}>
                                <InputLabel>Modelo</InputLabel>
                                <Select
                                    value={selectedModel}
                                    onChange={(e) => setSelectedModel(e.target.value)}
                                >
                                    {models.map((model) => (
                                        <MenuItem key={model} value={model}>{model}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <FormControl fullWidth style={{ marginBottom: "20px" }}>
                                <InputLabel>Tipo de Gráfico</InputLabel>
                                <Select
                                    value={chartData.chartType}
                                    onChange={(e) => setChartData({ ...chartData, chartType: e.target.value })}
                                >
                                    <MenuItem value="bar">Barra</MenuItem>
                                    <MenuItem value="line">Línea</MenuItem>
                                    <MenuItem value="scatter">Dispersión</MenuItem>
                                    <MenuItem value="histogram">Histograma</MenuItem>
                                </Select>
                            </FormControl>
                            <FormControl fullWidth style={{ marginBottom: "20px" }}>
                                <InputLabel>Campo X</InputLabel>
                                <Select
                                    value={chartData.xField}
                                    onChange={(e) => setChartData({ ...chartData, xField: e.target.value })}
                                >
                                    {availableFields.map((field) => (
                                        <MenuItem key={field} value={field}>{field}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <FormControl fullWidth style={{ marginBottom: "20px" }}>
                                <InputLabel>Campo Y</InputLabel>
                                <Select
                                    value={chartData.yField}
                                    onChange={(e) => setChartData({ ...chartData, yField: e.target.value })}
                                >
                                    {availableFields.map((field) => (
                                        <MenuItem key={field} value={field}>{field}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleGenerateChart}
                                fullWidth
                            >
                                Generar Gráfico
                            </Button>
                            {chartImage && (
                                <div style={{ marginTop: "20px", textAlign: "center" }}>
                                    <img src={`data:image/png;base64,${chartImage}`} alt="Gráfico generado" style={{ maxWidth: "100%", borderRadius: "10px" }} />
                                </div>
                            )}
                        </div>
                    </Grid>
                </Grid>
            </div>
        </div>
    );
};

export default ReportDashboard;
