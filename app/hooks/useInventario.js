import { useEffect, useState } from "react";
import Swal from "sweetalert2";

/**
 * Hook para manejar la lógica de negocio de la sección de inventario.
 *
 * Este hook provee las siguientes funciones y variables:
 * - `productos`: Un array de productos.
 * - `categorias`: Un array de categorías.
 * - `proveedores`: Un array de proveedores.
 * - `selectedProducto`: El producto seleccionado.
 * - `formData`: Un objeto con los datos del formulario de productos.
 * - `file`: El archivo seleccionado.
 * - `searchTerm`: El término de búsqueda.
 * - `modalVisible`: Un booleano que indica si el modal de edición de productos está visible.
 * - `handleOpenModal`: Función para abrir el modal de edición.
 * - `handleAddOrUpdateProducto`: Función para registrar o actualizar un producto.
 * - `handleEditProducto`: Función para editar un producto.
 * - `handleDeleteProducto`: Función para eliminar un producto.
 * - `filteredProductos`: Un array de productos filtrados según el término de búsqueda.
 *
 *? @return {Object} Un objeto con las variables y funciones mencionadas.
 */
export default function useInventario() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [selectedProducto, setSelectedProducto] = useState(null);
  const [formData, setFormData] = useState({
    nombre_producto: "",
    categoria_producto: "",
    pvp_producto: "",
    costo_producto: "",
    cantidad_producto: "",
    minimo_producto: "",
    maximo_producto: "",
    sucursal_producto: 1,
    estado_producto: "Disponible",
    descripcion_producto: "",
    marca_producto: "",
    imagen_producto: "",
    proveedores_producto: [],
    ultima_venta_producto: null,
  });
  const [file, setFile] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchProductos();
    fetchCategorias();
    fetchProveedores();
  }, []);

  /**
   * Fetches the list of products from the API and updates the state.
   *
   * Hace una petición GET a la ruta `/api/producto/` de la API y establece
   * el estado `productos` con los datos de la respuesta.
   */

  const fetchProductos = async () => {
    const res = await fetch("http://127.0.0.1:8000/api/producto/");
    const data = await res.json();
    setProductos(data);
  };

  /**
   * Fetches the list of categories from the API and sets the state.
   *
   * Hace una petición GET a la ruta `/api/categoria/` de la API y establece
   * el estado `categorias` con los datos de la respuesta.
   */
  const fetchCategorias = async () => {
    const res = await fetch("http://127.0.0.1:8000/api/categoria/");
    const data = await res.json();
    setCategorias(data);
  };

  /**
   * Fetches the list of providers from the API and updates the state.
   *
   * Hace una petición GET a la ruta `/api/proveedor/` de la API y establece
   * el estado `proveedores` con los datos de la respuesta.
   */
  const fetchProveedores = async () => {
    const res = await fetch("http://127.0.0.1:8000/api/proveedor/");
    const data = await res.json();
    setProveedores(data);
  };

  /**
   * Restablece el formulario de productos a sus valores iniciales.
   *
   * Esta función establece el estado del formulario `formData` y el archivo `file`
   * a sus valores predeterminados, limpiando todos los campos del formulario de
   * productos y configurando el archivo a `null`.
   */

  const resetForm = () => {
    setFormData({
      nombre_producto: "",
      categoria_producto: "",
      pvp_producto: "",
      costo_producto: "",
      cantidad_producto: "",
      minimo_producto: "",
      maximo_producto: "",
      sucursal_producto: 1,
      estado_producto: "Disponible",
      descripcion_producto: "",
      marca_producto: "",
      imagen_producto: "",
      proveedores_producto: [],
      ultima_venta_producto: null,
    });
    setFile(null);
  };

  /**
   * Sube una imagen a Cloudinary y retorna la URL segura de la imagen.
   *
   * Si no hay un archivo seleccionado, retorna la URL de la imagen existente en
   * el formulario.
   *
   * Este método utiliza las credenciales de Cloudinary configuradas en las
   * variables de entorno `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` y
   * `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`.
   *
   *? @return {Promise<string>} La URL segura de la imagen subida a Cloudinary.
   */

  const uploadImageToCloudinary = async () => {
    if (!file) return formData.imagen_producto;
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    const cloudData = new FormData();
    cloudData.append("file", file);
    cloudData.append("upload_preset", uploadPreset);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: cloudData,
      }
    );
    const data = await res.json();
    return data.secure_url;
  };

  /**
   * Agrega o actualiza un producto en la base de datos.
   *
   * Si selectedProducto es null, se crea un nuevo producto. De lo contrario, se
   * actualiza el producto existente.
   *
   * Este método utiliza las credenciales de la API configuradas en las variables
   * de entorno `NEXT_PUBLIC_API_URL` y `NEXT_PUBLIC_API_KEY`.
   *
   * Si el producto se agrega o actualiza correctamente, se muestra un mensaje de
   * confirmación y se cierra el modal de edición. También se resetea el formulario
   * y se vuelve a cargar el listado de productos.
   *
   * Si ocurre un error al guardar el producto, se muestra un mensaje de error con
   * la descripción del error.
   *
   *? @return {Promise<void>} Nada.
   */
  const handleAddOrUpdateProducto = async () => {
    const imageUrl = await uploadImageToCloudinary();
    const payload = {
      ...formData,
      imagen_producto: imageUrl,
      categoria_producto: parseInt(formData.categoria_producto) || null,
      ultima_venta_producto: formData.ultima_venta_producto || null,
    };

    delete payload.id;

    const method = selectedProducto ? "PUT" : "POST";
    const url = selectedProducto
      ? `http://127.0.0.1:8000/api/producto/${selectedProducto.id}/`
      : "http://127.0.0.1:8000/api/producto/";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      Swal.fire({
        icon: "success",
        title: selectedProducto ? "Producto actualizado" : "Producto creado",
        showConfirmButton: false,
        timer: 1500,
      });
      const productoData = selectedProducto || (await res.json());
      await handleProductProveedoresRelation(
        productoData.id,
        formData.proveedores_producto
      );
      fetchProductos();
      setModalVisible(false);
      setSelectedProducto(null);
      resetForm();
    } else {
      const errorData = await res.json();
      console.error(errorData);
      Swal.fire({
        icon: "error",
        title: "Error al guardar el producto",
        text: "Verifica los datos e intenta nuevamente.",
      });
    }
  };

  /**
   * Agrega o actualiza las relaciones entre un producto y sus proveedores.
   *
   * Este método utiliza la API de la tienda para agregar o actualizar las
   * relaciones entre un producto y sus proveedores. El costo del producto para
   * cada proveedor se establece en el costo del producto ingresado en el
   * formulario.
   *
   * Si ocurre un error al guardar las relaciones, se muestra un mensaje de
   * error con la descripción del error.
   *
   *? @param {number} productoId - El ID del producto.
   *? @param {number[]} proveedoresList - Un array de IDs de proveedores.
   *? @return {Promise<void>} Nada.
   */
  const handleProductProveedoresRelation = async (
    productoId,
    proveedoresList
  ) => {
    for (const proveedorId of proveedoresList) {
      const relation = {
        producto_productoProveedor: parseInt(productoId, 10),
        proveedor_productoProveedor: parseInt(proveedorId, 10),
        costo_productoProveedor: parseFloat(formData.costo_producto)
          .toFixed(2)
          .toString(),
      };

      await fetch("http://127.0.0.1:8000/api/productoproveedor/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(relation),
      });
    }
  };

  /**
   * Maneja la edición de un producto.
   *
   * Esta función establece el producto seleccionado para la edición y actualiza
   * el estado del formulario con los datos del producto proporcionado. También
   * abre el modal de edición.
   *
   *? @param {object} producto - El objeto que representa el producto a editar.
   */

  const handleEditProducto = (producto) => {
    setSelectedProducto(producto);
    setFormData({
      ...producto,
      categoria_producto:
        producto.categoria_producto?.id || producto.categoria_producto || "",
      proveedores_producto: producto.proveedores_producto || [],
    });
    setModalVisible(true);
  };

  /**
   * Maneja la eliminación de un producto.
   *
   * Esta función pide confirmación al usuario antes de eliminar el producto.
   * Si el usuario confirma, se elimina el producto utilizando la API de la
   * tienda y se muestra un mensaje de confirmación. Si el usuario cancela, no
   * se realiza ninguna acción.
   *
   * Si ocurre un error al eliminar el producto, se muestra un mensaje de
   * error con la descripción del error.
   *
   *? @param {number} id - El ID del producto a eliminar.
   *? @return {Promise<void>} Nada.
   */
  const handleDeleteProducto = async (id) => {
    const confirmResult = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará el producto permanentemente.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#712b39",
      cancelButtonColor: "#aaa",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      customClass: {
        popup: "rounded-lg",
      },
    });

    if (confirmResult.isConfirmed) {
      const res = await fetch(`http://127.0.0.1:8000/api/producto/${id}/`, {
        method: "DELETE",
      });

      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: "Eliminado",
          text: "Producto eliminado correctamente.",
          confirmButtonColor: "#712b39",
        });
        fetchProductos();
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo eliminar el producto.",
          confirmButtonColor: "#712b39",
        });
      }
    }
  };

  /**
   * Abre el modal de creación o edición de un producto.
   *
   * Esta función se llama cuando se hace clic en el botón "Agregar Producto" o
   * en el botón "Editar" de una tarjeta de producto. Establece el producto
   * seleccionado en null para que el formulario se muestre en modo de
   * creación, y abre el modal.
   */
  const handleOpenModal = () => {
    setSelectedProducto(null);
    resetForm();
    setModalVisible(true);
  };

  const filteredProductos = productos.filter((p) =>
    p.nombre_producto?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return {
    productos,
    categorias,
    proveedores,
    selectedProducto,
    formData,
    setFormData,
    file,
    setFile,
    modalVisible,
    setModalVisible,
    searchTerm,
    setSearchTerm,
    handleOpenModal,
    handleAddOrUpdateProducto,
    handleEditProducto,
    handleDeleteProducto,
    filteredProductos,
  };
}
