import { parseId } from './parseId.js';

describe('parseId', () => {
  it('returns number for valid positive integer string', () => {
    expect(parseId('123')).toBe(123);
    expect(parseId('1')).toBe(1);
  });

  it('returns null for zero or negative', () => {
    expect(parseId('0')).toBe(null);
    expect(parseId('-1')).toBe(null);
  });

  it('returns null for undefined or empty string', () => {
    expect(parseId(undefined)).toBe(null);
    expect(parseId('')).toBe(null);
  });

  it('returns null for non-numeric string', () => {
    expect(parseId('darova')).toBe(null);
    expect(parseId('abc123')).toBe(null);
  });

  it('returns null for decimal string (only integer allowed)', () => {
    expect(parseId('12.5')).toBe(null);
    expect(parseId('99.9')).toBe(null);
  });

  it('accepts trimmed input and returns number', () => {
    expect(parseId('  42  ')).toBe(42);
    expect(parseId('\t7\n')).toBe(7);
  });
});
