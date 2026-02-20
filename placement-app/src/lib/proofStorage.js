import { allTestsPassed } from './testChecklistStorage'

const SUBMISSION_KEY = 'prp_final_submission'
const STEPS_KEY = 'prp_steps'

const DEFAULT_STEPS = () => [false, false, false, false, false, false, false, false]

export const STEP_LABELS = [
  'Step 1: Design & setup',
  'Step 2: Landing page',
  'Step 3: Dashboard shell',
  'Step 4: JD analysis flow',
  'Step 5: Results & interactivity',
  'Step 6: History & persistence',
  'Step 7: Test checklist',
  'Step 8: Ship readiness',
]

export function getSteps() {
  try {
    const raw = localStorage.getItem(STEPS_KEY)
    if (!raw) return DEFAULT_STEPS()
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed) || parsed.length !== 8) return DEFAULT_STEPS()
    return parsed.map((v) => Boolean(v))
  } catch {
    return DEFAULT_STEPS()
  }
}

export function setSteps(steps) {
  const arr = Array.isArray(steps) ? steps.slice(0, 8) : DEFAULT_STEPS()
  const padded = [...arr]
  while (padded.length < 8) padded.push(false)
  try {
    localStorage.setItem(STEPS_KEY, JSON.stringify(padded.slice(0, 8)))
    return padded.slice(0, 8)
  } catch {
    return getSteps()
  }
}

export function setStepCompleted(index, completed) {
  const list = getSteps()
  if (index < 0 || index >= 8) return list
  list[index] = Boolean(completed)
  return setSteps(list)
}

export function allStepsCompleted() {
  const list = getSteps()
  return list.length === 8 && list.every(Boolean)
}

const EMPTY_SUBMISSION = {
  lovableUrl: '',
  githubUrl: '',
  deployedUrl: '',
}

export function getSubmission() {
  try {
    const raw = localStorage.getItem(SUBMISSION_KEY)
    if (!raw) return { ...EMPTY_SUBMISSION }
    const parsed = JSON.parse(raw)
    return {
      lovableUrl: typeof parsed.lovableUrl === 'string' ? parsed.lovableUrl : '',
      githubUrl: typeof parsed.githubUrl === 'string' ? parsed.githubUrl : '',
      deployedUrl: typeof parsed.deployedUrl === 'string' ? parsed.deployedUrl : '',
    }
  } catch {
    return { ...EMPTY_SUBMISSION }
  }
}

export function setSubmission(data) {
  const out = {
    lovableUrl: typeof data?.lovableUrl === 'string' ? data.lovableUrl.trim() : '',
    githubUrl: typeof data?.githubUrl === 'string' ? data.githubUrl.trim() : '',
    deployedUrl: typeof data?.deployedUrl === 'string' ? data.deployedUrl.trim() : '',
  }
  try {
    localStorage.setItem(SUBMISSION_KEY, JSON.stringify(out))
    return out
  } catch {
    return getSubmission()
  }
}

export function allLinksProvided() {
  const s = getSubmission()
  return Boolean(
    s.lovableUrl && s.lovableUrl.length > 0 &&
    s.githubUrl && s.githubUrl.length > 0 &&
    s.deployedUrl && s.deployedUrl.length > 0
  )
}

export function isShipped() {
  return allStepsCompleted() && allTestsPassed() && allLinksProvided()
}

export function isValidUrl(value) {
  if (!value || typeof value !== 'string') return false
  const trimmed = value.trim()
  if (trimmed.length === 0) return false
  try {
    const u = new URL(trimmed)
    return u.protocol === 'http:' || u.protocol === 'https:'
  } catch {
    return false
  }
}
