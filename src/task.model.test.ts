import {
  addTask,
  checkTasksFile,
  deleteAllTasks,
  deleteTask,
  getTasksData,
  saveTasksFile,
  tasksData,
  updateTask,
} from './task.model.js';
import fs from 'node:fs/promises';
import type { Task } from './types/interfaces.js';

vi.mock('node:fs/promises', () => {
  return {
    default: {
      writeFile: vi.fn(),
      readFile: vi.fn(),
      rename: vi.fn(),
      access: vi.fn(),
      mkdir: vi.fn(),
    },
  };
});

describe('saveTasksFile', () => {
  const mockTasks: Task[] = [{ id: 1, description: 'Test', status: 'todo', createdAt: '', updatedAt: '' }];
  const expectedData = JSON.stringify(mockTasks, null, 2);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call writeFile with correct arguments', async () => {
    await saveTasksFile(mockTasks);

    expect(fs.writeFile).toHaveBeenCalledTimes(1);
    expect(fs.writeFile).toHaveBeenCalledWith(expect.stringContaining('data.json.tmp'), expectedData, 'utf-8');
  });

  it('should call rename after writeFile', async () => {
    await saveTasksFile(mockTasks);

    expect(fs.writeFile).toHaveBeenCalledTimes(1);
    expect(fs.rename).toHaveBeenCalledTimes(1);
    expect(fs.rename).toHaveBeenCalledWith(
      expect.stringContaining('data.json.tmp'),
      expect.stringContaining('data.json')
    );
  });

  it('should throw if writeFile fails', async () => {
    vi.mocked(fs.writeFile).mockRejectedValueOnce(new Error('Disk full'));

    await expect(saveTasksFile(mockTasks)).rejects.toThrow('Disk full');
    expect(fs.rename).not.toHaveBeenCalled();
  });
});

describe('module functions', () => {
  const mockData = 'new description';
  let consoleOutput: string[] = [];

  beforeEach(() => {
    vi.clearAllMocks();
    consoleOutput = [];
    vi.spyOn(console, 'log').mockImplementation((...args) => {
      consoleOutput.push(args.join(' '));
    });
  });

  describe('addTask', () => {
    it('add new task correctly', async () => {
      const result = await addTask(mockData);

      expect(result.description).toBe(mockData);
      expect(result.id).toBe(1);
      expect(result.status).toBe('todo');
      expect(result.createdAt).toBeDefined();
      expect(result.updatedAt).toBeDefined();

      const expectedTasks = [result];
      const expectedJson = JSON.stringify(expectedTasks, null, 2);
      expect(fs.writeFile).toHaveBeenCalledWith(expect.stringContaining('data.json.tmp'), expectedJson, 'utf-8');
      expect(fs.rename).toHaveBeenCalled();
    });
  });

  describe('checkTaskFile', () => {
    it(`checkTaskFile: Console log that file exists if it's already created`, async () => {
      await checkTasksFile();

      expect(fs.access).toHaveBeenCalled();
      expect(consoleOutput[0]).toContain('Data file exists');
    });

    it(`checkTaskFile: Create file if it's not exist`, async () => {
      const enoentError = Object.assign(new Error('File not found'), { code: 'ENOENT' });
      vi.mocked(fs.access).mockRejectedValueOnce(enoentError);

      await checkTasksFile();

      expect(consoleOutput[0]).toContain('Data file is not found');
      expect(fs.mkdir).toHaveBeenCalled();
    });
    it(`checkTaskFile: should pass other errors`, async () => {
      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const enoentError = Object.assign(new Error('File not found'), { code: 'test' });
      vi.mocked(fs.access).mockRejectedValueOnce(enoentError);

      await expect(checkTasksFile()).rejects.toThrow('File not found');
      expect(errorSpy).toHaveBeenCalledWith('Unexpected error while checking tasks file:', enoentError);
    });
  });

  describe('getTasksData', () => {
    it(`getTasksData: should return tasks`, async () => {
      const mockObj: Task = {
        id: 2,
        description: 'tester',
        status: 'todo',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const mockJson = JSON.stringify([mockObj]);

      vi.mocked(fs.readFile).mockResolvedValue(mockJson);
      const result = await getTasksData();
      expect(result).toEqual([mockObj]);
    });

    it(`getTasksData: should pass errors`, async () => {
      const testError = Object.assign(new Error('File not found'), { code: 'test' });
      vi.mocked(fs.readFile).mockRejectedValueOnce(testError);

      await expect(getTasksData()).rejects.toThrow(new Error(`Model: ${testError.message}`, { cause: testError }));
    });

    it.each([
      { name: 'Error object', error: new Error('read error'), expected: 'Model: read error' },
      { name: 'non-Error', error: 'string error', expected: 'Unknown app error' },
    ])('should handle $name', async ({ error, expected }) => {
      vi.mocked(fs.readFile).mockRejectedValueOnce(error);
      await expect(getTasksData()).rejects.toThrow(expected);
    });
  });

  describe('deleteTask', () => {
    const task1: Task = { id: 1, description: 'Task 1', status: 'todo', createdAt: '', updatedAt: '' };
    const task2: Task = { id: 2, description: 'Task 2', status: 'todo', createdAt: '', updatedAt: '' };
    const task3: Task = { id: 3, description: 'Task 3', status: 'todo', createdAt: '', updatedAt: '' };

    beforeEach(() => {
      tasksData.length = 0;
      tasksData.push(task1, task2, task3);
      vi.clearAllMocks();
    });

    it('should delete task with given id and update tasksData', async () => {
      const result = await deleteTask(2);

      expect(tasksData).toHaveLength(2);
      expect(tasksData).not.toContainEqual(task2);
      expect(tasksData).toContainEqual(task1);
      expect(tasksData).toContainEqual(task3);

      expect(result).toEqual([task1, task3]);
    });

    it('should do nothing if id does not exist', async () => {
      const result = await deleteTask(99);

      expect(tasksData).toEqual([task1, task2, task3]);
      expect(result).toEqual([task1, task2, task3]);
    });

    it('should throw and wrap error if saveTasksFile fails', async () => {
      const testError = new Error('Disk full');
      vi.mocked(fs.writeFile).mockRejectedValue(testError);

      await expect(deleteTask(1)).rejects.toThrow('Model: Disk full');
      expect(tasksData).not.toContainEqual(task1);
    });
  });
  describe('updateTask', () => {
    const task1: Task = { id: 1, description: 'Task 1', status: 'todo', createdAt: '', updatedAt: '' };
    const task2: Task = { id: 2, description: 'Task 2', status: 'todo', createdAt: '', updatedAt: '' };
    const task3: Task = { id: 3, description: 'Task 3', status: 'todo', createdAt: '', updatedAt: '' };

    beforeEach(() => {
      tasksData.length = 0;
      tasksData.push(task1, task2, task3);
      vi.clearAllMocks();

      vi.mocked(fs.writeFile).mockReset();
      vi.mocked(fs.rename).mockReset();
    });

    it('update task change description and updatedAt', async () => {
      const updatedDescription = 'new Task';
      const previousUpdateTime = tasksData.find((task) => task.id === 1)?.updatedAt;
      await updateTask(1, { description: updatedDescription });

      expect(tasksData.find((task) => task.id === 1)?.description).toBe(updatedDescription);
      expect(previousUpdateTime).not.toBe(tasksData.find((task) => task.id === 1)?.updatedAt);
    });

    it('update task change status and updatedAt', async () => {
      const previousUpdateTime = tasksData.find((task) => task.id === 1)?.updatedAt;
      await updateTask(1, { status: 'done' });

      expect(tasksData.find((task) => task.id === 1)?.status).toBe('done');
      expect(previousUpdateTime).not.toBe(tasksData.find((task) => task.id === 1)?.updatedAt);
    });

    it.each([
      { name: 'Error object', error: new Error('read error'), expected: 'Model: read error' },
      { name: 'non-Error', error: 'string error', expected: 'Unknown app error' },
    ])('should handle $name', async ({ error, expected }) => {
      vi.mocked(fs.readFile).mockRejectedValueOnce(error);
      await expect(getTasksData()).rejects.toThrow(expected);
    });
  });
  describe('deleteAllTasks', () => {
    const task1: Task = { id: 1, description: 'Task 1', status: 'todo', createdAt: '', updatedAt: '' };
    const task2: Task = { id: 2, description: 'Task 2', status: 'todo', createdAt: '', updatedAt: '' };
    const task3: Task = { id: 3, description: 'Task 3', status: 'todo', createdAt: '', updatedAt: '' };

    beforeEach(() => {
      tasksData.length = 0;
      tasksData.push(task1, task2, task3);
      vi.clearAllMocks();

      vi.mocked(fs.writeFile).mockReset();
      vi.mocked(fs.rename).mockReset();
    });

    it('Delete all tasks from array', async () => {
      await deleteAllTasks();

      expect(tasksData).toEqual([]);
    });
  });
});
