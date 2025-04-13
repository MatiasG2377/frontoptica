"use client";

import { useState } from "react";
import { Save, Printer, Search } from "lucide-react";

export default function FichaMedica() {
  const [historiaId, setHistoriaId] = useState("");
  const [pacienteNombre, setPacienteNombre] = useState("");

  const [opticalData, setOpticalData] = useState({
    distancia_od_esfera: "",
    distancia_od_cilindro: "",
    distancia_od_eje: "",
    distancia_od_dnp: "",
    distancia_oi_esfera: "",
    distancia_oi_cilindro: "",
    distancia_oi_eje: "",
    distancia_oi_dnp: "",
    add_od: "",
    add_oi: "",
    lectura_od_esfera: "",
    lectura_od_cilindro: "",
    lectura_od_eje: "",
    lectura_oi_esfera: "",
    lectura_oi_cilindro: "",
    lectura_oi_eje: "",
    distancia_od_av: "",
    distancia_oi_av: "",
    add_od_av: "",
    add_oi_av: "",
    lectura_od_av: "",
    lectura_oi_av: "",
    av_rx_od: "",
    av_rx_oi: "",
    altura: "",
    material: "",
    observaciones: "",
    av_od_sc: "",
    av_od_cc: "",
    av_od_esfera: "",
    av_od_cilindro: "",
    av_od_eje: "",
    av_oi_sc: "",
    av_oi_cc: "",
    av_oi_esfera: "",
    av_oi_cilindro: "",
    av_oi_eje: "",
    subjetiva_od_esfera: "",
    subjetiva_od_cilindro: "",
    subjetiva_od_eje: "",
    subjetiva_od_correccion: "",
    subjetiva_oi_esfera: "",
    subjetiva_oi_cilindro: "",
    subjetiva_oi_eje: "",
    subjetiva_oi_correccion: "",
    subjetiva_add_esfera: "",
    subjetiva_add_cilindro: "",
    subjetiva_add_eje: "",
    subjetiva_add_correccion: "",
    causa: "",
  });

  const handleInputChange = (field, value) => {
    setOpticalData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-[#7d2a3f] text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Programa de Fichas Médicas</h1>
          <div className="text-sm">Atendido por: LUCIA</div>
        </div>
      </header>

      <main className="container mx-auto p-4">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-[#7d2a3f]">Ficha Médica</h2>
            <div className="flex space-x-2">
              <button className="bg-[#7d2a3f] text-white px-4 py-2 rounded-md hover:bg-[#6d2435] flex items-center">
                <Save className="h-4 w-4 mr-2" />
                Guardar
              </button>
              <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 flex items-center">
                <Printer className="h-4 w-4 mr-2" />
                Imprimir
              </button>
            </div>
          </div>

          {/* Datos Personales */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="font-medium mb-3 text-gray-700">DATOS PERSONALES</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="historia" className="block text-sm font-medium mb-1">
                  Historia #:
                </label>
                <div className="flex">
                  <input
                    type="text"
                    id="historia"
                    className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-[#7d2a3f]"
                    value={historiaId}
                    onChange={(e) => setHistoriaId(e.target.value)}
                  />
                  <button className="bg-[#7d2a3f] text-white p-2 rounded-md ml-2">
                    <Search className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <div>
                <label htmlFor="paciente" className="block text-sm font-medium mb-1">
                  Paciente:
                </label>
                <input
                  type="text"
                  id="paciente"
                  className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-[#7d2a3f]"
                  value={pacienteNombre}
                  onChange={(e) => setPacienteNombre(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Tablas de datos ópticos */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* RX. REFRACCIÓN */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th colSpan={5} className="bg-[#7d2a3f] text-white text-left p-2 font-bold border border-gray-300">
                      RX. REFRACCIÓN
                    </th>
                  </tr>
                  <tr className="bg-[#7d2a3f]/10">
                    <th className="p-2 border border-gray-300"></th>
                    <th className="p-2 border border-gray-300">Ojo</th>
                    <th className="p-2 border border-gray-300">A.V.</th>
                    <th className="p-2 border border-gray-300">Esfera</th>
                    <th className="p-2 border border-gray-300">Cilindro</th>
                    <th className="p-2 border border-gray-300">Eje(Grados)</th>
                    <th className="p-2 border border-gray-300">DNP(mm)</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Distancia */}
                  <tr>
                    <td rowSpan={2} className="p-2 border border-gray-300 bg-[#7d2a3f]/10 font-medium">
                      Distancia
                    </td>
                    <td className="p-2 border border-gray-300 bg-[#7d2a3f]/10 font-medium">OD</td>
                    <td className="p-2 border border-gray-300">
                      <input
                        type="text"
                        className="w-full p-1 border-0 focus:outline-none focus:ring-1 focus:ring-[#7d2a3f]"
                        value={opticalData.distancia_od_av}
                        onChange={(e) => handleInputChange("distancia_od_av", e.target.value)}
                      />
                    </td>
                    <td className="p-2 border border-gray-300">
                      <input
                        type="text"
                        className="w-full p-1 border-0 focus:outline-none focus:ring-1 focus:ring-[#7d2a3f]"
                        value={opticalData.distancia_od_esfera}
                        onChange={(e) => handleInputChange("distancia_od_esfera", e.target.value)}
                      />
                    </td>
                    <td className="p-2 border border-gray-300">
                      <input
                        type="text"
                        className="w-full p-1 border-0 focus:outline-none focus:ring-1 focus:ring-[#7d2a3f]"
                        value={opticalData.distancia_od_cilindro}
                        onChange={(e) => handleInputChange("distancia_od_cilindro", e.target.value)}
                      />
                    </td>
                    <td className="p-2 border border-gray-300">
                      <input
                        type="text"
                        className="w-full p-1 border-0 focus:outline-none focus:ring-1 focus:ring-[#7d2a3f]"
                        value={opticalData.distancia_od_eje}
                        onChange={(e) => handleInputChange("distancia_od_eje", e.target.value)}
                      />
                    </td>
                    <td className="p-2 border border-gray-300">
                      <input
                        type="text"
                        className="w-full p-1 border-0 focus:outline-none focus:ring-1 focus:ring-[#7d2a3f]"
                        value={opticalData.distancia_od_dnp}
                        onChange={(e) => handleInputChange("distancia_od_dnp", e.target.value)}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2 border border-gray-300 bg-[#7d2a3f]/10 font-medium">OI</td>
                    <td className="p-2 border border-gray-300">
                      <input
                        type="text"
                        className="w-full p-1 border-0 focus:outline-none focus:ring-1 focus:ring-[#7d2a3f]"
                        value={opticalData.distancia_oi_av}
                        onChange={(e) => handleInputChange("distancia_oi_av", e.target.value)}
                      />
                    </td>
                    <td className="p-2 border border-gray-300">
                      <input
                        type="text"
                        className="w-full p-1 border-0 focus:outline-none focus:ring-1 focus:ring-[#7d2a3f]"
                        value={opticalData.distancia_oi_esfera}
                        onChange={(e) => handleInputChange("distancia_oi_esfera", e.target.value)}
                      />
                    </td>
                    <td className="p-2 border border-gray-300">
                      <input
                        type="text"
                        className="w-full p-1 border-0 focus:outline-none focus:ring-1 focus:ring-[#7d2a3f]"
                        value={opticalData.distancia_oi_cilindro}
                        onChange={(e) => handleInputChange("distancia_oi_cilindro", e.target.value)}
                      />
                    </td>
                    <td className="p-2 border border-gray-300">
                      <input
                        type="text"
                        className="w-full p-1 border-0 focus:outline-none focus:ring-1 focus:ring-[#7d2a3f]"
                        value={opticalData.distancia_oi_eje}
                        onChange={(e) => handleInputChange("distancia_oi_eje", e.target.value)}
                      />
                    </td>
                    <td className="p-2 border border-gray-300">
                      <input
                        type="text"
                        className="w-full p-1 border-0 focus:outline-none focus:ring-1 focus:ring-[#7d2a3f]"
                        value={opticalData.distancia_oi_dnp}
                        onChange={(e) => handleInputChange("distancia_oi_dnp", e.target.value)}
                      />
                    </td>
                  </tr>

                  {/* A.D.D. */}
                  <tr>
                    <td rowSpan={2} className="p-2 border border-gray-300 bg-[#7d2a3f]/10 font-medium">
                      A.D.D.
                    </td>
                    <td className="p-2 border border-gray-300 bg-[#7d2a3f]/10 font-medium">OD</td>
                    <td className="p-2 border border-gray-300">
                      <input
                        type="text"
                        className="w-full p-1 border-0 focus:outline-none focus:ring-1 focus:ring-[#7d2a3f]"
                        value={opticalData.add_od_av}
                        onChange={(e) => handleInputChange("add_od_av", e.target.value)}
                      />
                    </td>
                    <td className="p-2 border border-gray-300">
                      <input
                        type="text"
                        className="w-full p-1 border-0 focus:outline-none focus:ring-1 focus:ring-[#7d2a3f]"
                        value={opticalData.add_od}
                        onChange={(e) => handleInputChange("add_od", e.target.value)}
                      />
                    </td>
                    <td colSpan={3}></td>
                  </tr>
                  <tr>
                    <td className="p-2 border border-gray-300 bg-[#7d2a3f]/10 font-medium">OI</td>
                    <td className="p-2 border border-gray-300">
                      <input
                        type="text"
                        className="w-full p-1 border-0 focus:outline-none focus:ring-1 focus:ring-[#7d2a3f]"
                        value={opticalData.add_oi_av}
                        onChange={(e) => handleInputChange("add_oi_av", e.target.value)}
                      />
                    </td>
                    <td className="p-2 border border-gray-300">
                      <input
                        type="text"
                        className="w-full p-1 border-0 focus:outline-none focus:ring-1 focus:ring-[#7d2a3f]"
                        value={opticalData.add_oi}
                        onChange={(e) => handleInputChange("add_oi", e.target.value)}
                      />
                    </td>
                    <td colSpan={3}></td>
                  </tr>

                  {/* Lectura */}
                  <tr>
                    <td rowSpan={2} className="p-2 border border-gray-300 bg-[#7d2a3f]/10 font-medium">
                      Lectura
                    </td>
                    <td className="p-2 border border-gray-300 bg-[#7d2a3f]/10 font-medium">OD</td>
                    <td className="p-2 border border-gray-300">
                      <input
                        type="text"
                        className="w-full p-1 border-0 focus:outline-none focus:ring-1 focus:ring-[#7d2a3f]"
                        value={opticalData.lectura_od_av}
                        onChange={(e) => handleInputChange("lectura_od_av", e.target.value)}
                      />
                    </td>
                    <td className="p-2 border border-gray-300">
                      <input
                        type="text"
                        className="w-full p-1 border-0 focus:outline-none focus:ring-1 focus:ring-[#7d2a3f]"
                        value={opticalData.lectura_od_esfera}
                        onChange={(e) => handleInputChange("lectura_od_esfera", e.target.value)}
                      />
                    </td>
                    <td className="p-2 border border-gray-300">
                      <input
                        type="text"
                        className="w-full p-1 border-0 focus:outline-none focus:ring-1 focus:ring-[#7d2a3f]"
                        value={opticalData.lectura_od_cilindro}
                        onChange={(e) => handleInputChange("lectura_od_cilindro", e.target.value)}
                      />
                    </td>
                    <td className="p-2 border border-gray-300">
                      <input
                        type="text"
                        className="w-full p-1 border-0 focus:outline-none focus:ring-1 focus:ring-[#7d2a3f]"
                        value={opticalData.lectura_od_eje}
                        onChange={(e) => handleInputChange("lectura_od_eje", e.target.value)}
                      />
                    </td>
                    <td></td>
                  </tr>
                  <tr>
                    <td className="p-2 border border-gray-300 bg-[#7d2a3f]/10 font-medium">OI</td>
                    <td className="p-2 border border-gray-300">
                      <input
                        type="text"
                        className="w-full p-1 border-0 focus:outline-none focus:ring-1 focus:ring-[#7d2a3f]"
                        value={opticalData.lectura_oi_av}
                        onChange={(e) => handleInputChange("lectura_oi_av", e.target.value)}
                      />
                    </td>
                    <td className="p-2 border border-gray-300">
                      <input
                        type="text"
                        className="w-full p-1 border-0 focus:outline-none focus:ring-1 focus:ring-[#7d2a3f]"
                        value={opticalData.lectura_oi_esfera}
                        onChange={(e) => handleInputChange("lectura_oi_esfera", e.target.value)}
                      />
                    </td>
                    <td className="p-2 border border-gray-300">
                      <input
                        type="text"
                        className="w-full p-1 border-0 focus:outline-none focus:ring-1 focus:ring-[#7d2a3f]"
                        value={opticalData.lectura_oi_cilindro}
                        onChange={(e) => handleInputChange("lectura_oi_cilindro", e.target.value)}
                      />
                    </td>
                    <td className="p-2 border border-gray-300">
                      <input
                        type="text"
                        className="w-full p-1 border-0 focus:outline-none focus:ring-1 focus:ring-[#7d2a3f]"
                        value={opticalData.lectura_oi_eje}
                        onChange={(e) => handleInputChange("lectura_oi_eje", e.target.value)}
                      />
                    </td>
                    <td></td>
                  </tr>
                </tbody>
              </table>

              {/* Altura y Material */}
              <table className="w-full border-collapse mt-4">
                <tbody>
                  <tr>
                    <td className="p-2 border border-gray-300 font-medium">Altura</td>
                    <td className="p-2 border border-gray-300">
                      <input
                        type="text"
                        className="w-full p-1 border-0 focus:outline-none focus:ring-1 focus:ring-[#7d2a3f]"
                        value={opticalData.altura}
                        onChange={(e) => handleInputChange("altura", e.target.value)}
                      />
                    </td>
                    <td className="p-2 border border-gray-300 font-medium">Material</td>
                    <td className="p-2 border border-gray-300">
                      <input
                        type="text"
                        className="w-full p-1 border-0 focus:outline-none focus:ring-1 focus:ring-[#7d2a3f]"
                        value={opticalData.material}
                        onChange={(e) => handleInputChange("material", e.target.value)}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2 border border-gray-300 font-medium">Observaciones</td>
                    <td colSpan={3} className="p-2 border border-gray-300">
                      <input
                        type="text"
                        className="w-full p-1 border-0 focus:outline-none focus:ring-1 focus:ring-[#7d2a3f]"
                        value={opticalData.observaciones}
                        onChange={(e) => handleInputChange("observaciones", e.target.value)}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* ESQUIASCOPIA */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th colSpan={6} className="bg-[#7d2a3f] text-white text-left p-2 font-bold border border-gray-300">
                      ESQUIASCOPIA
                    </th>
                  </tr>
                  <tr className="bg-[#7d2a3f]/10">
                    <th className="p-2 border border-gray-300"></th>
                    <th className="p-2 border border-gray-300">Ojo</th>
                    <th className="p-2 border border-gray-300">S.C</th>
                    <th className="p-2 border border-gray-300">C.C</th>
                    <th className="p-2 border border-gray-300">Esfera</th>
                    <th className="p-2 border border-gray-300">Cilindro</th>
                    <th className="p-2 border border-gray-300">Eje(grados)</th>
                  </tr>
                </thead>
                <tbody>
                  {/* A.V. */}
                  <tr>
                    <td rowSpan={2} className="p-2 border border-gray-300 bg-[#7d2a3f]/10 font-medium">
                      A.V.
                    </td>
                    <td className="p-2 border border-gray-300 bg-[#7d2a3f]/10 font-medium">OD</td>
                    <td className="p-2 border border-gray-300">
                      <input
                        type="text"
                        className="w-full p-1 border-0 focus:outline-none focus:ring-1 focus:ring-[#7d2a3f]"
                        value={opticalData.av_od_sc}
                        onChange={(e) => handleInputChange("av_od_sc", e.target.value)}
                      />
                    </td>
                    <td className="p-2 border border-gray-300">
                      <input
                        type="text"
                        className="w-full p-1 border-0 focus:outline-none focus:ring-1 focus:ring-[#7d2a3f]"
                        value={opticalData.av_od_cc}
                        onChange={(e) => handleInputChange("av_od_cc", e.target.value)}
                      />
                    </td>
                    <td className="p-2 border border-gray-300">
                      <input
                        type="text"
                        className="w-full p-1 border-0 focus:outline-none focus:ring-1 focus:ring-[#7d2a3f]"
                        value={opticalData.av_od_esfera}
                        onChange={(e) => handleInputChange("av_od_esfera", e.target.value)}
                      />
                    </td>
                    <td className="p-2 border border-gray-300">
                      <input
                        type="text"
                        className="w-full p-1 border-0 focus:outline-none focus:ring-1 focus:ring-[#7d2a3f]"
                        value={opticalData.av_od_cilindro}
                        onChange={(e) => handleInputChange("av_od_cilindro", e.target.value)}
                      />
                    </td>
                    <td className="p-2 border border-gray-300">
                      <input
                        type="text"
                        className="w-full p-1 border-0 focus:outline-none focus:ring-1 focus:ring-[#7d2a3f]"
                        value={opticalData.av_od_eje}
                        onChange={(e) => handleInputChange("av_od_eje", e.target.value)}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2 border border-gray-300 bg-[#7d2a3f]/10 font-medium">OI</td>
                    <td className="p-2 border border-gray-300">
                      <input
                        type="text"
                        className="w-full p-1 border-0 focus:outline-none focus:ring-1 focus:ring-[#7d2a3f]"
                        value={opticalData.av_oi_sc}
                        onChange={(e) => handleInputChange("av_oi_sc", e.target.value)}
                      />
                    </td>
                    <td className="p-2 border border-gray-300">
                      <input
                        type="text"
                        className="w-full p-1 border-0 focus:outline-none focus:ring-1 focus:ring-[#7d2a3f]"
                        value={opticalData.av_oi_cc}
                        onChange={(e) => handleInputChange("av_oi_cc", e.target.value)}
                      />
                    </td>
                    <td className="p-2 border border-gray-300">
                      <input
                        type="text"
                        className="w-full p-1 border-0 focus:outline-none focus:ring-1 focus:ring-[#7d2a3f]"
                        value={opticalData.av_oi_esfera}
                        onChange={(e) => handleInputChange("av_oi_esfera", e.target.value)}
                      />
                    </td>
                    <td className="p-2 border border-gray-300">
                      <input
                        type="text"
                        className="w-full p-1 border-0 focus:outline-none focus:ring-1 focus:ring-[#7d2a3f]"
                        value={opticalData.av_oi_cilindro}
                        onChange={(e) => handleInputChange("av_oi_cilindro", e.target.value)}
                      />
                    </td>
                    <td className="p-2 border border-gray-300">
                      <input
                        type="text"
                        className="w-full p-1 border-0 focus:outline-none focus:ring-1 focus:ring-[#7d2a3f]"
                        value={opticalData.av_oi_eje}
                        onChange={(e) => handleInputChange("av_oi_eje", e.target.value)}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Refracción subjetiva */}
              <table className="w-full border-collapse mt-4">
                <thead>
                  <tr>
                    <th colSpan={5} className="p-2 border border-gray-300 bg-[#7d2a3f] text-white text-left">
                      Refracción subjetiva
                    </th>
                  </tr>
                  <tr className="bg-[#7d2a3f]/10">
                    <th className="p-2 border border-gray-300">Ojo</th>
                    <th className="p-2 border border-gray-300">Esfera</th>
                    <th className="p-2 border border-gray-300">Cilindro</th>
                    <th className="p-2 border border-gray-300">Eje(grados)</th>
                    <th className="p-2 border border-gray-300">Corrección</th>
                  </tr>
                </thead>
                <tbody>
                  {/* OD */}
                  <tr>
                    <td className="p-2 border border-gray-300 bg-[#7d2a3f]/10 font-medium">O.D.</td>
                    <td className="p-2 border border-gray-300">
                      <input
                        type="text"
                        className="w-full p-1 border-0 focus:outline-none focus:ring-1 focus:ring-[#7d2a3f]"
                        value={opticalData.subjetiva_od_esfera}
                        onChange={(e) => handleInputChange("subjetiva_od_esfera", e.target.value)}
                      />
                    </td>
                    <td className="p-2 border border-gray-300">
                      <input
                        type="text"
                        className="w-full p-1 border-0 focus:outline-none focus:ring-1 focus:ring-[#7d2a3f]"
                        value={opticalData.subjetiva_od_cilindro}
                        onChange={(e) => handleInputChange("subjetiva_od_cilindro", e.target.value)}
                      />
                    </td>
                    <td className="p-2 border border-gray-300">
                      <input
                        type="text"
                        className="w-full p-1 border-0 focus:outline-none focus:ring-1 focus:ring-[#7d2a3f]"
                        value={opticalData.subjetiva_od_eje}
                        onChange={(e) => handleInputChange("subjetiva_od_eje", e.target.value)}
                      />
                    </td>
                    <td className="p-2 border border-gray-300">
                      <input
                        type="text"
                        className="w-full p-1 border-0 focus:outline-none focus:ring-1 focus:ring-[#7d2a3f]"
                        value={opticalData.subjetiva_od_correccion}
                        onChange={(e) => handleInputChange("subjetiva_od_correccion", e.target.value)}
                      />
                    </td>
                  </tr>

                  {/* OI */}
                  <tr>
                    <td className="p-2 border border-gray-300 bg-[#7d2a3f]/10 font-medium">O.I.</td>
                    <td className="p-2 border border-gray-300">
                      <input
                        type="text"
                        className="w-full p-1 border-0 focus:outline-none focus:ring-1 focus:ring-[#7d2a3f]"
                        value={opticalData.subjetiva_oi_esfera}
                        onChange={(e) => handleInputChange("subjetiva_oi_esfera", e.target.value)}
                      />
                    </td>
                    <td className="p-2 border border-gray-300">
                      <input
                        type="text"
                        className="w-full p-1 border-0 focus:outline-none focus:ring-1 focus:ring-[#7d2a3f]"
                        value={opticalData.subjetiva_oi_cilindro}
                        onChange={(e) => handleInputChange("subjetiva_oi_cilindro", e.target.value)}
                      />
                    </td>
                    <td className="p-2 border border-gray-300">
                      <input
                        type="text"
                        className="w-full p-1 border-0 focus:outline-none focus:ring-1 focus:ring-[#7d2a3f]"
                        value={opticalData.subjetiva_oi_eje}
                        onChange={(e) => handleInputChange("subjetiva_oi_eje", e.target.value)}
                      />
                    </td>
                    <td className="p-2 border border-gray-300">
                      <input
                        type="text"
                        className="w-full p-1 border-0 focus:outline-none focus:ring-1 focus:ring-[#7d2a3f]"
                        value={opticalData.subjetiva_oi_correccion}
                        onChange={(e) => handleInputChange("subjetiva_oi_correccion", e.target.value)}
                      />
                    </td>
                  </tr>

                  {/* ADD */}
                  <tr>
                    <td className="p-2 border border-gray-300 bg-[#7d2a3f]/10 font-medium">A.D.D</td>
                    <td className="p-2 border border-gray-300">
                      <input
                        type="text"
                        className="w-full p-1 border-0 focus:outline-none focus:ring-1 focus:ring-[#7d2a3f]"
                        value={opticalData.subjetiva_add_esfera}
                        onChange={(e) => handleInputChange("subjetiva_add_esfera", e.target.value)}
                      />
                    </td>
                    <td className="p-2 border border-gray-300">
                      <input
                        type="text"
                        className="w-full p-1 border-0 focus:outline-none focus:ring-1 focus:ring-[#7d2a3f]"
                        value={opticalData.subjetiva_add_cilindro}
                        onChange={(e) => handleInputChange("subjetiva_add_cilindro", e.target.value)}
                      />
                    </td>
                    <td className="p-2 border border-gray-300">
                      <input
                        type="text"
                        className="w-full p-1 border-0 focus:outline-none focus:ring-1 focus:ring-[#7d2a3f]"
                        value={opticalData.subjetiva_add_eje}
                        onChange={(e) => handleInputChange("subjetiva_add_eje", e.target.value)}
                      />
                    </td>
                    <td className="p-2 border border-gray-300">
                      <input
                        type="text"
                        className="w-full p-1 border-0 focus:outline-none focus:ring-1 focus:ring-[#7d2a3f]"
                        value={opticalData.subjetiva_add_correccion}
                        onChange={(e) => handleInputChange("subjetiva_add_correccion", e.target.value)}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Causa */}
              <table className="w-full border-collapse mt-4">
                <tbody>
                  <tr>
                    <td className="p-2 border border-gray-300 font-medium">Causa</td>
                    <td className="p-2 border border-gray-300">
                      <input
                        type="text"
                        className="w-full p-1 border-0 focus:outline-none focus:ring-1 focus:ring-[#7d2a3f]"
                        value={opticalData.causa}
                        onChange={(e) => handleInputChange("causa", e.target.value)}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex justify-end mt-6 space-x-2">
            <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300">Cancelar</button>
            <button className="bg-[#7d2a3f] text-white px-4 py-2 rounded-md hover:bg-[#6d2435]">
              Guardar Datos Ópticos
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
