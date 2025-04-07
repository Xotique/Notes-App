import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import localStorageService from '../../lib/localStorage';
import { Note } from '../../types';
import { Tag } from 'lucide-react-native';

export default function TagNotesScreen() {
  const { tagName } = useLocalSearchParams();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f8fafc',
    },
    header: {
      padding: 20,
      backgroundColor: 'white',
      borderBottomWidth: 1,
      borderBottomColor: '#e2e8f0',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    tagContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#e0e7ff',
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
    },
    tagText: {
      fontSize: 18,
      fontWeight: '600',
      color: '#6366f1',
      marginLeft: 8,
    },
    noteItem: {
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: '#e2e8f0',
      backgroundColor: 'white',
    },
    noteTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: '#0f172a',
      marginBottom: 4,
    },
    noteContent: {
      fontSize: 14,
      color: '#64748b',
    },
    noteImage: {
      width: '100%',
      height: 150,
      borderRadius: 8,
      marginBottom: 8,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

  useEffect(() => {
    const loadNotes = async () => {
      try {
        const allNotes = await localStorageService.getNotes();
        const filteredNotes = allNotes.filter(note => 
          note.tags?.includes(tagName as string)
        );
        setNotes(filteredNotes);
      } catch (error) {
        console.error('Error loading notes:', error);
      } finally {
        setLoading(false);
      }
    };
    loadNotes();
  }, [tagName]);

  const renderItem = ({ item }: { item: Note }) => (
    <TouchableOpacity
      style={styles.noteItem}
      onPress={() => router.push({ pathname: '/note/[id]', params: { id: item.id } })}
    >
      {item.imageUri && (
        <Image source={{ uri: item.imageUri }} style={styles.noteImage} />
      )}
      <Text style={styles.noteTitle}>{item.title}</Text>
      <Text 
        style={styles.noteContent}
        numberOfLines={2}
        ellipsizeMode="tail"
      >
        {item.content}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.tagContainer}>
          <Tag size={20} color="#6366f1" />
          <Text style={styles.tagText}>#{tagName}</Text>
        </View>
      </View>
      <FlatList
        data={notes}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </View>
  );
}
