import { addTask, deleteAllTasks, deleteTask, getTasksData, updateTask } from '../task.model.js';
import type { StatusType } from '../types/interfaces.js';

export const commandsList = {
  exit: () => {
    console.log('bye bye');
  },
  list: async () => {
    const tasks = await getTasksData();
    const view = tasks?.map((task) => `${task.description} (ID: ${task.id}, status: ${task.status})`);
    view?.forEach((task, i) => {
      console.log(`${i + 1}. ${task}`);
    });
  },
  listByStatus: async (status: StatusType) => {
    const tasks = await getTasksData();
    const filteredView = tasks
      ?.filter((task) => task.status === status)
      .map((task) => `${task.description} (ID: ${task.id})`);
    filteredView?.forEach((task, i) => {
      console.log(`${i + 1}. ${task}`);
    });
  },
  add: async (task: string) => {
    const res = await addTask(task);
    console.log('Task added: ' + res.description + ' (id: ' + res.id + ')');
  },
  delete: async (id: number) => {
    await deleteTask(id);
    console.log(`Task ID:${id} - deleted`);
  },
  update: async (id: number, description: string) => {
    await updateTask(id, { description });
    console.log(`Task ID:${id} - updated`);
  },
  mark: async (id: number, status: StatusType) => {
    await updateTask(id, { status });
    console.log(`Task ID:${id} - status changed`);
  },
  deleteAll: async () => {
    await deleteAllTasks();
    console.log('All tasks are deleted');
  },
  help: () => {
    console.log(`
Available commands:
  add "<description>"                 - Add a new task
  update <id> "<new description>"      - Update a task's description
  delete <id>                          - Delete a task
  delete-all                          - Delete all tasks
  mark-in-progress <id>                - Mark a task as in progress
  mark-todo <id>                       - Mark a task as todo
  mark-done <id>                        - Mark a task as done
  list [status]                         - List tasks (status: todo, in-progress, done)
  help                                   - Show this help message
  exit                                   - Exit the application
      `);
  },
};
