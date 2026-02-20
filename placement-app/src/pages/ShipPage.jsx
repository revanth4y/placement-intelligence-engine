import { Link } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card'
import { allTestsPassed } from '../lib/testChecklistStorage'
import { isShipped } from '../lib/proofStorage'
import { Lock } from 'lucide-react'

export default function ShipPage() {
  const unlocked = allTestsPassed()
  const shipped = isShipped()

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Ship</h1>
          <p className="text-slate-600 mt-1">Placement Readiness Platform release.</p>
        </div>

        {shipped && (
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

        {unlocked ? (
          <Card>
            <CardHeader>
              <CardTitle>Ready to ship</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">
                {shipped
                  ? 'All conditions met. Status: Shipped.'
                  : 'All tests passed. Complete Proof & Submit (8 steps + 3 links) for Shipped status.'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-amber-200 bg-amber-50/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-amber-800">
                <Lock className="w-5 h-5" />
                Locked
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-slate-700">
                Complete all 10 items on the Test Checklist before shipping.
              </p>
              <Link
                to="/prp/07-test"
                className="inline-block px-4 py-2 rounded-lg font-medium text-white bg-primary hover:bg-primary-hover transition-colors"
              >
                Go to Test Checklist
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
