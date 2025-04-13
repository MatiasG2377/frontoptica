'use client';
import {
  InputField,
  TextareaField,
  SelectField,
  MultiSelectField,
  FileField
} from '../common/FormFields'; // Ajusta este path según tu estructura

export default function FormularioProducto({
  isOpen,
  onClose,
  formData,
  setFormData,
  categorias,
  proveedores,
  file,
  setFile,
  onSubmit
}) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFile = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile || !['image/jpeg', 'image/png'].includes(selectedFile.type)) {
      alert('Selecciona un archivo JPG o PNG válido.');
      return;
    }
    setFile(selectedFile);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-2/3 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">
          {formData?.id ? 'Editar Producto' : 'Agregar Producto'}
        </h2>

        <div className="grid grid-cols-2 gap-6">
          {/* Columna izquierda */}
          <div className="flex flex-col space-y-4">
            <InputField label="Nombre del Producto" name="nombre_producto" value={formData.nombre_producto} onChange={handleChange} />
            <SelectField label="Categoría" name="categoria_producto" value={formData.categoria_producto} onChange={handleChange} options={categorias} optionLabel="nombre_categoria" />
            <InputField label="Precio de Venta (PVP)" name="pvp_producto" type="number" value={formData.pvp_producto} onChange={handleChange} />
            <InputField label="Costo del Producto" name="costo_producto" type="number" value={formData.costo_producto} onChange={handleChange} />
            <InputField label="Cantidad" name="cantidad_producto" type="number" value={formData.cantidad_producto} onChange={handleChange} />
            <div className="grid grid-cols-2 gap-4">
              <InputField label="Stock Mínimo" name="minimo_producto" type="number" value={formData.minimo_producto} onChange={handleChange} />
              <InputField label="Stock Máximo" name="maximo_producto" type="number" value={formData.maximo_producto} onChange={handleChange} />
            </div>
          </div>

          {/* Columna derecha */}
          <div className="flex flex-col space-y-4">
            <TextareaField label="Descripción" name="descripcion_producto" value={formData.descripcion_producto} onChange={handleChange} />
            <InputField label="Marca" name="marca_producto" value={formData.marca_producto} onChange={handleChange} />
            <FileField label="Imagen del Producto" file={file} handleFile={handleFile} />
            <MultiSelectField
              label="Proveedores"
              name="proveedores_producto"
              value={formData.proveedores_producto}
              options={proveedores}
              optionLabel="nombre_proveedor"
              setFormData={setFormData}
            />
          </div>
        </div>

        <div className="flex justify-end mt-4 space-x-4">
          <button onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-700">
            Cancelar
          </button>
          <button onClick={onSubmit} className="bg-[#712b39] text-white px-4 py-2 rounded-lg hover:bg-[#5e242e]">
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
