import { View, Text, StyleSheet } from 'react-native';

export default function TabsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem-vindo!</Text>
      <Text style={styles.subtitle}>Você está autenticado.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#14838d',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#4d7d7f',
    textAlign: 'center',
  },
});