import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import localStorageService from '../lib/localStorage';

export default function PasscodeInput() {
  const [passcode, setPasscode] = useState('');
  const router = useRouter();

  const handleSubmit = async () => {
    if (passcode.length !== 4) {
      Alert.alert('Error', 'Passcode must be 4 digits long');
      return;
    }

    // Save the passcode securely
    await localStorageService.savePasscode(passcode);
    router.push('/'); // Navigate to the main app screen
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter Passcode</Text>
      <TextInput
        style={styles.input}
        placeholder="4-digit passcode"
        value={passcode}
        onChangeText={setPasscode}
        keyboardType="numeric"
        maxLength={4}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f8fafc',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    fontSize: 16,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#6366f1',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});
