import { useState, useEffect } from "react";
import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000";
const DEBUG_MODE = true;

const log = (...args: any[]) => {
  if (DEBUG_MODE) console.log("[Profile Debug]:", ...args);
};

export interface PerfilData {
  id_perfil?: number;
  alias: string;
  nombre: string;
  apellido: string;
  carrera: string;
  area: string;
  biografia: string;
  foto: string;
  habilidades_ofrecidas: string[];
}

export interface UserData {
  email: string;
  acepta_politicas: boolean;
  is_estudiante: boolean;
  is_admin_interu: boolean;
}

export const useProfile = () => {
  const [perfil, setPerfil] = useState<PerfilData | null>(null);
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("accessToken");
    if (!token) throw new Error("No hay token de autenticación");
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  };

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const headers = getAuthHeaders();
      
      // Obtener perfil (get_or_create)
      const perfilRes = await axios.get(`${API_BASE_URL}/api/perfil/`, { headers });
      log("Perfil recibido:", perfilRes.data);
      setPerfil(perfilRes.data);

      // Obtener datos del usuario actual
      const userRes = await axios.get(`${API_BASE_URL}/api/auth/users/me/`, { headers });
      log("User data:", userRes.data);
      setUser(userRes.data);

    } catch (err: any) {
      log("Error fetching profile:", err.response?.data || err.message);
      setError(err.response?.data?.detail || "Error al cargar el perfil");
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (data: Partial<PerfilData>) => {
    try {
      setLoading(true);
      const headers = getAuthHeaders();
      const response = await axios.patch(`${API_BASE_URL}/api/perfil/`, data, { headers });
      log("Perfil actualizado:", response.data);
      setPerfil(response.data);
      return { success: true, data: response.data };
    } catch (err: any) {
      log("Error updating profile:", err.response?.data || err.message);
      throw new Error(err.response?.data?.detail || "Error al actualizar perfil");
    } finally {
      setLoading(false);
    }
  };

  const deleteAccount = async (password: string) => {
    try {
      const headers = getAuthHeaders();
      const response = await axios.delete(
        `${API_BASE_URL}/api/perfil/eliminar/`,
        {
          headers,
          data: { password },
        }
      );
      log("Cuenta eliminada:", response.data);
      return { success: true };
    } catch (err: any) {
      log("Error deleting account:", err.response?.data || err.message);
      throw new Error(err.response?.data?.password?.[0] || "Contraseña incorrecta");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return {
    perfil,
    user,
    loading,
    error,
    updateProfile,
    deleteAccount,
    refetch: fetchProfile,
  };
};