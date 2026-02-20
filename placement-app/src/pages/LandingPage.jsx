import { Link } from 'react-router-dom'
import { Code2, Video, BarChart3 } from 'lucide-react'

export default function LandingPage() {
  const features = [
    {
      icon: Code2,
      title: 'Practice Problems',
      description: 'Solve coding challenges across DSA, system design, and more.',
    },
    {
      icon: Video,
      title: 'Mock Interviews',
      description: 'Simulate real interview scenarios with AI-powered feedback.',
    },
    {
      icon: BarChart3,
      title: 'Track Progress',
      description: 'Monitor your growth with detailed analytics and insights.',
    },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-24">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 text-center mb-4">
          Ace Your Placement
        </h1>
        <p className="text-xl text-slate-600 text-center mb-10 max-w-xl">
          Practice, assess, and prepare for your dream job
        </p>
        <Link
          to="/dashboard"
          className="px-8 py-3 rounded-lg font-medium text-white bg-primary hover:bg-primary-hover transition-colors"
        >
          Get Started
        </Link>
      </main>

      {/* Features Grid */}
      <section className="px-6 py-16 bg-white">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8">
          {features.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="p-6 rounded-xl border border-slate-200 bg-slate-50/50 hover:border-primary/30 transition-colors"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Icon className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-lg font-semibold text-slate-900 mb-2">{title}</h2>
              <p className="text-slate-600">{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 text-center text-slate-500 text-sm">
        © {new Date().getFullYear()} Placement Readiness Platform. All rights reserved.
      </footer>
    </div>
  )
}
