import React, { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "../Css/Register.module.css";

// URL del backend - ASEGÚRATE DE QUE ESTE CORRIENDO EN ESTE PUERTO
const API_BASE_URL = "http://127.0.0.1:8000";

// Configuración de depuración
const DEBUG_MODE = true; // Cambia a false en producción

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: "error" | "success" | "info"; message: string; details?: any } | null>(null);
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [aceptaPoliticas, setAceptaPoliticas] = useState(false);

  const log = (...args: any[]) => {
    if (DEBUG_MODE) console.log("🔍 [Register Debug]:", ...args);
  };

  const showAlert = (type: "error" | "success" | "info", message: string, details?: any) => {
    setAlert({ type, message, details });
    setTimeout(() => setAlert(null), 8000); // Aumentado para ver detalles
  };

  const validateForm = (): string[] => {
    const errors: string[] = [];
    if (!email.trim() || !password.trim()) errors.push("Debe completar datos obligatorios.");
    // 🎯 CORRECCIÓN: @inacap.cl en lugar de @inacapmail.cl
    if (email.trim() && !email.trim().endsWith("@inacapmail.cl")) {
      errors.push("Debe usar un correo institucional @inacapmail.cl");
    }
    if (password.trim()) {
      if (password.length < 8) errors.push("La contraseña es demasiado corta");
      if (!/[A-Z]/.test(password)) errors.push("Debe contener al menos una mayúscula");
      if (!/\d/.test(password)) errors.push("Debe contener al menos un número");
    }
    if (!aceptaPoliticas) {
      errors.push("Debe aceptar las políticas de uso para continuar.");
    }
    return errors;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setAlert(null);

    log("📝 Validando formulario...", { email, password, aceptaPoliticas });
    const errors = validateForm();
    if (errors.length > 0) {
      log("❌ Errores de validación:", errors);
      showAlert("error", errors.join(" "));
      setLoading(false);
      return;
    }

    log("✅ Validación exitosa. Enviando a backend...", {
      endpoint: `${API_BASE_URL}/api/auth/users/`,
      data: { email, password, acepta_politicas: aceptaPoliticas }
    });

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/auth/users/`,
        { email, password, acepta_politicas: aceptaPoliticas },
        { 
          headers: { "Content-Type": "application/json" },
          withCredentials: true 
        }
      );

      log("✅ Respuesta del backend:", {
        status: response.status,
        data: response.data
      });

      showAlert("success", "Cuenta creada exitosamente. Inicia sesión para continuar.");
      setTimeout(() => navigate("/login"), 2500);
      
    } catch (error: any) {
      log("❌ Error en la petición:", error);
      log("❌ Detalles del error:", {
        message: error.message,
        response: error.response,
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers
      });

      const data = error?.response?.data;
      let errorMsg = "Error al registrar. Intenta nuevamente.";
      let details = "";

      if (error.code === 'ERR_NETWORK') {
        errorMsg = "❌ No se pudo conectar con el backend.";
        details = `Verifica que el servidor esté corriendo en ${API_BASE_URL}`;
      } else if (data?.email?.[0]) {
        errorMsg = data.email[0];
      } else if (data?.password?.[0]) {
        errorMsg = data.password[0];
      } else if (data?.acepta_politicas?.[0]) {
        errorMsg = "Debe aceptar las políticas de uso para continuar.";
      } else if (data?.non_field_errors?.[0]) {
        errorMsg = data.non_field_errors[0];
      } else if (error.response?.status === 400) {
        errorMsg = "Datos inválidos. Verifica el formulario.";
        details = JSON.stringify(data, null, 2);
      } else if (error.response?.status === 500) {
        errorMsg = "Error interno del servidor.";
        details = "Contacta al administrador.";
      }

      showAlert("error", errorMsg, details);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 min-h-screen flex flex-col relative overflow-x-hidden">
      {/* Fondos decorativos - FIXED */}
      <div className="fixed inset-0 bg-[radial-linear(ellipse_at_top,var(--tw-linear-stops))] from-purple-900/20 via-slate-900/50 to-black/80 pointer-events-none"></div>
      <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse pointer-events-none"></div>
      <div className="fixed bottom-1/4 right-1/4 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-1000 pointer-events-none"></div>

      {/* Header */}
      <header className={`relative z-10 ${styles.glassEffect}`}>
        <div className="max-w-7xl mx-auto px-4 py-4 border-b border-purple-500/20">
          <div className="flex items-center justify-between">
            <a href="/" className={`font-['Pacifico'] text-2xl text-primary font-bold ${styles.glowAnimation}`}>Inter-U</a>
            <a href="/login" className="text-slate-300 hover:text-primary transition-colors">Iniciar Sesión</a>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center py-12 px-4 relative z-10">
        <div className={`max-w-md w-full ${styles.fadeInUp}`}>
          {/* Alertas con detalles de debug */}
          {alert && (
            <div className={`mb-4 px-4 py-3 rounded-lg border text-sm ${
              alert.type === "error" 
                ? "bg-red-100 border-red-400 text-red-700" 
                : "bg-green-100 border-green-400 text-green-700"
            }`}>
              <div>{alert.message}</div>
              {DEBUG_MODE && alert.details && (
                <pre className="mt-2 text-xs bg-black/20 p-2 rounded overflow-auto">
                  {typeof alert.details === 'string' ? alert.details : JSON.stringify(alert.details, null, 2)}
                </pre>
              )}
            </div>
          )}

          {/* Icono */}
          <div className="text-center mb-8">
            <div className={styles.floatAnimation}>
              <div className={`w-20 h-20 mx-auto mb-6 bg-linear-to-r from-primary to-purple-600 rounded-full flex items-center justify-center ${styles.glowAnimation}`}>
                <i className="ri-user-add-line text-white text-2xl"></i>
              </div>
            </div>
            <h2 className="text-3xl font-bold mb-2 bg-linear-to-r from-white to-slate-300 bg-clip-text text-transparent">
              Crear Cuenta
            </h2>
            <p className="text-slate-400">Regístrate con tu correo institucional @inacapmail.cl</p>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className={`rounded-xl p-8 ${styles.glassEffect} ${styles.glowAnimation}`}>
            <div className="space-y-6">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">Correo Electrónico *</label>
                <div className="relative">
                  <i className="ri-mail-line absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"></i>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`block w-full pl-10 pr-3 py-3 bg-slate-800/50 border border-slate-600/50 rounded-lg text-sm text-white placeholder-slate-400 transition-all duration-300 ${styles.inputGlow}`}
                    placeholder="usuario@inacapmail.cl"
                  />
                </div>
              </div>

              {/* Contraseña */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">Contraseña *</label>
                <div className="relative">
                  <i className="ri-lock-line absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"></i>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`block w-full pl-10 pr-3 py-3 bg-slate-800/50 border border-slate-600/50 rounded-lg text-sm text-white placeholder-slate-400 transition-all duration-300 ${styles.inputGlow}`}
                    placeholder="Mínimo 8 caracteres, una mayúscula y un número"
                  />
                </div>
                <p className="mt-1 text-xs text-slate-400">Mínimo 8 caracteres, al menos una mayúscula y un número</p>
              </div>

              {/* Políticas - SIMPLIFICADO Y 100% FUNCIONAL */}
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="acepta_politicas"
                  checked={aceptaPoliticas}
                  onChange={(e) => setAceptaPoliticas(e.target.checked)}
                  className="mt-1 w-4 h-4 text-primary bg-slate-700 border-slate-500 rounded focus:ring-2 focus:ring-primary"
                />
                <label htmlFor="acepta_politicas" className="text-sm text-slate-300 cursor-pointer select-none">
                  Acepto las políticas de uso y responsabilidad *
                </label>
              </div>

              {/* Botón */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full bg-linear-to-r from-primary to-purple-600 text-white py-3 rounded-lg font-medium hover:bg-linear-to-r hover:from-purple-600 hover:to-primary transition-all duration-300 transform hover:scale-105 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${styles.glowAnimation}`}
              >
                <span className="flex items-center justify-center space-x-2">
                  <span>{loading ? "Procesando..." : "Registrarse"}</span>
                  {loading ? <i className="ri-loader-4-line animate-spin"></i> : <i className="ri-arrow-right-line"></i>}
                </span>
              </button>
            </div>
          </form>

          {/* Enlace a login */}
          <div className="mt-6 text-center">
            <p className="text-sm text-slate-400">¿Ya tienes una cuenta?</p>
            <a href="/login" className="inline-flex items-center space-x-2 text-primary hover:text-purple-400 font-medium transition-all duration-300 mt-2">
              <span>Inicia sesión aquí</span>
              <i className="ri-external-link-line text-xs"></i>
            </a>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className={`border-t border-purple-500/20 py-6 relative z-10 ${styles.glassEffect}`}>
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-slate-400">
          <p>&copy; 2025 Inter-U. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default Register;