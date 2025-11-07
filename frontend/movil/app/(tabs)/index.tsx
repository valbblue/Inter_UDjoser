import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>𑣲Bienvenido a Inter-U</Text>

      <TouchableOpacity style={styles.primaryButton} onPress={() => router.push('/(stack)/login')}>
        <Text style={styles.primaryButtonText}>Ingresar⊹ ࣪ ˖</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.secondaryButton} onPress={() => router.push('/(stack)/register')}>
        <Text style={styles.secondaryButtonText}>Crear cuenta⊹ ࣪ ˖</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2D0C57', // Morado oscuro
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 40,
  },

  primaryButton: {
    backgroundColor: '#6C63FF', // Morado claro
    paddingVertical: 14,
    paddingHorizontal: 100,
    borderRadius: 10,
    marginBottom: 16,
  },

  primaryButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },

  secondaryButton: {
    backgroundColor: 'white',
    paddingVertical: 14,
    paddingHorizontal: 80,
    borderRadius: 10,
    marginBottom: 30,
  },

  secondaryButtonText: {
    color: '#2D0C57',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
});
