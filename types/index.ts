export type Note = {
  id: string;
  title: string;
  content: string;
  tags?: string[];
  imageUri?: string;
  createdAt: number;
  updatedAt: number;
  type: 'note';
};

export type Task = {
  id: string;
  title: string;
  dueDate: number;
  completed: boolean;
  createdAt: number;
  updatedAt: number;
  type: 'task';
};

export type ContentItem = Note | Task;
