"use client";

import { useState } from "react";
import { Search, Save, Printer, FileText, ChevronRight, Eye } from "lucide-react";

export default function FichaMedica() {
  const [historiaId, setHistoriaId] = useState("");
  const [pacienteNombre, setPacienteNombre] = useState("");

  const [refractionValues, setRefractionValues] = useState({
    od_esfera: "0.00", od_cilindro: "0.00", od_eje: "0", od_dip: "0.00", od_add: "0.00",
    oi_esfera: "0.00", oi_cilindro: "0.00", oi_eje: "0", oi_dip: "0.00", oi_add: "0.00",
    distancia_od: "0.00", distancia_oi: "0.00", lectura_od: "0.00", lectura_oi: "0.00",
    subjetiva_od_esfera: "0.00", subjetiva_od_cilindro: "0.00", subjetiva_od_eje: "0",
    subjetiva_oi_esfera: "0.00", subjetiva_oi_cilindro: "0.00", subjetiva_oi_eje: "0",
    correccion_od: "0.00", correccion_oi: "0.00",
  });

  const handleRefractionChange = (field, value) => {
    setRefractionValues({
      ...refractionValues,
      [field]: value,
    });
  };


  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Ficha Médica</h1>
        <div className="flex space-x-2">
          <button className="btn-primary flex items-center">
            <Save className="h-4 w-4 mr-2" />
            Guardar
          </button>
          <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors flex items-center">
            <Printer className="h-4 w-4 mr-2" />
            Imprimir
          </button>
        </div>
      </div>

      <div className="card mb-6">
        <h2 className="text-lg font-semibold mb-4">Datos Personales</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-group">
            <label htmlFor="historia" className="form-label">
              Historia #:
            </label>
            <div className="flex">
              <input
                type="text"
                id="historia"
                className="input-field"
                value={historiaId}
                onChange={(e) => setHistoriaId(e.target.value)}
              />
              <button className="bg-primary text-white p-2 rounded-md ml-2">
                <Search className="h-5 w-5" />
              </button>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="paciente" className="form-label">
              Paciente:
            </label>
            <input
              type="text"
              id="paciente"
              className="input-field"
              value={pacienteNombre}
              onChange={(e) => setPacienteNombre(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="card mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Refracción y Optometría</h2>
          <div className="flex items-center text-sm text-primary">
            <Eye className="h-4 w-4 mr-1" />
            <span>Atendido por: LUCIA</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Columna izquierda - Refracción */}
          <div>
            <h3 className="text-md font-medium mb-3">Refracción</h3>

            <div className="mb-4">
              <div className="grid grid-cols-5 gap-2 mb-1">
                <div></div>
                <div className="text-center text-sm font-medium">Esfera</div>
                <div className="text-center text-sm font-medium">Cilindro</div>
                <div className="text-center text-sm font-medium">Eje</div>
                <div className="text-center text-sm font-medium">DIP (mm)</div>
              </div>

              {/* OD - Ojo Derecho */}
              <div className="grid grid-cols-5 gap-2 mb-2">
                <div className="flex items-center">
                  <span className="font-medium">OD</span>
                </div>
                <div>
                  <input
                    type="text"
                    className="input-field text-center"
                    value={refractionValues.od_esfera}
                    onChange={(e) => handleRefractionChange("od_esfera", e.target.value)}
                  />
                </div>
                <div>
                  <input
                    type="text"
                    className="input-field text-center"
                    value={refractionValues.od_cilindro}
                    onChange={(e) => handleRefractionChange("od_cilindro", e.target.value)}
                  />
                </div>
                <div>
                  <input
                    type="text"
                    className="input-field text-center"
                    value={refractionValues.od_eje}
                    onChange={(e) => handleRefractionChange("od_eje", e.target.value)}
                  />
                </div>
                <div>
                  <input
                    type="text"
                    className="input-field text-center"
                    value={refractionValues.od_dip}
                    onChange={(e) => handleRefractionChange("od_dip", e.target.value)}
                  />
                </div>
              </div>

              {/* OI - Ojo Izquierdo */}
              <div className="grid grid-cols-5 gap-2">
                <div className="flex items-center">
                  <span className="font-medium">OI</span>
                </div>
                <div>
                  <input
                    type="text"
                    className="input-field text-center"
                    value={refractionValues.oi_esfera}
                    onChange={(e) => handleRefractionChange("oi_esfera", e.target.value)}
                  />
                </div>
                <div>
                  <input
                    type="text"
                    className="input-field text-center"
                    value={refractionValues.oi_cilindro}
                    onChange={(e) => handleRefractionChange("oi_cilindro", e.target.value)}
                  />
                </div>
                <div>
                  <input
                    type="text"
                    className="input-field text-center"
                    value={refractionValues.oi_eje}
                    onChange={(e) => handleRefractionChange("oi_eje", e.target.value)}
                  />
                </div>
                <div>
                  <input
                    type="text"
                    className="input-field text-center"
                    value={refractionValues.oi_dip}
                    onChange={(e) => handleRefractionChange("oi_dip", e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="mb-4">
              <div className="grid grid-cols-3 gap-2 mb-1">
                <div></div>
                <div className="text-center text-sm font-medium">OD</div>
                <div className="text-center text-sm font-medium">OI</div>
              </div>

              {/* Distancia */}
              <div className="grid grid-cols-3 gap-2 mb-2">
                <div className="flex items-center">
                  <span className="font-medium">Distancia</span>
                </div>
                <div>
                  <input
                    type="text"
                    className="input-field text-center"
                    value={refractionValues.distancia_od}
                    onChange={(e) => handleRefractionChange("distancia_od", e.target.value)}
                  />
                </div>
                <div>
                  <input
                    type="text"
                    className="input-field text-center"
                    value={refractionValues.distancia_oi}
                    onChange={(e) => handleRefractionChange("distancia_oi", e.target.value)}
                  />
                </div>
              </div>

              {/* Lectura */}
              <div className="grid grid-cols-3 gap-2">
                <div className="flex items-center">
                  <span className="font-medium">Lectura</span>
                </div>
                <div>
                  <input
                    type="text"
                    className="input-field text-center"
                    value={refractionValues.lectura_od}
                    onChange={(e) => handleRefractionChange("lectura_od", e.target.value)}
                  />
                </div>
                <div>
                  <input
                    type="text"
                    className="input-field text-center"
                    value={refractionValues.lectura_oi}
                    onChange={(e) => handleRefractionChange("lectura_oi", e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="form-group">
                <label htmlFor="adicion" className="form-label">
                  Adición:
                </label>
                <input
                  type="text"
                  id="adicion"
                  className="input-field"
                  value={refractionValues.od_add}
                  onChange={(e) => {
                    handleRefractionChange("od_add", e.target.value)
                    handleRefractionChange("oi_add", e.target.value)
                  }}
                />
              </div>
              <div className="form-group">
                <label htmlFor="material" className="form-label">
                  Material:
                </label>
                <select id="material" className="input-field">
                  <option value="">Seleccionar</option>
                  <option value="cr39">CR-39</option>
                  <option value="policarbonato">Policarbonato</option>
                  <option value="trivex">Trivex</option>
                  <option value="alto-indice">Alto Índice</option>
                </select>
              </div>
            </div>
          </div>

          {/* Columna derecha - Refracción Subjetiva y Corrección */}
          <div>
            <h3 className="text-md font-medium mb-3">Refracción Subjetiva</h3>

            <div className="mb-4">
              <div className="grid grid-cols-4 gap-2 mb-1">
                <div></div>
                <div className="text-center text-sm font-medium">Esfera</div>
                <div className="text-center text-sm font-medium">Cilindro</div>
                <div className="text-center text-sm font-medium">Eje</div>
              </div>

              {/* OD - Ojo Derecho */}
              <div className="grid grid-cols-4 gap-2 mb-2">
                <div className="flex items-center">
                  <span className="font-medium">OD</span>
                </div>
                <div>
                  <input
                    type="text"
                    className="input-field text-center"
                    value={refractionValues.subjetiva_od_esfera}
                    onChange={(e) => handleRefractionChange("subjetiva_od_esfera", e.target.value)}
                  />
                </div>
                <div>
                  <input
                    type="text"
                    className="input-field text-center"
                    value={refractionValues.subjetiva_od_cilindro}
                    onChange={(e) => handleRefractionChange("subjetiva_od_cilindro", e.target.value)}
                  />
                </div>
                <div>
                  <input
                    type="text"
                    className="input-field text-center"
                    value={refractionValues.subjetiva_od_eje}
                    onChange={(e) => handleRefractionChange("subjetiva_od_eje", e.target.value)}
                  />
                </div>
              </div>

              {/* OI - Ojo Izquierdo */}
              <div className="grid grid-cols-4 gap-2">
                <div className="flex items-center">
                  <span className="font-medium">OI</span>
                </div>
                <div>
                  <input
                    type="text"
                    className="input-field text-center"
                    value={refractionValues.subjetiva_oi_esfera}
                    onChange={(e) => handleRefractionChange("subjetiva_oi_esfera", e.target.value)}
                  />
                </div>
                <div>
                  <input
                    type="text"
                    className="input-field text-center"
                    value={refractionValues.subjetiva_oi_cilindro}
                    onChange={(e) => handleRefractionChange("subjetiva_oi_cilindro", e.target.value)}
                  />
                </div>
                <div>
                  <input
                    type="text"
                    className="input-field text-center"
                    value={refractionValues.subjetiva_oi_eje}
                    onChange={(e) => handleRefractionChange("subjetiva_oi_eje", e.target.value)}
                  />
                </div>
              </div>
            </div>

            <h3 className="text-md font-medium mb-3 mt-4">Corrección</h3>

            <div className="mb-4">
              <div className="grid grid-cols-2 gap-2 mb-1">
                <div></div>
                <div className="text-center text-sm font-medium">Valor</div>
              </div>

              {/* OD - Ojo Derecho */}
              <div className="grid grid-cols-2 gap-2 mb-2">
                <div className="flex items-center">
                  <span className="font-medium">OD</span>
                </div>
                <div>
                  <input
                    type="text"
                    className="input-field text-center"
                    value={refractionValues.correccion_od}
                    onChange={(e) => handleRefractionChange("correccion_od", e.target.value)}
                  />
                </div>
              </div>

              {/* OI - Ojo Izquierdo */}
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center">
                  <span className="font-medium">OI</span>
                </div>
                <div>
                  <input
                    type="text"
                    className="input-field text-center"
                    value={refractionValues.correccion_oi}
                    onChange={(e) => handleRefractionChange("correccion_oi", e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="form-group mt-4">
              <label htmlFor="observaciones" className="form-label">
                Observaciones:
              </label>
              <textarea
                id="observaciones"
                className="input-field min-h-[100px]"
                placeholder="Ingrese observaciones adicionales..."
              ></textarea>
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-6 space-x-2">
          <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors flex items-center">
            <FileText className="h-4 w-4 mr-2" />
            Historia Clínica
          </button>
          <button className="btn-primary flex items-center">
            <ChevronRight className="h-4 w-4 mr-2" />
            Continuar a Productos
          </button>
        </div>
      </div>
    </div>
  )
}
