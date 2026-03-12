import { parseCommand } from './parseCommand.js';

describe('parseCommands', () => {
  it('should split commands and arguments', () => {
    const result = parseCommand('add Buy groceries');
    expect(result).toEqual(['add', 'Buy', 'groceries']);
  });

  it('should handle quoted arguments', () => {
    const result = parseCommand('add "Buy groceries and cook dinner"');
    expect(result).toEqual(['add', 'Buy groceries and cook dinner']);
  });
});
