import { Outlet, NavLink } from 'react-router-dom'
import { LayoutDashboard, Code2, ClipboardList, BookOpen, User, FileSearch, History, ClipboardCheck, Send } from 'lucide-react'
import { isShipped } from '../lib/proofStorage'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/dashboard/analyze', icon: FileSearch, label: 'Analyze JD' },
  { to: '/dashboard/history', icon: History, label: 'History' },
  { to: '/prp/07-test', icon: ClipboardCheck, label: 'Test Checklist' },
  { to: '/prp/proof', icon: Send, label: 'Proof & Submit' },
  { to: '/dashboard/practice', icon: Code2, label: 'Practice' },
  { to: '/dashboard/assessments', icon: ClipboardList, label: 'Assessments' },
  { to: '/dashboard/resources', icon: BookOpen, label: 'Resources' },
  { to: '/dashboard/profile', icon: User, label: 'Profile' },
]

export default function DashboardLayout() {
  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/dashboard'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-slate-600 hover:bg-slate-100'
                }`
              }
            >
              <Icon className="w-5 h-5" />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 px-6 flex items-center justify-between bg-white border-b border-slate-200">
          <h1 className="text-xl font-semibold text-slate-900">Placement Prep</h1>
          <div className="flex items-center gap-4">
            <span
              className={`px-3 py-1 rounded-lg text-sm font-medium border ${
                isShipped()
                  ? 'bg-green-50 text-green-700 border-green-200'
                  : 'bg-slate-100 text-slate-600 border-slate-200'
              }`}
            >
              {isShipped() ? 'Shipped' : 'In Progress'}
            </span>
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <User className="w-5 h-5 text-primary" />
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
