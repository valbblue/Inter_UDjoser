import React, { useState } from 'react';
import { View, Text, TextInput, Alert, Switch, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [aceptaPoliticas, setAceptaPoliticas] = useState(false);
  const router = useRouter();

  const BASE_URL = 'http://10.193.36.235:8000';

  const handleRegister = async () => {
    if (!aceptaPoliticas) {
      Alert.alert('Aviso', 'Debes aceptar las políticas para continuar.');
      return;
    }

    try {
      const response = await axios.post(`${BASE_URL}/api/auth/users/`, {
        email,
        password,
        acepta_politicas: aceptaPoliticas,
      });

      if (response.status === 201) {
        Alert.alert('Registro exitoso');
        setEmail('');
        setPassword('');
        setAceptaPoliticas(false);
      }
    } catch (error: any) {
      Alert.alert('Error', 'No se pudo registrar. Verifica los datos.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Botón de retroceso */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>←</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Crear Cuenta</Text>

      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        placeholderTextColor="#bbb"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        placeholderTextColor="#bbb"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <View style={styles.switchContainer}>
        <Switch value={aceptaPoliticas} onValueChange={setAceptaPoliticas} />
        <Text style={styles.switchLabel}>Acepto las políticas de uso</Text>
      </View>

      <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
        <Text style={styles.registerButtonText}>Registrarse</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A0736',
    padding: 24,
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    backgroundColor: '#6542F4',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  backButtonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#2B1654',
    borderWidth: 1,
    borderColor: '#6542F4',
    padding: 14,
    marginBottom: 16,
    borderRadius: 10,
    color: 'white',
    fontSize: 16,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  switchLabel: {
    marginLeft: 8,
    fontSize: 16,
    color: 'white',
  },
  registerButton: {
    backgroundColor: '#6C63FF',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  registerButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
