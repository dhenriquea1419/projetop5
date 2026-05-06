import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Text,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../hooks/AuthContext';

export default function LoginScreen() {
  const router = useRouter();
  const { signIn, isLoading, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      alert('Por favor, preencha todos os campos');
      return;
    }

    try {
      const success = await signIn(email, password);
      if (success) {
        router.replace('/');
      }
    } catch {
      // Erro já é exibido pelo alert ou estado
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          {/* Logo/Header */}
          <View style={styles.header}>
<<<<<<< HEAD
            <View style={styles.titleRow}>
              <Text style={styles.symbol}>⚕️</Text>
              <Text style={styles.title}>SapéPharma</Text>
            </View>
=======
            <Text style={styles.title}>Sapé Pharma</Text>
>>>>>>> projetomla
            <Text style={styles.subtitle}>Sistema de Vendas e Controle para Farmácia</Text>
          </View>

          {/* Login Form */}
          <View style={styles.form}>
            {/* Email Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Digite seu email"
                placeholderTextColor="#999"
                value={email}
                onChangeText={setEmail}
                editable={!isLoading}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Senha</Text>
              <View style={styles.passwordInputContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Digite sua senha"
                  placeholderTextColor="#999"
                  value={password}
                  onChangeText={setPassword}
                  editable={!isLoading}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  <Text style={styles.showPasswordButton}>
                    {showPassword ? 'Ocultar' : 'Mostrar'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Error Message */}
            {error && <Text style={styles.errorText}>{error}</Text>}

            {/* Login Button */}
            <TouchableOpacity
              style={[styles.button, isLoading && styles.buttonDisabled]}
              onPress={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Entrar</Text>
              )}
            </TouchableOpacity>

            {/* Demo Credentials */}
            <View style={styles.demoContainer}>
              <Text style={styles.demoTitle}>Credenciais de Teste:</Text>
              <View style={styles.demoItem}>
                <Text style={styles.demoLabel}>Vendedor:</Text>
                <Text style={styles.demoValue}>vendedor@farmacia.com / 123456</Text>
              </View>
              <View style={styles.demoItem}>
                <Text style={styles.demoLabel}>Representante:</Text>
                <Text style={styles.demoValue}>representante@farmacia.com / 123456</Text>
              </View>
              <View style={styles.demoItem}>
                <Text style={styles.demoLabel}>Admin:</Text>
                <Text style={styles.demoValue}>admin@farmacia.com / 123456</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
    backgroundColor: '#ffffff',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  symbol: {
    fontSize: 34,
    marginRight: 10,
    color: '#14838d',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#14838d',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#4d7d7f',
    fontWeight: '500',
  },
  form: {
    backgroundColor: '#f8fcfd',
    borderRadius: 16,
    padding: 26,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d6e7e9',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#0f3a3f',
    backgroundColor: '#ffffff',
  },
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d6e7e9',
    borderRadius: 10,
    backgroundColor: '#ffffff',
    paddingRight: 12,
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
  },
  showPasswordButton: {
    fontSize: 12,
    color: '#14838d',
    fontWeight: '600',
    padding: 4,
  },
  errorText: {
    color: '#d32f2f',
    fontSize: 14,
    marginBottom: 16,
    fontWeight: '500',
  },
  button: {
    backgroundColor: '#14838d',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 24,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  demoContainer: {
    backgroundColor: '#e8f6f7',
    borderRadius: 10,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#14838d',
  },
  demoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0f4f55',
    marginBottom: 12,
  },
  demoItem: {
    marginBottom: 8,
  },
  demoLabel: {
    fontSize: 12,
    color: '#0f4f55',
    fontWeight: '500',
  },
  demoValue: {
    fontSize: 12,
    color: '#424242',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    marginTop: 2,
  },
});