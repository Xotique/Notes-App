import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Alert, ListRenderItem } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState, useEffect } from 'react';
import localStorageService from '../../lib/localStorage';
import { Plus, Search, Trash2 } from 'lucide-react-native';

type RootStackParamList = {
  'tag/[tagName]': { tagName: string };
  'tag/new': undefined;
};

export default function CategoriesScreen() {
  const [categories, setCategories] = useState<string[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
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
    tagsContainer: {
      marginBottom: 16,
    },
    tagsTitle: {
      fontSize: 16,
      fontWeight: '500',
      color: '#0f172a',
      marginBottom: 8,
      paddingHorizontal: 16,
    },
    tagList: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      paddingHorizontal: 16,
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

  const loadCategories = async () => {
    const loadedCategories = await localStorageService.getCategories();
    setCategories(loadedCategories);
    setFilteredCategories(loadedCategories);
  };

  useFocusEffect(
    useCallback(() => {
      loadCategories();
    }, [])
  );

  useEffect(() => {
    if (searchQuery) {
      const filtered = categories.filter(category =>
        category.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCategories(filtered);
    } else {
      setFilteredCategories(categories);
    }
  }, [searchQuery, categories]);

  const handleAddCategory = () => {
    router.push('/tag/new');
  };

  const handleDeleteCategory = async (category: string) => {
    Alert.alert(
      'Delete Category',
      `Are you sure you want to delete "${category}"?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await localStorageService.deleteCategory(category);
            loadCategories();
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Search size={20} color="#64748b" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search categories..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#94a3b8"
          />
        </View>
      </View>

      <View style={styles.tagsContainer}>
        <Text style={styles.tagsTitle}>Categories</Text>
        <View style={styles.tagList}>
          {filteredCategories.map(tag => (
            <TouchableOpacity
              key={tag}
              style={styles.tagItem}
              onPress={() => router.push(`/tag/${tag}`)}
            >
              <Text style={styles.tagText}>#{tag}</Text>
              <TouchableOpacity 
                onPress={(e) => {
                  e.stopPropagation();
                  handleDeleteCategory(tag);
                }}
              >
                <Trash2 size={14} color="#ef4444" style={{marginLeft: 6}} />
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <TouchableOpacity
        style={styles.addButton}
        onPress={handleAddCategory}
      >
        <Plus size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}
