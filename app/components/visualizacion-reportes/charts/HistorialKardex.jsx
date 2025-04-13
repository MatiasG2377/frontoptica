"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const HistorialKardex = ({ productoId }) => {
    const [data, setData] = useState([]); // Estado para almacenar los datos del Kardex
    const [loading, setLoading] = useState(true); // Estado para manejar la carga
    const [error, setError] = useState(null); // Estado para manejar errores

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!productoId) {
                    setError("Debe seleccionar un producto.");
                    setLoading(false);
                    return;
                }

                const response = await axios.get(`http://127.0.0.1:8000/api/kardex/${productoId}/`);

                if (response.data && Array.isArray(response.data) && response.data.length > 0) {
                    setData(response.data);
                } else {
                    setData([]);
                    setError("No hay datos disponibles para este producto.");
                }
            } catch (err) {
                console.error("Error al cargar el historial de Kardex:", err);
                setError("No se encontraron datos del historial de Kardex.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [productoId]);

    // Renderiza el mensaje de carga
    if (loading) {
        return <p style={{ textAlign: "center", padding: "20px" }}>Cargando...</p>;
    }

    // Renderiza el mensaje de error o falta de datos
    if (error || data.length === 0) {
        return (
            <div style={{ textAlign: "center", padding: "20px", color: "#712b39" }}>
                <p>{error}</p>
            </div>
        );
    }

    // Configuración de los datos para el gráfico
    const chartData = {
        labels: data.map((entry) => entry.fecha_kardex),
        datasets: [
            {
                label: "Saldo de Cantidad",
                data: data.map((entry) => entry.saldo_cantidad_kardex),
                borderColor: "#712b39",
                backgroundColor: "rgba(113, 43, 57, 0.5)",
                tension: 0.4,
                fill: true,
            },
        ],
    };

    // Configuración de las opciones del gráfico
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: "top",
            },
            title: {
                display: true,
                text: "Historial de Kardex",
            },
        },
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    return (
        <div style={{ padding: "20px" }}>
            <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Historial de Kardex</h2>
            <Line data={chartData} options={options} />
        </div>
    );
};

export default HistorialKardex;
