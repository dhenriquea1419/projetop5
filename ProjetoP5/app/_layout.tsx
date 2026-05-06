import React, { useEffect } from 'react';
import { useRouter, useSegments, Slot } from 'expo-router';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { AuthContextProvider, useAuth } from '../hooks/AuthContext';
import { ProductContextProvider } from '../hooks/ProductContext';
import { PharmacyContextProvider } from '../hooks/PharmacyContext';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const RootLayoutInner = () => {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (!isLoading) {
      if (user !== null && segments[0] !== '(tabs)') {
        router.replace('/(tabs)');
      } else if (user === null && segments[0] !== 'login') {
        router.replace('/login');
      }
    }
  }, [isLoading, user, segments, router]);

  return (
    <View style={styles.container}>
      <Slot />
      {isLoading && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
    </View>
  );
};

const RootLayout = () => {
  return (
    <AuthContextProvider>
      <ProductContextProvider>
        <PharmacyContextProvider>
          <RootLayoutInner />
        </PharmacyContextProvider>
      </ProductContextProvider>
    </AuthContextProvider>
  );
};

export default RootLayout;
