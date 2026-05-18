import 'react-native-url-polyfill/auto'
import React, { useEffect } from 'react';
import { useRouter, useSegments, Slot } from 'expo-router';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { AuthContextProvider, useAuth } from '../hooks/AuthContext';
import { ProductContextProvider } from '../hooks/ProductContext';
import { PharmacyContextProvider } from '../hooks/PharmacyContext';
import { SupabaseContextProvider } from '../hooks/SupabaseContext';

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

  const currentSegment = segments[0] ?? '';
  const isLoginRoute = currentSegment === 'login';

  useEffect(() => {
    if (!isLoading) {
      if (user !== null && isLoginRoute) {
        router.replace('/');
      } else if (user === null && !isLoginRoute) {
        router.replace('/login');
      }
    }
  }, [isLoading, user, isLoginRoute, router]);

  const shouldRenderSlot = !isLoading && (user !== null || isLoginRoute);

  if (!shouldRenderSlot) {
    return (
      <View style={styles.container}>
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Slot />
    </View>
  );
};

const RootLayout = () => {
  return (
    <SupabaseContextProvider>
      <AuthContextProvider>
        <ProductContextProvider>
          <PharmacyContextProvider>
            <RootLayoutInner />
          </PharmacyContextProvider>
        </ProductContextProvider>
      </AuthContextProvider>
    </SupabaseContextProvider>
  );
};

export default RootLayout;
