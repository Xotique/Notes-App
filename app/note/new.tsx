import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { copyImageToPermanentLocation } from '../../lib/fileUtils';
import { useRouter } from 'expo-router';
import localStorageService from '../../lib/localStorage';
import { useState, useEffect } from 'react';
import { Check, Tag, ImagePlus, Camera, Trash2 } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';

export default function NewNoteScreen() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const loadTags = async () => {
      const tags = await localStorageService.getCategories();
      setAvailableTags(tags);
    };
    loadTags();
  }, []);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: '#f8fafc',
    },
    titleInput: {
      fontSize: 20,
      fontWeight: '600',
      color: '#0f172a',
      marginBottom: 12,
    },
    contentInput: {
      fontSize: 16,
      lineHeight: 24,
      color: '#334155',
      minHeight: 150,
      marginBottom: 16,
    },
    tagsContainer: {
      marginBottom: 16,
    },
    tagsTitle: {
      fontSize: 16,
      fontWeight: '500',
      color: '#0f172a',
      marginBottom: 8,
    },
    tagList: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    tagItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#e0e7ff',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 20,
    },
    tagText: {
      color: '#6366f1',
      fontSize: 14,
    },
    imageContainer: {
      marginBottom: 16,
    },
    imagePreview: {
      width: '100%',
      height: 200,
      borderRadius: 12,
      marginBottom: 8,
    },
    imageActions: {
      flexDirection: 'row',
      gap: 8,
    },
    imageButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      padding: 10,
      backgroundColor: '#e0e7ff',
      borderRadius: 12,
    },
    imageButtonText: {
      color: '#6366f1',
      fontWeight: '500',
      fontSize: 14,
    },
    removeButton: {
      backgroundColor: '#fee2e2',
    },
    removeButtonText: {
      color: '#ef4444',
    },
    submitButton: {
      backgroundColor: '#6366f1',
      padding: 14,
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
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

  const pickImageFromGallery = async () => {
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

  const takePhotoWithCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Camera access is needed to take photos');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
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

  const toggleTag = (tag: string) => {
    if (tags.includes(tag)) {
      setTags(tags.filter(t => t !== tag));
    } else {
      setTags([...tags, tag]);
    }
  };

  const handleCreateNote = async () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      let persistentUri = undefined;
      if (imageUri) {
        try {
          persistentUri = await copyImageToPermanentLocation(imageUri);
        } catch (error) {
          console.error('Failed to save image:', error);
          Alert.alert('Error', 'Failed to save image');
          return;
        }
      }
      
      await localStorageService.createNote({
        title,
        content,
        tags,
        imageUri: persistentUri
      });
      router.back();
    } catch (error) {
      Alert.alert('Error', 'Failed to create note');
      console.error('Create note error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.titleInput}
        placeholder="Note title..."
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.contentInput}
        placeholder="Note content..."
        value={content}
        onChangeText={setContent}
        multiline
      />

      <View style={styles.imageContainer}>
        {imageUri && (
          <Image source={{ uri: imageUri }} style={styles.imagePreview} />
        )}
        <View style={styles.imageActions}>
          <TouchableOpacity 
            style={styles.imageButton}
            onPress={takePhotoWithCamera}
          >
            <Camera size={18} color="#6366f1" />
            <Text style={styles.imageButtonText}>Camera</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.imageButton}
            onPress={pickImageFromGallery}
          >
            <ImagePlus size={18} color="#6366f1" />
            <Text style={styles.imageButtonText}>Gallery</Text>
          </TouchableOpacity>
          {imageUri && (
            <TouchableOpacity 
              style={[styles.imageButton, styles.removeButton]}
              onPress={removeImage}
            >
              <Trash2 size={18} color="#ef4444" />
              <Text style={[styles.imageButtonText, styles.removeButtonText]}>Remove</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.tagsContainer}>
        <Text style={styles.tagsTitle}>Tags</Text>
        <View style={styles.tagList}>
          {availableTags.map(tag => (
            <TouchableOpacity
              key={tag}
              style={[
                styles.tagItem,
                tags.includes(tag) && { backgroundColor: '#6366f1' }
              ]}
              onPress={() => toggleTag(tag)}
            >
              <Tag size={14} color={tags.includes(tag) ? 'white' : '#6366f1'} />
              <Text style={[
                styles.tagText,
                tags.includes(tag) && { color: 'white' }
              ]}>
                {tag}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleCreateNote}
        disabled={loading}
      >
        <Text style={styles.submitButtonText}>Create Note</Text>
        <Check size={18} color="white" />
      </TouchableOpacity>
    </View>
  );
}
