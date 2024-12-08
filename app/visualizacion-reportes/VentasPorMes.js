"use client";

import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import "../utils/chartSetup"; // Importar configuración global
import axios from "axios";

const VentasPorMes = () => {
    const [chartData, setChartData] = useState({ labels: [], datasets: [] });

    useEffect(() => {
        axios
            .get("http://127.0.0.1:8000/api/ventas/por_mes/")
            .then((response) => {
                const labels = response.data.map((item) =>
                    new Date(item.mes).toLocaleString("default", { month: "short", year: "numeric" })
                );
                const data = response.data.map((item) => item.total_ventas);

                setChartData({
                    labels,
                    datasets: [
                        {
                            label: "Ventas por Mes",
                            data,
                            backgroundColor: "rgba(75, 192, 192, 0.6)",
                        },
                    ],
                });
            })
            .catch((error) => console.error(error));
    }, []);

    return (
        <div>
            <h2>Ventas por Mes</h2>
            <Bar data={chartData} />
        </div>
    );
};

export default VentasPorMes;
