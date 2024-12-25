"use client";

import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import axios from "axios";

const EvolucionStock = ({ productoId }) => {
    const [chartData, setChartData] = useState({ labels: [], datasets: [] });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                setError(null); // Resetear errores previos
                const response = await axios.get(`http://127.0.0.1:8000/api/evolucion/stock/${productoId}/`);
                
                // Verificar si los datos están vacíos
                if (response.data.length === 0) {
                    setError("No hay datos disponibles para este producto.");
                    setChartData({ labels: [], datasets: [] });
                    return;
                }

                // Procesar los datos para el gráfico
                const labels = response.data.map(item => item.fecha_kardex);
                const data = response.data.map(item => item.saldo_cantidad_kardex);

                setChartData({
                    labels,
                    datasets: [
                        {
                            label: "Evolución del Stock",
                            data,
                            borderColor: "rgba(75, 192, 192, 1)",
                            backgroundColor: "rgba(75, 192, 192, 0.2)",
                            tension: 0.4,
                            fill: true,
                        },
                    ],
                });
            } catch (error) {
                if (error.response && error.response.status === 404) {
                    setError("Producto no encontrado.");
                } else {
                    setError("Ocurrió un error al cargar los datos.");
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [productoId]);

    // Mostrar carga, error o el gráfico
    if (isLoading) return <p>Cargando datos...</p>;
    if (error) return <p>{error}</p>;

    return <Line data={chartData} />;
};

export default EvolucionStock;
