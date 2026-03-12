import { parseId } from './parseId.js';

describe('parseId', () => {
  it('Should return correct number', () => {
    const result = parseId('123');
    expect(result).toBe(123);
  });
  it('Should return null if data is empty', () => {
    const result = parseId('');
    expect(result).toBe(null);
  });
  it('Should return null on incorrect data pass', () => {
    const result = parseId('darova');
    expect(result).toBe(null);
  });
});
