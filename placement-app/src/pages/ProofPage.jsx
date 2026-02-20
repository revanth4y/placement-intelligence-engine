import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card'
import {
  getSteps,
  setStepCompleted,
  getSubmission,
  setSubmission,
  STEP_LABELS,
  isValidUrl,
  isShipped,
} from '../lib/proofStorage'

function buildFinalSubmissionText() {
  const s = getSubmission()
  return `------------------------------------------
Placement Readiness Platform — Final Submission

Lovable Project: ${s.lovableUrl || '(not provided)'}
GitHub Repository: ${s.githubUrl || '(not provided)'}
Live Deployment: ${s.deployedUrl || '(not provided)'}

Core Capabilities:
- JD skill extraction (deterministic)
- Round mapping engine
- 7-day prep plan
- Interactive readiness scoring
- History persistence
------------------------------------------`
}

export default function ProofPage() {
  const [steps, setStepsState] = useState(getSteps())
  const [sub, setSub] = useState(getSubmission())
  const [errors, setErrors] = useState({ lovableUrl: '', githubUrl: '', deployedUrl: '' })

  useEffect(() => {
    setStepsState(getSteps())
    setSub(getSubmission())
  }, [])

  const handleStepToggle = (index) => {
    setStepCompleted(index, !steps[index])
    setStepsState(getSteps())
  }

  const handleLinkChange = (field, value) => {
    const next = { ...sub, [field]: value }
    setSub(next)
    setSubmission(next)
    if (value.trim()) {
      setErrors((e) => ({ ...e, [field]: isValidUrl(value) ? '' : 'Enter a valid http or https URL' }))
    } else {
      setErrors((e) => ({ ...e, [field]: '' }))
    }
  }

  const handleBlur = (field) => {
    const value = sub[field]
    setSubmission({ ...sub, [field]: value })
    if (value.trim()) {
      setErrors((e) => ({ ...e, [field]: isValidUrl(value) ? '' : 'Enter a valid http or https URL' }))
    } else {
      setErrors((e) => ({ ...e, [field]: '' }))
    }
  }

  const handleCopyFinalSubmission = async () => {
    const text = buildFinalSubmissionText()
    try {
      await navigator.clipboard.writeText(text)
      alert('Final submission copied to clipboard.')
    } catch {
      alert('Copy failed.')
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Proof & Submission</h1>
          <p className="text-slate-600 mt-1">Complete steps and add artifact links for ship status.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Step Completion Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {STEP_LABELS.map((label, index) => (
                <li key={index} className="flex items-center justify-between">
                  <span className="text-slate-700">{label}</span>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-medium ${steps[index] ? 'text-green-600' : 'text-slate-400'}`}>
                      {steps[index] ? 'Completed' : 'Pending'}
                    </span>
                    <button
                      onClick={() => handleStepToggle(index)}
                      className="text-sm px-3 py-1 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
                    >
                      {steps[index] ? 'Mark pending' : 'Mark completed'}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Artifact Inputs (Required for Ship Status)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Lovable Project Link</label>
              <input
                type="url"
                value={sub.lovableUrl}
                onChange={(e) => handleLinkChange('lovableUrl', e.target.value)}
                onBlur={() => handleBlur('lovableUrl')}
                placeholder="https://..."
                className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary/20 focus:border-primary ${
                  errors.lovableUrl ? 'border-red-300' : 'border-slate-200'
                }`}
              />
              {errors.lovableUrl && <p className="mt-1 text-sm text-red-600">{errors.lovableUrl}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">GitHub Repository Link</label>
              <input
                type="url"
                value={sub.githubUrl}
                onChange={(e) => handleLinkChange('githubUrl', e.target.value)}
                onBlur={() => handleBlur('githubUrl')}
                placeholder="https://github.com/..."
                className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary/20 focus:border-primary ${
                  errors.githubUrl ? 'border-red-300' : 'border-slate-200'
                }`}
              />
              {errors.githubUrl && <p className="mt-1 text-sm text-red-600">{errors.githubUrl}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Deployed URL</label>
              <input
                type="url"
                value={sub.deployedUrl}
                onChange={(e) => handleLinkChange('deployedUrl', e.target.value)}
                onBlur={() => handleBlur('deployedUrl')}
                placeholder="https://..."
                className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary/20 focus:border-primary ${
                  errors.deployedUrl ? 'border-red-300' : 'border-slate-200'
                }`}
              />
              {errors.deployedUrl && <p className="mt-1 text-sm text-red-600">{errors.deployedUrl}</p>}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Final Submission Export</CardTitle>
          </CardHeader>
          <CardContent>
            <button
              onClick={handleCopyFinalSubmission}
              className="px-4 py-2 rounded-lg font-medium text-white bg-primary hover:bg-primary-hover transition-colors"
            >
              Copy Final Submission
            </button>
          </CardContent>
        </Card>

        {isShipped() && (
          <Card className="border-primary/30 bg-primary/5">
            <CardContent className="pt-6">
              <p className="text-slate-800 font-medium leading-relaxed">
                You built a real product.
                <br />
                Not a tutorial. Not a clone.
                <br />
                A structured tool that solves a real problem.
              </p>
              <p className="mt-3 text-slate-700">This is your proof of work.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
