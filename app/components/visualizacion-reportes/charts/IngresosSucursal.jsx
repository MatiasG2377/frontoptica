"use client";

import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import axios from "axios";

const IngresosPorSucursal = () => {
    const [chartData, setChartData] = useState({ labels: [], datasets: [] });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("http://127.0.0.1:8000/api/ingresos/por_sucursal/");
                const labels = response.data.map(item => item.sucursal_venta__nombre_sucursal);
                const data = response.data.map(item => item.total_ingresos);

                setChartData({
                    labels,
                    datasets: [
                        {
                            label: "Ingresos por Sucursal",
                            data,
                            backgroundColor: "rgba(54, 162, 235, 0.6)",
                        },
                    ],
                });
            } catch (error) {
                console.error("Error al cargar los datos de ingresos por sucursal:", error);
            }
        };
        fetchData();
    }, []);

    return <Bar data={chartData} />;
};

export default IngresosPorSucursal;
