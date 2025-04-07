import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import localStorageService from '../../../lib/localStorage';
import { useState, useEffect } from 'react';
import { Check, ImagePlus, Trash2 } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';

type Note = {
  id: string;
  title: string;
  content: string;
  tags: string[];
  imageUri?: string;
  createdAt: number;
};

export default function EditNoteScreen() {
  const { id } = useLocalSearchParams();
  const [note, setNote] = useState<Note | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const router = useRouter();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: '#f8fafc',
    },
    section: {
      marginBottom: 24,
      backgroundColor: 'white',
      borderRadius: 12,
      padding: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 2,
    },
    titleInput: {
      fontSize: 24,
      fontWeight: '600',
      color: '#0f172a',
    },
    contentInput: {
      fontSize: 16,
      lineHeight: 24,
      color: '#334155',
      minHeight: 200,
    },
    imagePreview: {
      width: '100%',
      height: 200,
      borderRadius: 12,
      marginBottom: 16,
    },
    imageActions: {
      flexDirection: 'row',
      gap: 12,
    },
    imageButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      padding: 12,
      borderWidth: 1,
      borderColor: '#e0e7ff',
      borderRadius: 12,
    },
    imageButtonText: {
      color: '#6366f1',
      fontWeight: '500',
    },
    removeButton: {
      borderColor: '#fee2e2',
    },
    removeButtonText: {
      color: '#ef4444',
    },
    addImageButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      padding: 16,
      borderWidth: 1,
      borderColor: '#e0e7ff',
      borderRadius: 12,
    },
    addImageText: {
      color: '#6366f1',
      fontWeight: '500',
      fontSize: 16,
    },
    submitButton: {
      backgroundColor: '#6366f1',
      padding: 16,
      borderRadius: 12,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 8,
    },
    submitButtonText: {
      color: 'white',
      fontWeight: '600',
      fontSize: 16,
    },
  });

  useEffect(() => {
    const loadNote = async () => {
      const notes = await localStorageService.getNotes();
      const foundNote = notes.find(n => n.id === id);
      if (foundNote) {
        setNote(foundNote);
        setTitle(foundNote.title);
        setContent(foundNote.content);
        setImageUri(foundNote.imageUri || null);
      }
    };
    loadNote();
  }, [id]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const removeImage = () => {
    setImageUri(null);
  };

  const handleUpdate = async () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      await localStorageService.updateNote(id as string, { 
        title, 
        content,
        imageUri: imageUri || undefined
      });
      router.back();
    } catch (error) {
      Alert.alert('Error', 'Failed to update note');
      console.error('Update error:', error);
    }
  };

  if (!note) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <TextInput
          style={styles.titleInput}
          placeholder="Note title..."
          value={title}
          onChangeText={setTitle}
        />
      </View>

      <View style={styles.section}>
        <TextInput
          style={styles.contentInput}
          placeholder="Note content..."
          value={content}
          onChangeText={setContent}
          multiline
        />
      </View>

      <View style={styles.section}>
        {imageUri ? (
          <>
            <Image source={{ uri: imageUri }} style={styles.imagePreview} />
            <View style={styles.imageActions}>
              <TouchableOpacity 
                style={styles.imageButton}
                onPress={pickImage}
              >
                <ImagePlus size={20} color="#6366f1" />
                <Text style={styles.imageButtonText}>Change Image</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.imageButton, styles.removeButton]}
                onPress={removeImage}
              >
                <Trash2 size={20} color="#ef4444" />
                <Text style={[styles.imageButtonText, styles.removeButtonText]}>Remove Image</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <TouchableOpacity 
            style={styles.addImageButton}
            onPress={pickImage}
          >
            <ImagePlus size={24} color="#6366f1" />
            <Text style={styles.addImageText}>Add Image</Text>
          </TouchableOpacity>
        )}
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleUpdate}>
        <Text style={styles.submitButtonText}>Update Note</Text>
        <Check size={20} color="white" />
      </TouchableOpacity>
    </View>
  );
}
