import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card'
import { runAnalysis } from '../lib/analysis'
import { getCompanyIntel } from '../lib/companyIntel'
import { getRoundMapping } from '../lib/roundMapping'
import { createEntry } from '../lib/schema'
import { saveToHistory } from '../lib/storage'

const MIN_JD_LENGTH = 200

export default function Analyze() {
  const navigate = useNavigate()
  const [company, setCompany] = useState('')
  const [role, setRole] = useState('')
  const [jdText, setJdText] = useState('')
  const [loading, setLoading] = useState(false)

  const jdTooShort = jdText.trim().length > 0 && jdText.trim().length < MIN_JD_LENGTH

  const handleAnalyze = () => {
    if (!jdText.trim()) return
    setLoading(true)
    const result = runAnalysis(company, role, jdText)
    const companyIntel = getCompanyIntel(company, jdText, result.extractedSkills)
    const roundMapping = getRoundMapping(companyIntel, result.extractedSkills)
    const rawEntry = {
      company: company.trim(),
      role: role.trim(),
      jdText: jdText.trim(),
      extractedSkills: result.extractedSkills,
      checklist: result.checklist,
      plan: result.plan,
      questions: result.questions,
      baseScore: result.readinessScore,
      companyIntel,
      roundMapping,
    }
    const entry = createEntry(rawEntry)
    const saved = saveToHistory(entry)
    setLoading(false)
    navigate('/dashboard/results', { state: { entry: saved } })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900 mb-1">Analyze Job Description</h2>
        <p className="text-slate-600">Paste a JD to extract skills and get a personalized prep plan.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Job Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Company (optional)</label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="e.g. Google, Microsoft"
              className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Role (optional)</label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. SDE, Full Stack Developer"
              className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Job Description *</label>
            <textarea
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
              placeholder="Paste the full job description here..."
              rows={12}
              className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary resize-y font-mono text-sm"
            />
            {jdTooShort && (
              <p className="mt-2 text-sm text-amber-700 bg-amber-50 px-3 py-2 rounded-lg">
                This JD is too short to analyze deeply. Paste full JD for better output.
              </p>
            )}
          </div>
          <button
            onClick={handleAnalyze}
            disabled={!jdText.trim() || loading}
            className="px-6 py-2 rounded-lg font-medium text-white bg-primary hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Analyzing...' : 'Analyze'}
          </button>
        </CardContent>
      </Card>
    </div>
  )
}
