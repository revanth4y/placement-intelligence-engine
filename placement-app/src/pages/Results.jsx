import { useEffect, useState, useCallback } from 'react'
import { useLocation, useSearchParams } from 'react-router-dom'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '../components/ui/card'
import { getEntryById, getLatestEntry, updateEntry } from '../lib/storage'
import { getCompanyIntel } from '../lib/companyIntel'
import { getRoundMapping } from '../lib/roundMapping'
import { toByCategoryForDisplay, computeFinalScore } from '../lib/schema'

function getAllSkillsFromNormalized(extractedSkills) {
  if (!extractedSkills || typeof extractedSkills !== 'object') return []
  const keys = ['coreCS', 'languages', 'web', 'data', 'cloud', 'testing', 'other']
  return keys.flatMap((k) => extractedSkills[k] || [])
}

function getByCategory(entry) {
  const skills = entry?.extractedSkills
  if (skills?.byCategory) return skills.byCategory
  return toByCategoryForDisplay(skills)
}

function getSkillConfidenceMap(entry) {
  const skills = getAllSkillsFromNormalized(entry?.extractedSkills)
  const existing = entry?.skillConfidenceMap || {}
  const map = {}
  skills.forEach((s) => {
    map[s] = existing[s] || 'practice'
  })
  return map
}

function formatPlanText(plan) {
  if (!plan?.length) return ''
  return plan
    .map((d) => {
      const day = d.day || ''
      const focus = d.focus || d.title || ''
      const tasks = d.tasks || d.items || []
      return `${day}: ${focus}\n${tasks.map((i) => `  - ${i}`).join('\n')}`
    })
    .join('\n\n')
}

function formatChecklistText(checklist) {
  if (!checklist?.length) return ''
  return checklist
    .map((r) => {
      const title = r.roundTitle || r.round || ''
      const items = r.items || []
      return `${title}\n${items.map((i) => `  - ${i}`).join('\n')}`
    })
    .join('\n\n')
}

function formatQuestionsText(questions) {
  if (!questions?.length) return ''
  return questions.map((q, i) => `${i + 1}. ${q}`).join('\n')
}

export default function Results() {
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const [entry, setEntry] = useState(null)
  const [skillConfidenceMap, setSkillConfidenceMap] = useState({})

  useEffect(() => {
    const id = searchParams.get('id')
    const fromState = location.state?.entry

    let loaded = null
    if (id) loaded = getEntryById(id)
    else if (fromState) loaded = fromState
    else loaded = getLatestEntry()

    setEntry(loaded)
    if (loaded) {
      setSkillConfidenceMap(getSkillConfidenceMap(loaded))
    }
  }, [searchParams, location.state])

  const persistConfidence = useCallback(
    (newMap) => {
      if (!entry?.id) return
      const baseScore = entry.baseScore ?? entry.readinessScore ?? 0
      const finalScore = computeFinalScore(baseScore, newMap)
      updateEntry(entry.id, { skillConfidenceMap: newMap, finalScore })
    },
    [entry?.id, entry?.baseScore, entry?.readinessScore]
  )

  const toggleSkill = (skill) => {
    const next = skillConfidenceMap[skill] === 'know' ? 'practice' : 'know'
    const newMap = { ...skillConfidenceMap, [skill]: next }
    setSkillConfidenceMap(newMap)
    persistConfidence(newMap)
  }

  const copyToClipboard = async (text, label) => {
    try {
      await navigator.clipboard.writeText(text)
      alert(`Copied: ${label}`)
    } catch {
      alert('Copy failed')
    }
  }

  const downloadTxt = () => {
    const { company, role, extractedSkills, checklist, plan7Days, plan, questions } = entry
    const baseScore = entry.baseScore ?? entry.readinessScore ?? 0
    const finalScore = entry.finalScore ?? computeFinalScore(baseScore, entry.skillConfidenceMap || {})
    const intel = entry.companyIntel || (company ? getCompanyIntel(company, entry.jdText, { byCategory: getByCategory(entry) }) : null)
    const rounds = entry.roundMapping || (intel ? getRoundMapping(intel, { byCategory: getByCategory(entry) }) : [])
    const header = `${company || 'Company'} — ${role || 'Role'}\nReadiness Score: ${finalScore}\n\n`
    const byCat = getByCategory(entry)
    const skills = Object.keys(byCat).length > 0
      ? Object.entries(byCat)
          .map(([, v]) => `${v.label}: ${(v.skills || []).join(', ')}`)
          .join('\n')
      : 'General fresher stack'
    const intelSection = intel
      ? `\n=== COMPANY INTEL ===\n${intel.companyName}\nIndustry: ${intel.industry}\nSize: ${intel.sizeLabel}\n\nTypical Hiring Focus:\n${intel.hiringFocus.map((h) => `- ${h}`).join('\n')}`
      : ''
    const roundSection =
      rounds.length > 0
        ? `\n=== EXPECTED ROUND FLOW ===\n${rounds.map((r, i) => {
            const round = r.roundTitle || r.round || ''
            const focus = Array.isArray(r.focusAreas) ? r.focusAreas.join(', ') : r.focus || ''
            const why = r.whyItMatters || r.whyMatters || ''
            return `${i + 1}. ${round}\n   Focus: ${focus}\n   Why: ${why}`
          }).join('\n\n')}`
        : ''
    const sections = [
      '=== KEY SKILLS ===',
      skills,
      intelSection,
      roundSection,
      '\n=== ROUND-WISE CHECKLIST ===',
      formatChecklistText(checklist),
      '\n=== 7-DAY PLAN ===',
      formatPlanText(plan7Days || plan),
      '\n=== 10 LIKELY QUESTIONS ===',
      formatQuestionsText(questions),
    ].filter(Boolean)
    const full = header + sections.join('\n\n')
    const blob = new Blob([full], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `placement-prep-${(company || 'analysis').replace(/\s+/g, '-')}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (!entry) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-slate-900">Results</h2>
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-slate-600">No analysis yet. Analyze a job description first.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const { company, role, checklist, questions } = entry
  const plan = entry.plan7Days || entry.plan
  const baseScore = entry.baseScore ?? entry.readinessScore ?? 0
  const finalScore = entry.finalScore ?? computeFinalScore(baseScore, skillConfidenceMap)
  const byCategory = getByCategory(entry)
  const companyIntel = entry.companyIntel || (company ? getCompanyIntel(company, entry.jdText, { byCategory }) : null)
  const roundMapping = entry.roundMapping || (companyIntel ? getRoundMapping(companyIntel, { byCategory }) : [])
  const circumference = 2 * Math.PI * 45
  const strokeDashoffset = circumference - (finalScore / 100) * circumference

  const weakSkills = Object.entries(skillConfidenceMap)
    .filter(([, v]) => v === 'practice')
    .slice(0, 3)
    .map(([s]) => s)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900 mb-1">Analysis Results</h2>
        <p className="text-slate-600">
          {company && role ? `${company} — ${role}` : company || role || 'Job Description Analysis'}
        </p>
      </div>

      {/* Readiness Score */}
      <Card>
        <CardHeader>
          <CardTitle>Readiness Score</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <div className="relative w-40 h-40">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="hsl(245, 58%, 90%)" strokeWidth="8" />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="hsl(245, 58%, 51%)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-500 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-slate-900">{finalScore}</span>
              <span className="text-sm text-slate-500">/ 100</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Company Intel */}
      {companyIntel && (
        <Card>
          <CardHeader>
            <CardTitle>Company Intel</CardTitle>
            <p className="text-xs text-slate-500 mt-1">Demo Mode: Company intel generated heuristically.</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-slate-500">Company</p>
                <p className="text-slate-900">{companyIntel.companyName}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Industry</p>
                <p className="text-slate-900">{companyIntel.industry}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Estimated Size</p>
                <p className="text-slate-900">{companyIntel.sizeLabel}</p>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 mb-2">Typical Hiring Focus</p>
              <ul className="list-disc list-inside text-slate-600 space-y-1">
                {companyIntel.hiringFocus.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Round Mapping Timeline */}
      {companyIntel && roundMapping.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Expected Round Flow</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative pl-6 border-l-2 border-slate-200 space-y-0">
              {roundMapping.map((r, i) => (
                <div key={i} className="relative -left-6 flex gap-4 pb-6 last:pb-0">
                  <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center font-semibold text-sm shrink-0 border-2 border-white">
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0 pt-0.5">
                    <p className="font-medium text-slate-900">{r.roundTitle || r.round}</p>
                    <p className="text-sm text-primary mt-0.5">
                      {Array.isArray(r.focusAreas) ? r.focusAreas.join(', ') : r.focus}
                    </p>
                    <p className="text-sm text-slate-500 mt-2">Why this round matters: {r.whyItMatters || r.whyMatters}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Key Skills with toggles */}
      <Card>
        <CardHeader>
          <CardTitle>Key Skills Extracted</CardTitle>
        </CardHeader>
        <CardContent>
          {Object.keys(byCategory).length === 0 ? (
            <p className="text-slate-600">General fresher stack</p>
          ) : (
            <div className="space-y-4">
              {Object.entries(byCategory).map(([key, { label, skills }]) => (
                <div key={key}>
                  <p className="text-sm font-medium text-slate-500 mb-2">{label}</p>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((s) => {
                      const status = skillConfidenceMap[s] || 'practice'
                      return (
                        <button
                          key={s}
                          onClick={() => toggleSkill(s)}
                          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                            status === 'know'
                              ? 'bg-primary/20 text-primary border border-primary/40'
                              : 'bg-slate-100 text-slate-600 border border-slate-200'
                          }`}
                        >
                          {s}
                          <span className="text-xs opacity-80">
                            {status === 'know' ? 'I know this' : 'Need practice'}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Round-wise Checklist */}
      <Card>
        <CardHeader>
          <CardTitle>Round-wise Preparation Checklist</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {(checklist || []).map((round) => (
            <div key={round.roundTitle || round.round}>
              <p className="font-medium text-slate-900 mb-2">{round.roundTitle || round.round}</p>
              <ul className="space-y-1 list-disc list-inside text-slate-600">
                {round.items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* 7-day Plan */}
      <Card>
        <CardHeader>
          <CardTitle>7-Day Plan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {(plan || []).map((day) => (
            <div key={day.day} className="border-b border-slate-100 pb-4 last:border-0 last:pb-0">
              <p className="font-medium text-slate-900">
                {day.day}: {day.focus || day.title}
              </p>
              <ul className="mt-2 space-y-1 list-disc list-inside text-slate-600 text-sm">
                {(day.tasks || day.items || []).map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* 10 Likely Questions */}
      <Card>
        <CardHeader>
          <CardTitle>10 Likely Interview Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-2 list-decimal list-inside text-slate-600">
            {(questions || []).map((q, i) => (
              <li key={i}>{q}</li>
            ))}
          </ol>
        </CardContent>
      </Card>

      {/* Export */}
      <Card>
        <CardHeader>
          <CardTitle>Export</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <button
            onClick={() => copyToClipboard(formatPlanText(plan), '7-day plan')}
            className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-sm font-medium"
          >
            Copy 7-day plan
          </button>
          <button
            onClick={() => copyToClipboard(formatChecklistText(checklist), 'Round checklist')}
            className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-sm font-medium"
          >
            Copy round checklist
          </button>
          <button
            onClick={() => copyToClipboard(formatQuestionsText(questions), '10 questions')}
            className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-sm font-medium"
          >
            Copy 10 questions
          </button>
          <button
            onClick={downloadTxt}
            className="px-4 py-2 rounded-lg font-medium text-white bg-primary hover:bg-primary-hover transition-colors"
          >
            Download as TXT
          </button>
        </CardContent>
      </Card>

      {/* Action Next */}
      <Card className="border-primary/30 bg-primary/5">
        <CardHeader>
          <CardTitle>Action Next</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {weakSkills.length > 0 ? (
            <>
              <p className="text-sm text-slate-600">Top 3 weak skills:</p>
              <ul className="list-disc list-inside text-slate-700">
                {weakSkills.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
              <p className="text-slate-700 font-medium">Start Day 1 plan now.</p>
            </>
          ) : (
            <p className="text-slate-600">All skills marked as known. Keep revising and stay confident.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
