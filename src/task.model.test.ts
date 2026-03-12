import { addTask, checkTasksFile, saveTasksFile } from './task.model.js';
import fs from 'node:fs/promises';
import type { Task } from './types/interfaces.js';

vi.mock('node:fs/promises', () => {
  return {
    default: {
      writeFile: vi.fn(),
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
    const enoentError = new Error('File not found');
    vi.mocked(fs.access).mockRejectedValueOnce(enoentError);

    await expect(checkTasksFile()).rejects.toThrow('File not found');
  });
});
