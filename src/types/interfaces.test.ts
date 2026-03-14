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
    it('returns true for valid task object', () => {
      expect(isTask(task)).toBe(true);
    });

    it('returns false for non-object', () => {
      expect(isTask(13)).toBe(false);
      expect(isTask(null)).toBe(false);
      expect(isTask('string')).toBe(false);
    });

    it('returns false when required fields are missing or invalid', () => {
      expect(isTask(taskFake)).toBe(false);
    });

    it('returns false for object with invalid status', () => {
      const invalidStatusTask = { ...task, status: 'invalid-status' };
      expect(isTask(invalidStatusTask)).toBe(false);
    });
  });

  describe('isTasks', () => {
    it('returns true for empty array', () => {
      expect(isTasks([])).toBe(true);
    });

    it('returns true for array of valid tasks', () => {
      expect(isTasks([task])).toBe(true);
    });

    it('returns false if one of tasks is invalid', () => {
      expect(isTasks([task, taskFake])).toBe(false);
    });

    it('returns false for non-array', () => {
      expect(isTasks(null)).toBe(false);
      expect(isTasks({})).toBe(false);
    });
  });

  describe('isValidStatus', () => {
    it('returns false for invalid status', () => {
      expect(isValidStatus(taskFake.status)).toBe(false);
      expect(isValidStatus('')).toBe(false);
      expect(isValidStatus('invalid')).toBe(false);
    });

    it('returns true for each valid status', () => {
      expect(isValidStatus('todo')).toBe(true);
      expect(isValidStatus('done')).toBe(true);
      expect(isValidStatus('in-progress')).toBe(true);
    });
  });
});
