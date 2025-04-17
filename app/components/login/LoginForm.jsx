/**
 * Formulario de inicio de sesión.
 *
 * Recibe como props las siguientes funciones y variables:
 * - username: el valor actual del campo de usuario.
 * - password: el valor actual del campo de contraseña.
 * - setUsername: función para cambiar el valor de username.
 * - setPassword: función para cambiar el valor de password.
 * - handleSubmit: función para manejar el envío del formulario.
 *
 * Devuelve un formulario con los campos de usuario y contraseña, y un botón para
 * iniciar sesión.
 */
export default function LoginForm({
  username,
  password,
  setUsername,
  setPassword,
  handleSubmit,
}) {
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="usuario"
          className="block text-sm font-medium text-[#712b39]"
        >
          Usuario
        </label>
        <input
          id="usuario"
          type="text"
          placeholder="Ingresa tu usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
      </div>
      <div>
        <label
          htmlFor="contraseña"
          className="block text-sm font-medium text-[#712b39]"
        >
          Contraseña
        </label>
        <input
          id="contraseña"
          type="password"
          placeholder="Ingresa tu contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
      </div>
      <button
        type="submit"
        className="w-full py-2 px-4 rounded-lg text-white transition"
        style={{ backgroundColor: "#712b39" }}
      >
        Iniciar sesión
      </button>
    </form>
  );
}
