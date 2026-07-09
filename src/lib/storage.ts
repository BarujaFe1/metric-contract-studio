const STORAGE_KEY = "metric-contract-studio:metrics:v1";
const SEEDED_KEY = "metric-contract-studio:seeded:v1";

export function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

export function loadMetricsFromStorage<T>(): T[] | null {
  if (!isBrowser()) return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as T[];
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function saveMetricsToStorage<T>(metrics: T[]): void {
  if (!isBrowser()) return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(metrics));
}

export function wasDemoSeeded(): boolean {
  if (!isBrowser()) return false;
  return localStorage.getItem(SEEDED_KEY) === "1";
}

export function markDemoSeeded(): void {
  if (!isBrowser()) return;
  localStorage.setItem(SEEDED_KEY, "1");
}

export function clearStudioStorage(): void {
  if (!isBrowser()) return;
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(SEEDED_KEY);
}
