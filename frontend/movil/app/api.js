// api.js
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'http://10.193.36.235:8000/api'; // Reemplaza con tu IP local

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 🧩 Función para registrar usuario
export const registerUser = async (email, password, aceptaPoliticas) => {
  return await api.post('/auth/users/', {
    email,
    password,
    acepta_politicas: aceptaPoliticas,
  });
};

// 🔐 Función para login
export const loginUser = async (email, password) => {
  const response = await api.post('/auth/jwt/create/', {
    email,
    password,
  });

  const { access, refresh } = response.data;

  await AsyncStorage.setItem('accessToken', access);
  await AsyncStorage.setItem('refreshToken', refresh);

  return access;
};

// 🧪 Función para obtener datos del usuario autenticado
export const getUserInfo = async () => {
  const token = await AsyncStorage.getItem('accessToken');

  const response = await api.get('/auth/users/me/', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

// 🔁 Función para refrescar el token
export const refreshToken = async () => {
  const refresh = await AsyncStorage.getItem('refreshToken');

  const response = await api.post('/auth/jwt/refresh/', {
    refresh,
  });

  const { access } = response.data;
  await AsyncStorage.setItem('accessToken', access);

  return access;
};

// 🚪 Función para cerrar sesión
export const logoutUser = async () => {
  await AsyncStorage.removeItem('accessToken');
  await AsyncStorage.removeItem('refreshToken');
};

export default api;
