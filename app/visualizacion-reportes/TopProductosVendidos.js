"use client";

import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import "../utils/chartSetup"; // Importar configuración global
import axios from "axios";

const TopProductosVendidos = () => {
    const [chartData, setChartData] = useState({ labels: [], datasets: [] });

    useEffect(() => {
        axios
            .get("http://127.0.0.1:8000/api/productos/top_vendidos/")
            .then((response) => {
                const labels = response.data.map((item) => item.producto_articuloVenta__nombre_producto);
                const data = response.data.map((item) => item.cantidad_vendida);

                setChartData({
                    labels,
                    datasets: [
                        {
                            label: "Top Productos Vendidos",
                            data,
                            backgroundColor: [
                                "#FF6384",
                                "#36A2EB",
                                "#FFCE56",
                                "#4BC0C0",
                                "#9966FF",
                            ],
                        },
                    ],
                });
            })
            .catch((error) => console.error(error));
    }, []);

    return (
        <div>
            <h2>Top Productos Vendidos</h2>
            <Pie data={chartData} />
        </div>
    );
};

export default TopProductosVendidos;
