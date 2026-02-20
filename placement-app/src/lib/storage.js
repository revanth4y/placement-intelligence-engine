import { normalizeEntry, isValidEntry } from './schema'

const STORAGE_KEY = 'placement_jd_history'

export function saveToHistory(entry) {
  const { entries } = getHistory()
  const normalized = normalizeEntry(entry)
  if (!normalized) return null
  const newEntry = {
    ...normalized,
    id: normalized.id || crypto.randomUUID(),
    createdAt: normalized.createdAt || new Date().toISOString(),
  }
  const updated = [newEntry, ...entries]
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  } catch {
    return null
  }
  return newEntry
}

export function getHistory() {
  let raw = []
  try {
    const str = localStorage.getItem(STORAGE_KEY)
    raw = str ? JSON.parse(str) : []
    if (!Array.isArray(raw)) raw = []
  } catch {
    return { entries: [], corruptedCount: 0 }
  }

  const entries = []
  let corruptedCount = 0
  for (const item of raw) {
    const normalized = normalizeEntry(item)
    if (normalized && isValidEntry(normalized)) {
      entries.push(normalized)
    } else {
      corruptedCount++
    }
  }
  return { entries, corruptedCount }
}

export function getEntryById(id) {
  const { entries } = getHistory()
  return entries.find((e) => e.id === id) ?? null
}

export function getLatestEntry() {
  const { entries } = getHistory()
  return entries.length > 0 ? entries[0] : null
}

export function deleteEntry(id) {
  const { entries } = getHistory()
  const filtered = entries.filter((e) => e.id !== id)
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
  } catch {
    // ignore
  }
}

export function updateEntry(id, updates) {
  const { entries } = getHistory()
  const idx = entries.findIndex((e) => e.id === id)
  if (idx === -1) return null
  const updated = { ...entries[idx], ...updates, updatedAt: new Date().toISOString() }
  entries[idx] = updated
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
  } catch {
    return null
  }
  return updated
}
