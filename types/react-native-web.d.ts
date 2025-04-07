declare module 'react-native-web/src/exports/InteractionManager/TaskQueue' {
  import { Task } from './taskQueue';

  class TaskQueue {
    constructor(config: { onMoreTasks: () => void });
    enqueue(task: Task): void;
    enqueueTasks(tasks: Task[]): void;
    cancelTasks(tasksToCancel: Task[]): void;
    hasTasksToProcess(): boolean;
    processNext(): void;
  }

  export default TaskQueue;
}
