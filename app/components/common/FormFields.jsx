export const InputField = ({ label, ...props }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <input {...props} className="p-3 border rounded-lg w-full focus:ring-[#712b39] focus:border-[#712b39]" />
    </div>
  );
  
  export const TextareaField = ({ label, ...props }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <textarea {...props} className="p-3 border rounded-lg w-full focus:ring-[#712b39] focus:border-[#712b39] h-28" />
    </div>
  );
  
  export const SelectField = ({ label, options, optionLabel, ...props }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <select {...props} className="p-3 border rounded-lg w-full focus:ring-[#712b39] focus:border-[#712b39]">
        <option value="">Seleccionar...</option>
        {options.map((o) => (
          <option key={o.id} value={o.id}>{o[optionLabel]}</option>
        ))}
      </select>
    </div>
  );
  
  export const MultiSelectField = ({ label, value, options, optionLabel, name, setFormData }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <select
        name={name}
        multiple
        value={value}
        onChange={(e) =>
          setFormData((prev) => ({
            ...prev,
            [name]: Array.from(e.target.selectedOptions, (o) => o.value),
          }))
        }
        className="p-3 border rounded-lg w-full h-32 focus:ring-[#712b39] focus:border-[#712b39]"
      >
        {options.map((o) => (
          <option key={o.id} value={o.id}>{o[optionLabel]}</option>
        ))}
      </select>
    </div>
  );
  
  export const FileField = ({ label, file, handleFile }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="flex flex-col items-center space-y-2">
        <label htmlFor="fileInput" className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg cursor-pointer border border-gray-300 w-full text-center hover:bg-gray-300">
          Seleccionar Archivo
        </label>
        <input id="fileInput" type="file" accept="image/*" onChange={handleFile} className="hidden" />
        <span className="text-sm text-gray-500">{file ? file.name : 'Ningún archivo seleccionado'}</span>
      </div>
    </div>
  );
  