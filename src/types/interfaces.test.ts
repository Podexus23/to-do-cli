import { isTask, isTasks, isValidStatus, type Task } from './interfaces.js';

describe('interface validators', () => {
  const task: Task = {
    id: 1,
    description: 'some desc',
    status: 'todo',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const taskFake = {
    id: 1,
    status: 'notso',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  describe('isTask', () => {
    it('Return true if object is correct', () => {
      const res = isTask(task);
      expect(res).toBe(true);
    });

    it('return false if Task is not an object', () => {
      const res = isTask(13);
      expect(res).toBe(false);
    });

    it('return false if Task is misses fields incorrect', () => {
      const res = isTask(taskFake);
      expect(res).toBe(false);
    });
  });

  describe('isTasks', () => {
    it('return false if one of tasks is incorrect', () => {
      const result = isTasks([task, taskFake]);
      expect(result).toBe(false);
    });

    it('return false if one of tasks is incorrect', () => {
      const result = isTasks([task, taskFake]);
      expect(result).toBe(false);
    });
  });

  describe('isValidStatus', () => {
    it('return false on incorrect status', () => {
      const result = isValidStatus(taskFake.status);
      expect(result).toBe(false);
    });

    it('return true if on correct status', () => {
      const result = isValidStatus(task.status);
      expect(result).toBe(true);
    });
  });
});
