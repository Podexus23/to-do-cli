import { parseCommand } from './parseCommand.js';

describe('parseCommand', () => {
  it('splits by spaces into command and args', () => {
    expect(parseCommand('add Buy groceries')).toEqual(['add', 'Buy', 'groceries']);
    expect(parseCommand('delete 1')).toEqual(['delete', '1']);
  });

  it('keeps quoted text as single argument', () => {
    expect(parseCommand('add "Buy groceries and cook dinner"')).toEqual(['add', 'Buy groceries and cook dinner']);
  });

  it('returns single token for input without spaces', () => {
    expect(parseCommand('list')).toEqual(['list']);
    expect(parseCommand('exit')).toEqual(['exit']);
  });

  it('handles empty string', () => {
    expect(parseCommand('')).toEqual([]);
  });

  it('handles multiple spaces between tokens', () => {
    const result = parseCommand('add   Buy   groceries');
    expect(result).toEqual(['add', 'Buy', 'groceries']);
  });

  it('trims nothing inside quotes', () => {
    expect(parseCommand('add "  spaced  "')).toEqual(['add', '  spaced  ']);
  });
});
