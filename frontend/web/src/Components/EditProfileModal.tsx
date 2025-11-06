import { useState } from "react";
import type { PerfilData } from "../Hooks/useProfile";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  perfil: PerfilData | null;
  onSave: (data: Partial<PerfilData>) => Promise<void>;
}

const EditProfileModal: React.FC<Props> = ({ isOpen, onClose, perfil, onSave }) => {
  const [formData, setFormData] = useState<Partial<PerfilData>>({
    nombre: perfil?.nombre || "",
    apellido: perfil?.apellido || "",
    alias: perfil?.alias || "",
    carrera: perfil?.carrera || "",
    area: perfil?.area || "",
    biografia: perfil?.biografia || "",
    foto: perfil?.foto || "",
    habilidades_ofrecidas: perfil?.habilidades_ofrecidas || [],
  });

  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave(formData);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-xl rounded-xl bg-slate-800/50 border border-purple-500/20 shadow-2xl overflow-hidden">
        
        {/* Header con botón X */}
        <div className="flex justify-between items-center p-6 border-b border-slate-600/30">
          <h2 className="text-xl font-bold text-purple-100">Editar Perfil</h2>
          <button 
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-red-600/20 text-red-400 hover:bg-red-600/40 transition-all"
            aria-label="Cerrar"
          >
            <i className="ri-close-line text-xl"></i>
          </button>
        </div>

        {/* Formulario scrollable */}
        <form onSubmit={handleSubmit} className="p-6 max-h-96 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Nombre *</label>
              <input
                type="text"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600/50 rounded-lg text-sm text-white focus:border-purple-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Apellido *</label>
              <input
                type="text"
                value={formData.apellido}
                onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
                className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600/50 rounded-lg text-sm text-white focus:border-purple-500 focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-slate-300 mb-1">Alias (público)</label>
            <input
              type="text"
              value={formData.alias}
              onChange={(e) => setFormData({ ...formData, alias: e.target.value })}
              className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600/50 rounded-lg text-sm text-white focus:border-purple-500 focus:outline-none"
              placeholder="Nombre que otros verán"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Carrera *</label>
              <select
                value={formData.carrera}
                onChange={(e) => setFormData({ ...formData, carrera: e.target.value })}
                className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600/50 rounded-lg text-sm text-white focus:border-purple-500 focus:outline-none"
                required
              >
                <option value="">Selecciona tu carrera</option>
                <option value="Ingeniería en Informática">Ingeniería en Informática</option>
                <option value="Ingeniería en Conectividad y Redes">Ingeniería en Conectividad y Redes</option>
                <option value="Ingeniería en Automatización">Ingeniería en Automatización</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Área *</label>
              <select
                value={formData.area}
                onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600/50 rounded-lg text-sm text-white focus:border-purple-500 focus:outline-none"
                required
              >
                <option value="">Selecciona tu área</option>
                <option value="Desarrollo de Software">Desarrollo de Software</option>
                <option value="Redes y Telecomunicaciones">Redes y Telecomunicaciones</option>
                <option value="Automatización Industrial">Automatización Industrial</option>
              </select>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-slate-300 mb-1">Biografía</label>
            <textarea
              value={formData.biografia}
              onChange={(e) => setFormData({ ...formData, biografia: e.target.value })}
              className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600/50 rounded-lg text-sm text-white focus:border-purple-500 focus:outline-none"
              rows={3}
              placeholder="Cuéntanos sobre ti..."
            />
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-slate-300 mb-1">URL de Foto</label>
            <input
              type="url"
              value={formData.foto}
              onChange={(e) => setFormData({ ...formData, foto: e.target.value })}
              className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600/50 rounded-lg text-sm text-white focus:border-purple-500 focus:outline-none"
              placeholder="https://ejemplo.com/foto.jpg"
            />
          </div>

          {/* Botones */}
          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-slate-600 rounded-lg text-slate-300 hover:bg-slate-700/50 transition-all text-sm"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-4 py-2 bg-linear-to-r from-primary to-purple-600 rounded-lg text-white font-medium hover:from-purple-600 hover:to-primary transition-all disabled:opacity-50 text-sm"
            >
              {saving ? "Guardando..." : "Guardar Cambios"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;