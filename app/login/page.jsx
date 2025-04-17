"use client";
import { useLogin } from "../hooks/useLogin";
import LoginForm from "../components/login/LoginForm";

/**
 * Página de inicio de sesión de los empleados.
 *
 * La página tiene un formulario para que los empleados inicien sesión.
 * Los campos del formulario son el nombre de usuario y la contraseña.
 * Al lado derecho de la pantalla hay un botón para acceder al administrador
 * de Django.
 *
 * Si el usuario no existe o la contraseña es incorrecta, se mostrará un
 * mensaje de error.
 *
 *? @return {JSX.Element} La página de inicio de sesión.
 */
export default function LoginPage() {
  const { username, password, setUsername, setPassword, handleSubmit } =
    useLogin();
  /**
   * Redirige al usuario a la página de inicio de sesión de Django.
   *
   *? @function
   */
  const redirectToAdminLogin = () => {
    window.location.href = "http://localhost:8000/admin/login/?next=/admin/";
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 relative">
      <button
        onClick={redirectToAdminLogin}
        className="absolute top-4 right-4 px-4 py-2 text-sm rounded-lg transition border-2 border-[#712b39] text-[#712b39] hover:bg-[#712b39] hover:text-white"
      >
        Acceso Administrador
      </button>

      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-sm">
        <div className="flex justify-center mb-6">
          <img src="/img/logo.webp" alt="Logo de la empresa" className="h-16" />
        </div>
        <h1 className="text-2xl font-bold mb-6 text-center text-[#712b39]">
          Iniciar Sesión
        </h1>

        <LoginForm
          username={username}
          password={password}
          setUsername={setUsername}
          setPassword={setPassword}
          handleSubmit={handleSubmit}
        />

        <p className="text-sm text-center text-gray-600 mt-4">
          ¿Eres un nuevo empleado? Contacta a tu administrador.
        </p>
      </div>
    </div>
  );
}
