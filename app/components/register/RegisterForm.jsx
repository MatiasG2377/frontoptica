/**
 * Componente que renderiza un formulario para registrar un nuevo usuario.
 *
 * Este formulario contiene campos para ingresar el nombre de usuario, correo electrónico,
 * contraseña, nombre, apellido, teléfono, rol de usuario y sucursal.
 *
 * Props:
 * - `username`: El nombre de usuario.
 * - `setUsername`: Función para actualizar el nombre de usuario.
 * - `email`: El correo electrónico.
 * - `setEmail`: Función para actualizar el correo electrónico.
 * - `password`: La contraseña.
 * - `setPassword`: Función para actualizar la contraseña.
 * - `nombreUsuario`: El nombre del usuario.
 * - `setNombreUsuario`: Función para actualizar el nombre del usuario.
 * - `apellidoUsuario`: El apellido del usuario.
 * - `setApellidoUsuario`: Función para actualizar el apellido del usuario.
 * - `telefonoUsuario`: El teléfono del usuario.
 * - `setTelefonoUsuario`: Función para actualizar el teléfono del usuario.
 * - `rolUsuario`: El rol del usuario.
 * - `setRolUsuario`: Función para actualizar el rol del usuario.
 * - `sucursalUsuario`: La sucursal asociada al usuario.
 * - `setSucursalUsuario`: Función para actualizar la sucursal del usuario.
 * - `sucursales`: Lista de sucursales disponibles.
 * - `handleSubmit`: Función para manejar el envío del formulario.
 *
 * El formulario permite seleccionar el rol de usuario y la sucursal desde un menú desplegable
 * y realiza el registro del usuario al enviarse.
 */

export default function RegisterForm({
  username,
  setUsername,
  email,
  setEmail,
  password,
  setPassword,
  nombreUsuario,
  setNombreUsuario,
  apellidoUsuario,
  setApellidoUsuario,
  telefonoUsuario,
  setTelefonoUsuario,
  rolUsuario,
  setRolUsuario,
  sucursalUsuario,
  setSucursalUsuario,
  sucursales,
  handleSubmit,
}) {
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="username"
            className="block text-sm font-medium"
            style={{ color: "#712b39" }}
          >
            Nombre de Usuario
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Ingrese el nombre de usuario"
            className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none"
            required
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium"
            style={{ color: "#712b39" }}
          >
            Correo Electrónico
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Ingrese el correo"
            className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none"
            required
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium"
            style={{ color: "#712b39" }}
          >
            Contraseña
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Ingrese la contraseña"
            className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none"
            required
          />
        </div>

        <div>
          <label
            htmlFor="nombreUsuario"
            className="block text-sm font-medium"
            style={{ color: "#712b39" }}
          >
            Nombre
          </label>
          <input
            id="nombreUsuario"
            type="text"
            value={nombreUsuario}
            onChange={(e) => setNombreUsuario(e.target.value)}
            placeholder="Ingrese el nombre"
            className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none"
          />
        </div>

        <div>
          <label
            htmlFor="apellidoUsuario"
            className="block text-sm font-medium"
            style={{ color: "#712b39" }}
          >
            Apellido
          </label>
          <input
            id="apellidoUsuario"
            type="text"
            value={apellidoUsuario}
            onChange={(e) => setApellidoUsuario(e.target.value)}
            placeholder="Ingrese el apellido"
            className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none"
          />
        </div>

        <div>
          <label
            htmlFor="telefonoUsuario"
            className="block text-sm font-medium"
            style={{ color: "#712b39" }}
          >
            Teléfono
          </label>
          <input
            id="telefonoUsuario"
            type="text"
            value={telefonoUsuario}
            onChange={(e) => setTelefonoUsuario(e.target.value)}
            placeholder="Ingrese el teléfono"
            className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none"
          />
        </div>

        <div>
          <label
            htmlFor="rolUsuario"
            className="block text-sm font-medium"
            style={{ color: "#712b39" }}
          >
            Rol de Usuario
          </label>
          <select
            id="rolUsuario"
            value={rolUsuario}
            onChange={(e) => setRolUsuario(e.target.value)}
            className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none"
          >
            <option value="Administrador">Administrador</option>
            <option value="Gerente">Gerente</option>
            <option value="Usuario">Usuario</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="sucursalUsuario"
            className="block text-sm font-medium"
            style={{ color: "#712b39" }}
          >
            Sucursal
          </label>
          <select
            id="sucursalUsuario"
            value={sucursalUsuario}
            onChange={(e) => setSucursalUsuario(e.target.value)}
            className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none"
          >
            <option value="">Seleccione una sucursal</option>
            {sucursales.map((s) => (
              <option key={s.id} value={s.id}>
                {s.nombre_sucursal}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        type="submit"
        className="w-full py-2 px-4 rounded-lg text-white"
        style={{ backgroundColor: "#712b39" }}
      >
        Registrar Usuario
      </button>
    </form>
  );
}
