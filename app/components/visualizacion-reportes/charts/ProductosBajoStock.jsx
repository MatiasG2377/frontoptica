"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

const ProductosBajoStock = () => {
    const [productos, setProductos] = useState([]);

    useEffect(() => {
        axios
            .get("http://127.0.0.1:8000/api/productos/bajo_stock/")
            .then((response) => setProductos(response.data))
            .catch((error) => console.error(error));
    }, []);

    return (
        <table border="1" style={{ width: "100%", textAlign: "left" }}>
            <thead>
                <tr>
                    <th>Nombre</th>
                    <th>Cantidad</th>
                    <th>Stock Mínimo</th>
                </tr>
            </thead>
            <tbody>
                {productos.map((producto) => (
                    <tr key={producto.id}>
                        <td>{producto.nombre_producto}</td>
                        <td>{producto.cantidad_producto}</td>
                        <td>{producto.minimo_producto}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default ProductosBajoStock;
