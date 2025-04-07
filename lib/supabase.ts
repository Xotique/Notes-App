import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Initialize database tables if they don't exist
export async function initDatabase() {
  const { error } = await supabase.rpc('create_tables_if_not_exists');
  if (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

// Note CRUD operations
export const noteService = {
  async getNotes() {
    const { data, error } = await supabase
      .from('notes')
      .select('*, categories(name)')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async createNote(note: { title: string; content: string; category_id?: string; tag?: string }) {
    const { data, error } = await supabase
      .from('notes')
      .insert(note)
      .select();

    if (error) throw error;
    return data[0];
  },

  async updateNote(id: string, updates: Partial<Note>) {
    const { data, error } = await supabase
      .from('notes')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select();

    if (error) throw error;
    return data[0];
  },

  async deleteNote(id: string) {
    const { error } = await supabase
      .from('notes')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async searchNotes(searchTerm: string) {
    const { data, error } = await supabase
      .rpc('search_notes', { search_term: searchTerm })
      .select('*, categories(name)');

    if (error) throw error;
    return data;
  }
};

// Category operations
export const categoryService = {
  async getCategories() {
    const { data, error } = await supabase
      .from('categories')
      .select('*, notes(count)');

    if (error) throw error;
    return data;
  },

  async createCategory(name: string) {
    const { data, error } = await supabase
      .from('categories')
      .insert({ name })
      .select();

    if (error) throw error;
    return data[0];
  }
};

interface Note {
  id: string;
  title: string;
  content: string;
  category_id?: string;
  created_at: string;
  updated_at: string;
  reminder_time?: string;
  categories?: {
    name: string;
  };
}
