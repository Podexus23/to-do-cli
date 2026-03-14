export function parseId(arg: string | undefined): number | null {
  if (arg === undefined || arg === '') return null;
  const id = parseInt(arg.trim(), 10);
  if (isNaN(id) || id.toString() !== arg.trim() || id < 1) return null;
  return id;
}
