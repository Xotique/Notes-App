import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import localStorageService from '../../lib/localStorage';
import { Plus } from 'lucide-react-native';

export default function NewTagScreen() {
  const [tagName, setTagName] = useState('');
  const router = useRouter();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: '#f8fafc',
    },
    title: {
      fontSize: 24,
      fontWeight: '600',
      color: '#0f172a',
      marginBottom: 20,
    },
    input: {
      backgroundColor: 'white',
      padding: 15,
      borderRadius: 10,
      marginBottom: 20,
      fontSize: 16,
    },
    createButton: {
      backgroundColor: '#6366f1',
      padding: 15,
      borderRadius: 10,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    createButtonText: {
      color: 'white',
      fontSize: 16,
      marginLeft: 10,
    },
  });

  const handleCreateTag = async () => {
    if (!tagName.trim()) {
      Alert.alert('Error', 'Please enter a tag name');
      return;
    }

    try {
      await localStorageService.addCategory(tagName);
      router.back();
    } catch (error) {
      Alert.alert('Error', 'Failed to create tag');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create New Tag</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter tag name..."
        value={tagName}
        onChangeText={setTagName}
        placeholderTextColor="#94a3b8"
      />
      <TouchableOpacity 
        style={styles.createButton}
        onPress={handleCreateTag}
      >
        <Plus size={20} color="white" />
        <Text style={styles.createButtonText}>Create Tag</Text>
      </TouchableOpacity>
    </View>
  );
}
