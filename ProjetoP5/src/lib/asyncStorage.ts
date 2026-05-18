import AsyncStorage from '@react-native-async-storage/async-storage';

export default AsyncStorage;

export async function saveJSON(key: string, value: unknown) {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn('AsyncStorage saveJSON error', e);
  }
}

export async function loadJSON<T = any>(key: string): Promise<T | null> {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch (e) {
    console.warn('AsyncStorage loadJSON error', e);
    return null;
  }
}
