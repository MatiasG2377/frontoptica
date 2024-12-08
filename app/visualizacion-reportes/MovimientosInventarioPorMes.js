"use client";

import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import "../utils/chartSetup"; // Importar configuración global
import axios from "axios";

const MovimientosInventarioPorMes = () => {
    const [chartData, setChartData] = useState({ labels: [], datasets: [] });

    useEffect(() => {
        axios
            .get("http://127.0.0.1:8000/api/movimientos/inventario_por_mes/")
            .then((response) => {
                const labels = response.data.map((item) =>
                    new Date(item.mes).toLocaleString("default", { month: "short", year: "numeric" })
                );

                const entradas = response.data
                    .filter((item) => item.tipo_movimientoInventario === "Entrada")
                    .map((item) => item.total_movimientos);

                const salidas = response.data
                    .filter((item) => item.tipo_movimientoInventario === "Salida")
                    .map((item) => item.total_movimientos);

                setChartData({
                    labels,
                    datasets: [
                        {
                            label: "Entradas",
                            data: entradas,
                            borderColor: "green",
                            backgroundColor: "rgba(0, 255, 0, 0.2)",
                            tension: 0.4,
                            fill: true,
                        },
                        {
                            label: "Salidas",
                            data: salidas,
                            borderColor: "red",
                            backgroundColor: "rgba(255, 0, 0, 0.2)",
                            tension: 0.4,
                            fill: true,
                        },
                    ],
                });
            })
            .catch((error) => console.error(error));
    }, []);

    return (
        <div>
            <h2>Movimientos de Inventario por Mes</h2>
            <Line data={chartData} />
        </div>
    );
};

export default MovimientosInventarioPorMes;
