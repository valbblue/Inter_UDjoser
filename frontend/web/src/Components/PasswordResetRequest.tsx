import { useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import styles from "../Css/Login.module.css";

const API_BASE_URL = "http://127.0.0.1:8000";
const DEBUG_MODE = false;

const log = (...args: any[]) => {
  if (DEBUG_MODE) console.log("[Reset Debug]:", ...args);
};

const PasswordResetRequest: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: "error" | "success"; message: string } | null>(null);

  const showAlert = (type: "error" | "success", message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 5000);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAlert(null);

    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/auth/users/reset_password/`,
        { email },
        { headers: { "Content-Type": "application/json" } }
      );
      log("Reset request OK:", res.data);
      showAlert("success", "Enlace enviado. Revisa la consola de Django.");
      setTimeout(() => navigate("/login"), 3000);
    } catch (err: any) {
      log("Reset request error:", err.response?.data);
      showAlert("error", err.response?.data?.email?.[0] || "Email inválido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 min-h-screen flex flex-col relative overflow-x-hidden">
      <div className="fixed inset-0 bg-[radial-linear(ellipse_at_top,var(--tw-linear-stops))] from-purple-900/20 via-slate-900/50 to-black/80 pointer-events-none" />
      <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse pointer-events-none" />
      <div className="fixed bottom-1/4 right-1/4 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-1000 pointer-events-none" />
      
      <header className={`relative z-10 ${styles.glassEffect}`}>
        <div className="max-w-7xl mx-auto px-4 py-4 border-b border-purple-500/20">
          <div className="flex items-center justify-between">
            <Link to="/" className="font-['Pacifico'] text-2xl text-primary font-bold">Inter-U</Link>
            <Link to="/login" className="text-slate-300 hover:text-primary transition-colors">Volver</Link>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center py-12 px-4 relative z-10">
        <div className="max-w-md w-full">
          {alert && (
            <div className={`mb-4 px-4 py-3 rounded-lg border text-sm backdrop-blur-md ${
              alert.type === "error" ? "bg-red-100 border-red-400 text-red-700" : "bg-green-100 border-green-400 text-green-700"
            }`}>
              <div className="font-medium">{alert.message}</div>
            </div>
          )}

          <div className="text-center mb-8">
            <div className={styles.floatAnimation}>
              <div className={`w-20 h-20 mx-auto mb-6 bg-linear-to-r from-primary to-purple-600 rounded-full flex items-center justify-center ${styles.glowAnimation}`}>
                <i className="ri-lock-password-line text-white text-2xl"></i>
              </div>
            </div>
            <h2 className="text-3xl font-bold mb-2 bg-linear-to-r from-white to-slate-300 bg-clip-text text-transparent">
              Recuperar Contraseña
            </h2>
            <p className="text-slate-400">Ingresa tu email institucional</p>
          </div>

          <form onSubmit={handleSubmit} className={`rounded-xl p-8 ${styles.glassEffect} ${styles.glowAnimation}`}>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Correo Electrónico *</label>
                <div className="relative">
                  <i className="ri-mail-line absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3 py-3 bg-slate-800/50 border border-slate-600/50 rounded-lg text-sm text-white focus:border-purple-500 focus:outline-none"
                    placeholder="usuario@inacapmail.cl"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full bg-linear-to-r from-primary to-purple-600 text-white py-3 rounded-lg font-medium hover:from-purple-600 hover:to-primary transition-all disabled:opacity-50 ${styles.glowAnimation}`}
              >
                <span className="flex items-center justify-center space-x-2">
                  <span>{loading ? "Enviando..." : "Enviar enlace de recuperación"}</span>
                  {loading && <i className="ri-loader-4-line animate-spin"></i>}
                </span>
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default PasswordResetRequest;