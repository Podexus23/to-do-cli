import { applicationController } from './controller.js';
import { parseCommand } from '../helpers/parseCommand.js';
import { parseId } from '../helpers/parseId.js';
import { commandsList } from './commandList.js';

vi.mock('../helpers/parseCommand.js', () => ({
  parseCommand: vi.fn(),
}));

vi.mock('../helpers/parseId.js', () => {
  return {
    parseId: vi.fn(),
  };
});

vi.mock('../task.model.js', () => {
  return {
    addTask: vi.fn(),
    deleteAllTasks: vi.fn(),
    deleteTask: vi.fn(),
    getTasksData: vi.fn(),
    updateTask: vi.fn(),
  };
});

vi.mock('./commandList.js', () => ({
  commandsList: {
    exit: vi.fn(),
    list: vi.fn(),
    help: vi.fn(),
    listByStatus: vi.fn(),
    add: vi.fn(),
    delete: vi.fn(),
    mark: vi.fn(),
    deleteAll: vi.fn(),
  },
}));

describe('controller', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('exit command', () => {
    it('calls commandsList.exit and returns false', async () => {
      vi.mocked(parseCommand).mockReturnValue(['exit']);

      const result = await applicationController('exit');

      expect(commandsList.exit).toHaveBeenCalled();
      expect(result).toBe(false);
    });
  });

  describe('help command', () => {
    it('calls commandsList.help and returns true', async () => {
      vi.mocked(parseCommand).mockReturnValue(['help']);

      const result = await applicationController('help');

      expect(commandsList.help).toHaveBeenCalled();
      expect(result).toBe(true);
    });
  });

  describe('list command', () => {
    it('calls commandsList.list when no status', async () => {
      vi.mocked(parseCommand).mockReturnValue(['list']);

      const result = await applicationController('list');

      expect(commandsList.list).toHaveBeenCalled();
      expect(commandsList.listByStatus).not.toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it('calls commandsList.listByStatus when valid status', async () => {
      vi.mocked(parseCommand).mockReturnValue(['list', 'done']);

      const result = await applicationController('list done');

      expect(commandsList.listByStatus).toHaveBeenCalledWith('done');
      expect(result).toBe(true);
    });
  });

  describe('unknown command', () => {
    it('returns true', async () => {
      vi.mocked(parseCommand).mockReturnValue(['unknown-cmd']);

      const result = await applicationController('unknown-cmd');

      expect(result).toBe(true);
    });
  });

  describe('add command', () => {
    it('does not call add when description is missing', async () => {
      vi.mocked(parseCommand).mockReturnValue(['add']);

      await applicationController('add');

      expect(commandsList.add).not.toHaveBeenCalled();
    });
  });

  describe('delete command', () => {
    it('does not call delete when id is missing or invalid', async () => {
      vi.mocked(parseCommand).mockReturnValue(['delete']);
      vi.mocked(parseId).mockReturnValue(null);

      await applicationController('delete');

      expect(commandsList.delete).not.toHaveBeenCalled();
    });
  });

  describe('parseCommand usage', () => {
    it('calls parseCommand with the given answer', async () => {
      vi.mocked(parseCommand).mockReturnValue(['help']);

      await applicationController('  add hello  ');

      expect(parseCommand).toHaveBeenCalledTimes(1);
      expect(parseCommand).toHaveBeenCalledWith('  add hello  ');
    });
  });
});
