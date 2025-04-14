/**
 * Muestra una imagen ampliada en un modal.
 *
 *? @param {string} image URL de la imagen a mostrar.
 *? @param {function} onClose Función a llamar cuando se cierra el modal.
 *? @returns {JSX.Element} El modal con la imagen.
 */
export default function ImageModal({ image, onClose }) {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="relative bg-white p-4 rounded-lg max-w-[90%] max-h-[80%] flex justify-center items-center overflow-hidden"
        onClick={(e) => e.stopPropagation()} // evita que el clic cierre el modal
      >
        <img
          src={image}
          alt="Imagen ampliada"
          className="object-contain max-w-full max-h-full"
        />
        <button
          className="absolute top-2 right-2 text-white bg-red-500 rounded-full w-8 h-8 flex items-center justify-center"
          onClick={onClose}
        >
          ✕
        </button>
      </div>
    </div>
  );
}
