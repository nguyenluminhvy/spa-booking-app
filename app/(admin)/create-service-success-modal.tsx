import {View, Text, StyleSheet, Pressable, TouchableOpacity} from 'react-native';
import { useRouter } from 'expo-router';
import {Ionicons} from "@expo/vector-icons";
import React from "react";

export default function CreateServiceSuccessModalScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Pressable
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.modalCard}>
        <View style={{
          backgroundColor: 'rgba(0,110,233,0.06)',
          width: 80,
          height: 80,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 50,
        }}>
          <View style={{
            backgroundColor: 'white',
            width: 40,
            height: 40,
            borderRadius: 50,
            position: 'absolute'
          }}/>

          <Ionicons name="checkmark-circle" size={60} color="#006EE9"
                    style={{}}
          />


        </View>
        <Text style={styles.modalTitle}>Create Service Successfully!</Text>

        <TouchableOpacity
          style={{
            backgroundColor: '#006EE9',
            height: 40,
            width: 200,
            paddingHorizontal: 16,
            marginTop: 16,
            borderRadius: 12,
          }}
          onPress={() => router.dismissTo('/(admin)/(tabs)/services')}
        >
          <Text style={styles.cancel}>Go to Services</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black backdrop
  },
  modalCard: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    paddingVertical: 32,
    borderRadius: 10,
    elevation: 5, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 12,
    color: '#006EE9'
  },
  modalMessage: {
    fontSize: 14,
    paddingHorizontal: 40,
    textAlign: 'center',
    marginBottom: 12,
  },

  cancel: {
    textAlign: 'center',
    marginTop: 12,
    color: 'white',
  },
});
