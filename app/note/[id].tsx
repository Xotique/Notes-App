import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import localStorageService from '../../lib/localStorage';
import { useState, useEffect } from 'react';
import { Note } from '../../types';
import { format } from 'date-fns';
import { Clock, Edit, Trash2 } from 'lucide-react-native';

export default function NoteDetailScreen() {
  const { id } = useLocalSearchParams();
  const [note, setNote] = useState<Note | null>(null);
  const router = useRouter();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: '#f8fafc',
    },
    contentContainer: {
      backgroundColor: 'white',
      borderRadius: 8,
      padding: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    title: {
      fontSize: 24,
      fontWeight: '600',
      color: '#0f172a',
      flex: 1,
    },
    actionButtons: {
      flexDirection: 'row',
      gap: 12,
    },
    actionButton: {
      padding: 8,
    },
    content: {
      fontSize: 16,
      color: '#334155',
      lineHeight: 24,
      marginBottom: 16,
    },
    image: {
      width: '100%',
      height: 200,
      borderRadius: 8,
      marginBottom: 16,
    },
    tagsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      marginBottom: 16,
    },
    tag: {
      backgroundColor: '#e0e7ff',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
    },
    tagText: {
      color: '#6366f1',
      fontSize: 14,
    },
    timestampContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 4,
    },
    timestampText: {
      fontSize: 14,
      color: '#64748b',
      marginLeft: 8,
    },
    modifiedContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    modifiedText: {
      fontSize: 14,
      color: '#94a3b8',
      marginLeft: 8,
      fontStyle: 'italic',
    },
  });

  const handleDelete = async () => {
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
            await localStorageService.deleteNote(id as string);
            router.back();
          },
        },
      ]
    );
  };

  useEffect(() => {
    const loadNote = async () => {
      const items = await localStorageService.getNotes();
      const foundNote = items.find(n => n.id === id) as Note | undefined;
      setNote(foundNote || null);
    };
    loadNote();
  }, [id]);

  if (!note) {
    return (
      <View style={styles.container}>
        <Text>Loading note...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>{note.title}</Text>
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => router.push(`/note/edit/${note.id}`)}
            >
              <Edit size={24} color="#6366f1" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={handleDelete}
            >
              <Trash2 size={24} color="#ef4444" />
            </TouchableOpacity>
          </View>
        </View>

        {note.imageUri && (
          <Image source={{ uri: note.imageUri }} style={styles.image} />
        )}
        <Text style={styles.content}>{note.content}</Text>
        
        {note.tags && note.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {note.tags.map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>#{tag}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.timestampContainer}>
          <Clock size={16} color="#64748b" />
          <Text style={styles.timestampText}>
            Created: {format(new Date(note.createdAt), 'MMM d, yyyy - h:mm a')}
          </Text>
        </View>

        {note.updatedAt !== note.createdAt && (
          <View style={styles.modifiedContainer}>
            <Edit size={16} color="#94a3b8" />
            <Text style={styles.modifiedText}>
              Modified: {format(new Date(note.updatedAt), 'MMM d, yyyy - h:mm a')}
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
