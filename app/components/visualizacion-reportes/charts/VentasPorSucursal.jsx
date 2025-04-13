"use client";

import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import '../../../utils/chartSetup';
import axios from "axios";

const VentasPorSucursal = () => {
    const [chartData, setChartData] = useState({ labels: [], datasets: [] });

    useEffect(() => {
        axios
            .get("http://127.0.0.1:8000/api/ventas/por_sucursal/")
            .then((response) => {
                const labels = response.data.map((item) => item.sucursal_venta__nombre_sucursal);
                const data = response.data.map((item) => item.total_ventas);

                setChartData({
                    labels,
                    datasets: [
                        {
                            label: "Ventas por Sucursal",
                            data,
                            backgroundColor: "rgba(153, 102, 255, 0.6)",
                        },
                    ],
                });
            })
            .catch((error) => console.error(error));
    }, []);

    return (
        <div>
            <h2>Ventas por Sucursal</h2>
            <Bar data={chartData} />
        </div>
    );
};

export default VentasPorSucursal;
