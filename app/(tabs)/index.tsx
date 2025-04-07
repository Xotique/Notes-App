import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, TextInput, Image, Alert } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import localStorageService from '../../lib/localStorage';
import { useState, useEffect, useCallback } from 'react';
import { Note } from '../../types';
import { Search, Plus, Trash2, Clock } from 'lucide-react-native';
import { format } from 'date-fns';

export default function NotesScreen() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f8fafc',
    },
    header: {
      padding: 16,
      backgroundColor: 'white',
      borderBottomWidth: 1,
      borderBottomColor: '#e2e8f0',
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#f1f5f9',
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 8,
    },
    searchInput: {
      flex: 1,
      marginLeft: 8,
      fontSize: 16,
      color: '#0f172a',
    },
    noteItem: {
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: '#e2e8f0',
      backgroundColor: 'white',
    },
    noteHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    noteTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: '#0f172a',
      flex: 1,
    },
    noteContent: {
      fontSize: 14,
      color: '#64748b',
      marginBottom: 8,
    },
    noteImage: {
      width: '100%',
      height: 150,
      borderRadius: 8,
      marginBottom: 8,
    },
    tagsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 6,
      marginBottom: 8,
    },
    tag: {
      backgroundColor: '#e0e7ff',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
    },
    tagText: {
      fontSize: 12,
      color: '#6366f1',
    },
    timestampContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
    },
    timestamp: {
      fontSize: 12,
      color: '#94a3b8',
      marginLeft: 4,
    },
    deleteButton: {
      padding: 8,
      marginLeft: 8,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    addButton: {
      position: 'absolute',
      bottom: 20,
      right: 20,
      backgroundColor: '#6366f1',
      width: 56,
      height: 56,
      borderRadius: 28,
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 4,
    },
  });

  const loadNotes = useCallback(async () => {
    try {
      const loadedItems = await localStorageService.getNotes();
      // Type guard to ensure we have proper Note objects
      const isNote = (item: any): item is Note => {
        return item && typeof item.id === 'string' && typeof item.createdAt === 'number';
      };
      const loadedNotes = loadedItems.filter(isNote);
      const sortedNotes = loadedNotes.sort((a, b) => {
        // Fallback to 0 if dates are missing
        const dateA = a.createdAt || 0;
        const dateB = b.createdAt || 0;
        return dateB - dateA; // Descending order (newest first)
      });
      setNotes(sortedNotes);
      setFilteredNotes(sortedNotes);
    } catch (error) {
      console.error('Failed to load notes:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleDeleteNote = async (id: string) => {
    Alert.alert(
      'Delete Note',
      'Are you sure you want to delete this note?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await localStorageService.deleteNote(id);
            loadNotes();
          },
        },
      ]
    );
  };

  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  useFocusEffect(
    useCallback(() => {
      loadNotes();
    }, [loadNotes])
  );

  useEffect(() => {
    if (searchQuery) {
      const filtered = notes.filter(note =>
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (note.tags && note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
      );
      setFilteredNotes(filtered);
    } else {
      setFilteredNotes(notes);
    }
  }, [searchQuery, notes]);

  const renderItem = ({ item }: { item: Note }) => (
    <TouchableOpacity
      style={styles.noteItem}
      onPress={() => router.push({ pathname: '/note/[id]', params: { id: item.id } })}
    >
      <View style={styles.noteHeader}>
        <Text style={styles.noteTitle}>{item.title}</Text>
        <TouchableOpacity 
          style={styles.deleteButton}
          onPress={(e) => {
            e.stopPropagation();
            handleDeleteNote(item.id);
          }}
        >
          <Trash2 size={18} color="#ef4444" />
        </TouchableOpacity>
      </View>
      {item.imageUri && (
        <Image 
          source={{ 
            uri: item.imageUri.includes('file://') 
              ? item.imageUri 
              : `file://${item.imageUri}`
          }}
          style={styles.noteImage}
          resizeMode="cover"
          onError={(e) => console.log('Image load error:', e.nativeEvent.error)}
        />
      )}
      <Text 
        style={styles.noteContent}
        numberOfLines={2}
        ellipsizeMode="tail"
      >
        {item.content}
      </Text>
      {item.tags && item.tags.length > 0 && (
        <FlatList
          data={item.tags}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({item: tag}) => (
            <View style={styles.tag}>
              <Text style={styles.tagText}>#{tag}</Text>
            </View>
          )}
          keyExtractor={(tag, index) => index.toString()}
          contentContainerStyle={styles.tagsContainer}
        />
      )}
      <View style={styles.timestampContainer}>
        <Clock size={14} color="#94a3b8" />
        <Text style={styles.timestamp}>
          {format(new Date(item.createdAt), 'MMM d, yyyy - h:mm a')}
        </Text>
      </View>
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
        <View style={styles.searchContainer}>
          <Search size={20} color="#64748b" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search notes..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#94a3b8"
          />
        </View>
      </View>

      <FlatList
        data={filteredNotes}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingBottom: 16 }}
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push('/note/new')}
      >
        <Plus size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}
