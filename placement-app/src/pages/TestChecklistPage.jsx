import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card'
import {
  getTestChecklist,
  setTestChecked,
  resetTestChecklist,
  allTestsPassed,
} from '../lib/testChecklistStorage'

const TESTS = [
  {
    label: 'JD required validation works',
    hint: 'Go to Analyze JD, leave JD empty — Analyze button should be disabled.',
  },
  {
    label: 'Short JD warning shows for <200 chars',
    hint: 'Paste fewer than 200 characters in JD — warning message should appear.',
  },
  {
    label: 'Skills extraction groups correctly',
    hint: 'Analyze a JD with DSA, React, SQL — skills should appear under Core CS, Web, Data.',
  },
  {
    label: 'Round mapping changes based on company + skills',
    hint: 'Try company "Amazon" + DSA vs "TechCorp" + React — round flow should differ.',
  },
  {
    label: 'Score calculation is deterministic',
    hint: 'Same JD + company + role should give same base score every time.',
  },
  {
    label: 'Skill toggles update score live',
    hint: 'On Results, toggle "I know this" / "Need practice" — score updates immediately.',
  },
  {
    label: 'Changes persist after refresh',
    hint: 'Toggle skills, refresh page — toggles and score should remain.',
  },
  {
    label: 'History saves and loads correctly',
    hint: 'Run an analysis, go to History — entry appears; click it to open Results.',
  },
  {
    label: 'Export buttons copy the correct content',
    hint: 'Use Copy 7-day plan / checklist / questions — paste elsewhere to verify.',
  },
  {
    label: 'No console errors on core pages',
    hint: 'Open DevTools Console, visit Dashboard, Analyze, Results, History — no errors.',
  },
]

export default function TestChecklistPage() {
  const [checks, setChecks] = useState(getTestChecklist())

  useEffect(() => {
    setChecks(getTestChecklist())
  }, [])

  const handleToggle = (index) => {
    const next = !checks[index]
    setTestChecked(index, next)
    setChecks(getTestChecklist())
  }

  const handleReset = () => {
    resetTestChecklist()
    setChecks(getTestChecklist())
  }

  const passed = checks.filter(Boolean).length
  const total = 10
  const allPassed = allTestsPassed()

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Test Checklist</h1>
          <p className="text-slate-600 mt-1">Verify placement readiness platform before shipping.</p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <p className="text-lg font-medium text-slate-900">
              Tests Passed: {passed} / {total}
            </p>
            {!allPassed && (
              <p className="mt-2 text-sm text-amber-700 bg-amber-50 px-3 py-2 rounded-lg">
                Fix issues before shipping.
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Checklist</CardTitle>
            <button
              onClick={handleReset}
              className="text-sm px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100"
            >
              Reset checklist
            </button>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {TESTS.map((test, index) => (
                <li key={index} className="flex gap-3 items-start">
                  <input
                    type="checkbox"
                    id={`test-${index}`}
                    checked={checks[index] || false}
                    onChange={() => handleToggle(index)}
                    className="mt-1 w-5 h-5 rounded border-slate-300 accent-primary focus:ring-primary"
                  />
                  <label htmlFor={`test-${index}`} className="flex-1 cursor-pointer">
                    <span className="font-medium text-slate-900">{test.label}</span>
                    {test.hint && (
                      <p className="text-sm text-slate-500 mt-1">How to test: {test.hint}</p>
                    )}
                  </label>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
