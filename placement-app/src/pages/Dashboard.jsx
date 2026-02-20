import { Link } from 'react-router-dom'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '../components/ui/card'
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
} from 'recharts'

const SKILL_DATA = [
  { subject: 'DSA', score: 75, fullMark: 100 },
  { subject: 'System Design', score: 60, fullMark: 100 },
  { subject: 'Communication', score: 80, fullMark: 100 },
  { subject: 'Resume', score: 85, fullMark: 100 },
  { subject: 'Aptitude', score: 70, fullMark: 100 },
]

const WEEK_DAYS = [
  { day: 'Mon', active: true },
  { day: 'Tue', active: true },
  { day: 'Wed', active: false },
  { day: 'Thu', active: true },
  { day: 'Fri', active: true },
  { day: 'Sat', active: false },
  { day: 'Sun', active: false },
]

const ASSESSMENTS = [
  { title: 'DSA Mock Test', when: 'Tomorrow, 10:00 AM' },
  { title: 'System Design Review', when: 'Wed, 2:00 PM' },
  { title: 'HR Interview Prep', when: 'Friday, 11:00 AM' },
]

function OverallReadiness() {
  const score = 72
  const max = 100
  const circumference = 2 * Math.PI * 45
  const strokeDashoffset = circumference - (score / max) * circumference

  return (
    <Card>
      <CardHeader>
        <CardTitle>Overall Readiness</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <div className="relative w-40 h-40">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="hsl(245, 58%, 90%)"
              strokeWidth="8"
            />
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
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-slate-900">{score}</span>
            <span className="text-sm text-slate-500">Readiness Score</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function SkillBreakdown() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Skill Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={SKILL_DATA}>
              <PolarGrid stroke="hsl(245, 58%, 85%)" />
              <PolarAngleAxis
                dataKey="subject"
                tick={{ fill: 'hsl(220, 10%, 40%)', fontSize: 12 }}
              />
              <PolarRadiusAxis
                angle={90}
                domain={[0, 100]}
                tick={{ fill: 'hsl(220, 10%, 50%)', fontSize: 10 }}
              />
              <Radar
                name="Score"
                dataKey="score"
                stroke="hsl(245, 58%, 51%)"
                fill="hsl(245, 58%, 51%)"
                fillOpacity={0.3}
                strokeWidth={2}
              />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

function ContinuePractice() {
  const completed = 3
  const total = 10
  const progress = (completed / total) * 100
  const isComplete = completed >= total

  return (
    <Card>
      <CardHeader>
        <CardTitle>Continue Practice</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="font-medium text-slate-900 mb-3">Dynamic Programming</p>
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-slate-500">
            <span>{completed}/{total} completed</span>
          </div>
          <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Link
          to="/dashboard/practice"
          className="px-4 py-2 rounded-lg font-medium text-white bg-primary hover:bg-primary-hover transition-colors"
        >
          {isComplete ? 'Start New Topic' : 'Continue'}
        </Link>
      </CardFooter>
    </Card>
  )
}

function WeeklyGoals() {
  const solved = 12
  const target = 20
  const progress = (solved / target) * 100

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Goals</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-slate-600">Problems Solved</span>
            <span className="font-medium text-slate-900">{solved}/{target} this week</span>
          </div>
          <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        <div className="flex justify-between gap-2">
          {WEEK_DAYS.map(({ day, active }) => (
            <div key={day} className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                  active ? 'bg-primary text-white' : 'bg-slate-200 text-slate-500'
                }`}
              >
                {day.slice(0, 1)}
              </div>
              <span className="text-xs text-slate-500 mt-1">{day}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function UpcomingAssessments() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Assessments</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {ASSESSMENTS.map(({ title, when }) => (
            <li key={title} className="flex justify-between items-start border-b border-slate-100 pb-4 last:border-0 last:pb-0">
              <div>
                <p className="font-medium text-slate-900">{title}</p>
                <p className="text-sm text-slate-500">{when}</p>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900 mb-1">Dashboard</h2>
        <p className="text-slate-600">Welcome to your placement preparation dashboard.</p>
      </div>

      <div className="flex flex-wrap gap-4 mb-4">
        <Link
          to="/dashboard/analyze"
          className="px-4 py-2 rounded-lg font-medium text-white bg-primary hover:bg-primary-hover transition-colors"
        >
          Analyze Job Description
        </Link>
        <Link
          to="/prp/07-test"
          className="px-4 py-2 rounded-lg font-medium border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
        >
          Test Checklist
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <OverallReadiness />
        <SkillBreakdown />
        <ContinuePractice />
        <WeeklyGoals />
        <UpcomingAssessments />
      </div>
    </div>
  )
}
