import path from 'node:path';
import nodeOs from 'node:os';
import fs from 'node:fs/promises';
import { isTasks, type Task, type StatusType } from './types/interfaces.js';

const TASKS_PATH = path.resolve(nodeOs.homedir(), 'tasks-app', 'data.json');
const TMP_PATH = TASKS_PATH + '.tmp';
let tasksData: Task[] = [];

async function saveTasksFile(tasks: Task[]): Promise<void> {
  await fs.writeFile(TMP_PATH, JSON.stringify(tasks, null, 2), 'utf-8');
  await fs.rename(TMP_PATH, TASKS_PATH);
}

export async function addTask(data: string) {
  const id = (tasksData.at(-1)?.id ?? 0) + 1;
  const task: Task = {
    id,
    description: data,
    status: 'todo',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  tasksData.push(task);
  await saveTasksFile(tasksData);
  return task;
}

export async function checkTasksFile() {
  try {
    await fs.access(TASKS_PATH);
    console.log('Data file exists');
  } catch (error: unknown) {
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
      console.log('Data file is not found');
      console.log('Creating file...');
      const dbDir = path.dirname(TASKS_PATH);
      await fs.mkdir(dbDir, { recursive: true });
      await saveTasksFile(tasksData);
    } else {
      console.error('Unexpected error while checking tasks file:', error);
      throw error;
    }
  }
}

export async function getTasksData() {
  try {
    const jsonData = await fs.readFile(TASKS_PATH, { encoding: 'utf-8' });
    const parsedJson = JSON.parse(jsonData) as unknown;
    tasksData = isTasks(parsedJson) ? parsedJson : tasksData;
    return tasksData;
  } catch (error) {
    if (error instanceof Error) throw new Error(`Model: ${error.message}`, { cause: error });
    else throw new Error('Unknown app error', { cause: error });
  }
}

export async function deleteTask(id: number) {
  try {
    tasksData = tasksData.filter((task) => task.id !== id);
    await saveTasksFile(tasksData);
    return tasksData;
  } catch (error) {
    if (error instanceof Error) throw new Error(`Model: ${error.message}`, { cause: error });
    else throw new Error('Unknown app error', { cause: error });
  }
}

export async function updateTask(id: number, data: { description?: string; status?: StatusType }) {
  try {
    tasksData = tasksData.map((task) => {
      if (task.id === id) {
        return {
          ...task,
          ...{
            ...data,
            updatedAt: new Date().toISOString(),
          },
        };
      }
      return task;
    });
    await saveTasksFile(tasksData);
  } catch (error) {
    if (error instanceof Error) throw new Error(`Model: ${error.message}`, { cause: error });
    else throw new Error('Unknown app error', { cause: error });
  }
}

export async function deleteAllTasks() {
  try {
    tasksData = [];
    await saveTasksFile(tasksData);
  } catch (error: unknown) {
    if (error instanceof Error) throw new Error(`Model: ${error.message}`, { cause: error });
    else throw new Error('Unknown app error', { cause: error });
  }
}
