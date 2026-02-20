const STORAGE_KEY = 'placement_test_checklist'

const DEFAULT_CHECKLIST = () => [
  false, false, false, false, false,
  false, false, false, false, false,
]

export function getTestChecklist() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_CHECKLIST()
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed) || parsed.length !== 10) return DEFAULT_CHECKLIST()
    return parsed.map((v) => Boolean(v))
  } catch {
    return DEFAULT_CHECKLIST()
  }
}

export function setTestChecklist(checks) {
  const arr = Array.isArray(checks) ? checks.slice(0, 10) : DEFAULT_CHECKLIST()
  const padded = [...arr]
  while (padded.length < 10) padded.push(false)
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(padded.slice(0, 10)))
    return padded.slice(0, 10)
  } catch {
    return getTestChecklist()
  }
}

export function setTestChecked(index, checked) {
  const list = getTestChecklist()
  if (index < 0 || index >= 10) return list
  list[index] = Boolean(checked)
  return setTestChecklist(list)
}

export function resetTestChecklist() {
  return setTestChecklist(DEFAULT_CHECKLIST())
}

export function allTestsPassed() {
  const list = getTestChecklist()
  return list.length === 10 && list.every(Boolean)
}
