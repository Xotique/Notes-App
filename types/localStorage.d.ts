declare module '../lib/localStorage' {
  import { ContentItem, Note, Task } from './index';
  
  const localStorageService: {
    getNotes(): Promise<ContentItem[]>;
    createNote(note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>): Promise<void>;
    updateNote(id: string, updatedFields: Partial<Note>): Promise<void>;
    deleteNote(id: string): Promise<void>;
    getTasks(): Promise<Task[]>;
    saveTask(task: Task): Promise<void>;
    getCategories(): Promise<string[]>;
    addCategory(category: string): Promise<void>;
    deleteCategory(category: string): Promise<void>;
    clearAll(): Promise<void>;
  };

  export default localStorageService;
}
