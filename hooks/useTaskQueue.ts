import { useCallback, useEffect, useRef } from 'react';
import TaskQueue from 'react-native-web/src/exports/InteractionManager/TaskQueue';
import type { Task } from '../types/taskQueue';

export default function useTaskQueue() {
  const queueRef = useRef<TaskQueue | null>(null);

  // Initialize queue
  useEffect(() => {
    const queue = new TaskQueue({
      onMoreTasks: () => queueRef.current?.processNext()
    });
    queueRef.current = queue;
    return () => {
      queueRef.current = null;
    };
  }, []);

  const enqueueTask = useCallback((task: Task) => {
    queueRef.current?.enqueue(task);
    queueRef.current?.processNext();
  }, []);

  const enqueueTasks = useCallback((tasks: Task[]) => {
    queueRef.current?.enqueueTasks(tasks);
    queueRef.current?.processNext();
  }, []);

  const cancelTasks = useCallback((tasks: Task[]) => {
    queueRef.current?.cancelTasks(tasks);
  }, []);

  return {
    enqueueTask,
    enqueueTasks,
    cancelTasks
  };
}
