import AsyncStorage from '@react-native-async-storage/async-storage';

type Note = {
  id: string;
  title: string;
  content: string;
  tags?: string[];
  imageUri?: string;
  createdAt: number;
  updatedAt: number;
};

const NOTES_KEY = '@notes';
const CATEGORIES_KEY = '@categories';

// Simple ID generator that doesn't require crypto
const generateId = () => Date.now().toString(36) + Math.random().toString(36).substring(2);

const localStorageService = {
  async getNotes(): Promise<Note[]> {
    const jsonValue = await AsyncStorage.getItem(NOTES_KEY);
    return jsonValue ? JSON.parse(jsonValue) : [];
  },

  async createNote(note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>): Promise<void> {
    const notes = await this.getNotes();
    const newNote = {
      ...note,
      id: generateId(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    notes.push(newNote);
    await AsyncStorage.setItem(NOTES_KEY, JSON.stringify(notes));
  },

  async updateNote(id: string, updatedFields: Partial<Note>): Promise<void> {
    const notes = await this.getNotes();
    const noteIndex = notes.findIndex(n => n.id === id);
    if (noteIndex !== -1) {
      notes[noteIndex] = {
        ...notes[noteIndex],
        ...updatedFields,
        updatedAt: Date.now(),
      };
      await AsyncStorage.setItem(NOTES_KEY, JSON.stringify(notes));
    }
  },

  async deleteNote(id: string): Promise<void> {
    const notes = await this.getNotes();
    const filteredNotes = notes.filter(n => n.id !== id);
    await AsyncStorage.setItem(NOTES_KEY, JSON.stringify(filteredNotes));
  },

  async getCategories(): Promise<string[]> {
    const jsonValue = await AsyncStorage.getItem(CATEGORIES_KEY);
    return jsonValue ? JSON.parse(jsonValue) : [];
  },

  async addCategory(category: string): Promise<void> {
    const categories = await this.getCategories();
    if (!categories.includes(category)) {
      categories.push(category);
      await AsyncStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
    }
  },

  async deleteCategory(category: string): Promise<void> {
    const categories = await this.getCategories();
    const filteredCategories = categories.filter(c => c !== category);
    await AsyncStorage.setItem(CATEGORIES_KEY, JSON.stringify(filteredCategories));
  },

  async getFeedbacks(): Promise<Array<{text: string, date: string}>> {
    const jsonValue = await AsyncStorage.getItem('@feedbacks');
    return jsonValue ? JSON.parse(jsonValue) : [];
  },

  async saveFeedbacks(feedbacks: Array<{text: string, date: string}>): Promise<void> {
    await AsyncStorage.setItem('@feedbacks', JSON.stringify(feedbacks));
  },

  async savePasscode(passcode: string): Promise<void> {
    await AsyncStorage.setItem('@passcode', passcode);
    await AsyncStorage.setItem('@biometricLockEnabled', 'true');
  },

  async getPasscode(): Promise<string | null> {
    return await AsyncStorage.getItem('@passcode');
  },

  async isBiometricLockEnabled(): Promise<boolean> {
    const value = await AsyncStorage.getItem('@biometricLockEnabled');
    return value === 'true';
  },

  async clearAll(): Promise<void> {
    await AsyncStorage.clear();
  },
};

export default localStorageService;
