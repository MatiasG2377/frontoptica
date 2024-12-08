import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

// Registrar componentes necesarios
ChartJS.register(
    CategoryScale, // Escalas categóricas (eje X)
    LinearScale,   // Escalas lineales (eje Y)
    PointElement,  // Puntos en gráficos de líneas
    LineElement,   // Líneas
    BarElement,    // Barras
    ArcElement,    // Arcos (para gráficos de pastel)
    Title,         // Títulos
    Tooltip,       // Tooltips
    Legend         // Leyendas
);
