const SKILL_KEYS = ['coreCS', 'languages', 'web', 'data', 'cloud', 'testing', 'other']
const DEFAULT_OTHER_SKILLS = ['Communication', 'Problem solving', 'Basic coding', 'Projects']

function ensureArray(val) {
  if (Array.isArray(val)) return val
  if (val == null) return []
  return [val]
}

function ensureObject(val) {
  if (val && typeof val === 'object' && !Array.isArray(val)) return val
  return {}
}

export function normalizeExtractedSkills(raw) {
  const result = {
    coreCS: [],
    languages: [],
    web: [],
    data: [],
    cloud: [],
    testing: [],
    other: [],
  }

  if (!raw) return result

  if (Array.isArray(raw.coreCS) || Array.isArray(raw.languages)) {
    for (const key of SKILL_KEYS) {
      result[key] = ensureArray(raw[key])
    }
    if (result.other.length === 0 && Object.values(result).every((arr) => arr.length === 0)) {
      result.other = [...DEFAULT_OTHER_SKILLS]
    }
    return result
  }

  const byCategory = raw.byCategory || {}
  const map = {
    coreCS: byCategory.coreCS?.skills,
    languages: byCategory.languages?.skills,
    web: byCategory.web?.skills,
    data: byCategory.data?.skills,
    cloud: byCategory.cloudDevOps?.skills,
    testing: byCategory.testing?.skills,
    other: byCategory.other?.skills,
  }

  for (const [key, skills] of Object.entries(map)) {
    result[key] = ensureArray(skills)
  }

  if (raw.fallback && Object.values(result).every((arr) => arr.length === 0)) {
    result.other = [...DEFAULT_OTHER_SKILLS]
  }

  return result
}

export function toByCategoryForDisplay(extractedSkills) {
  const labels = {
    coreCS: 'Core CS',
    languages: 'Languages',
    web: 'Web',
    data: 'Data',
    cloud: 'Cloud/DevOps',
    testing: 'Testing',
    other: 'Other',
  }
  const byCategory = {}
  for (const key of SKILL_KEYS) {
    const skills = extractedSkills?.[key]
    if (Array.isArray(skills) && skills.length > 0) {
      byCategory[key] = { label: labels[key], skills }
    }
  }
  return byCategory
}

export function normalizeRoundMapping(raw) {
  if (!Array.isArray(raw)) return []
  return raw.map((r) => ({
    roundTitle: r.roundTitle || r.round || '',
    focusAreas: Array.isArray(r.focusAreas) ? r.focusAreas : r.focus ? [r.focus] : [],
    whyItMatters: r.whyItMatters || r.whyMatters || '',
  }))
}

export function normalizeChecklist(raw) {
  if (!Array.isArray(raw)) return []
  return raw.map((c) => ({
    roundTitle: c.roundTitle || c.round || '',
    items: ensureArray(c.items),
  }))
}

export function normalizePlan7Days(raw) {
  if (!Array.isArray(raw)) return []
  return raw.map((p) => ({
    day: p.day || '',
    focus: p.focus || p.title || '',
    tasks: ensureArray(p.tasks || p.items),
  }))
}

export function computeFinalScore(baseScore, skillConfidenceMap) {
  let score = baseScore
  const map = ensureObject(skillConfidenceMap)
  for (const status of Object.values(map)) {
    score += status === 'know' ? 2 : -2
  }
  return Math.max(0, Math.min(100, score))
}

export function createEntry(input) {
  const now = new Date().toISOString()
  const extractedSkills = normalizeExtractedSkills(input.extractedSkills)
  const baseScore = typeof input.baseScore === 'number' ? input.baseScore : input.readinessScore ?? 0
  const skillConfidenceMap = ensureObject(input.skillConfidenceMap)
  const finalScore = computeFinalScore(baseScore, skillConfidenceMap)

  return {
    id: input.id || crypto.randomUUID(),
    createdAt: input.createdAt || now,
    updatedAt: input.updatedAt || now,
    company: typeof input.company === 'string' ? input.company : '',
    role: typeof input.role === 'string' ? input.role : '',
    jdText: typeof input.jdText === 'string' ? input.jdText : '',
    extractedSkills,
    roundMapping: normalizeRoundMapping(input.roundMapping),
    checklist: normalizeChecklist(input.checklist),
    plan7Days: normalizePlan7Days(input.plan7Days || input.plan),
    questions: ensureArray(input.questions),
    baseScore,
    skillConfidenceMap,
    finalScore,
    companyIntel: input.companyIntel || null,
  }
}

export function normalizeEntry(raw) {
  if (!raw || typeof raw !== 'object') return null
  try {
    return createEntry(raw)
  } catch {
    return null
  }
}

export function isValidEntry(entry) {
  if (!entry || typeof entry !== 'object') return false
  if (!entry.id || typeof entry.id !== 'string') return false
  if (typeof entry.jdText !== 'string') return false
  const skills = entry.extractedSkills
  if (!skills || typeof skills !== 'object') return false
  return true
}
