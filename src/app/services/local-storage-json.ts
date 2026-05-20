export function hasElectronApi(): boolean {
  return typeof window !== "undefined" && !!window.api;
}

export function readJson<T>(key: string, fallback: T): T {
  if (typeof localStorage === "undefined") {
    return fallback;
  }

  const raw = localStorage.getItem(key);
  if (!raw) {
    return fallback;
  }

  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeJson<T>(key: string, value: T): void {
  if (typeof localStorage === "undefined") {
    return;
  }

  localStorage.setItem(key, JSON.stringify(value));
}

export function nextLocalId(records: Array<{ id: string }>): string {
  const maxId = records.reduce((max, record) => {
    const value = Number(record.id);
    return Number.isFinite(value) && value > max ? value : max;
  }, 0);

  return String(maxId + 1);
}
