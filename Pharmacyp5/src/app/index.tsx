import { Redirect } from 'expo-router';

export default function Index() {
  // Redireciona automaticamente a raiz do app para a pasta do painel (drawer)
  // O 'as any' ignora o erro temporário de tipagem do Expo Router
  return <Redirect href={"/(drawer)" as any} />;
}