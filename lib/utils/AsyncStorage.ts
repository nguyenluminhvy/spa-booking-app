import AsyncStorage from '@react-native-async-storage/async-storage'


export const storeStringData = async (key: string, value: string) => {
  try {
    await AsyncStorage.setItem(key, value)
  } catch (e) {}
}

/**
 * Retrieves a string value from AsyncStorage based on the provided key.
 * @param key The key to look up the value in AsyncStorage.
 * @returns The string value corresponding to the key, or null if not found.
 */
export const getStringData = async (key: string) => {
  try {
    // Retrieve the string value from AsyncStorage
    return await AsyncStorage.getItem(key)
  } catch (e) {
    // Handle any errors that occur during retrieval
    console.error('Error retrieving string data:', e)
    return null
  }
}

export const removeStringData = async (key: string) => {
  try {
    await AsyncStorage.removeItem(key)
  } catch (e) {}
}
