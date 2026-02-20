import { useNavigate } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card'
import { getHistory } from '../lib/storage'
import { computeFinalScore } from '../lib/schema'

function getDisplayScore(entry) {
  return entry?.finalScore ?? computeFinalScore(entry?.baseScore ?? entry?.readinessScore ?? 0, entry?.skillConfidenceMap || {})
}

function formatDate(iso) {
  try {
    const d = new Date(iso)
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  } catch {
    return '—'
  }
}

export default function History() {
  const navigate = useNavigate()
  const { entries, corruptedCount } = getHistory()

  const handleOpen = (id) => {
    navigate(`/dashboard/results?id=${id}`)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900 mb-1">Analysis History</h2>
        <p className="text-slate-600">View past job description analyses.</p>
      </div>

      {corruptedCount > 0 && (
        <div className="px-4 py-3 rounded-lg bg-amber-50 text-amber-800 text-sm">
          One saved entry couldn&apos;t be loaded. Create a new analysis.
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Saved Analyses</CardTitle>
        </CardHeader>
        <CardContent>
          {entries.length === 0 ? (
            <p className="text-slate-600 py-8 text-center">No analyses yet. Analyze a JD to get started.</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {entries.map((entry) => (
                <li
                  key={entry.id}
                  onClick={() => handleOpen(entry.id)}
                  className="py-4 flex justify-between items-center cursor-pointer hover:bg-slate-50 -mx-2 px-2 rounded-lg transition-colors"
                >
                  <div>
                    <p className="font-medium text-slate-900">
                      {entry.company || 'Unknown Company'} — {entry.role || 'Unknown Role'}
                    </p>
                    <p className="text-sm text-slate-500">{formatDate(entry.createdAt)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-semibold text-primary">{getDisplayScore(entry)}</span>
                    <span className="text-slate-400">/100</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
