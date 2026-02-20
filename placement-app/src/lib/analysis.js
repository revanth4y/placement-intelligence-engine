import { SKILL_CATEGORIES } from './skillCategories'

export function extractSkills(jdText) {
  if (!jdText || typeof jdText !== 'string') {
    return { byCategory: {}, all: [], fallback: 'General fresher stack' }
  }

  const text = jdText.toLowerCase()
  const byCategory = {}
  const all = []

  for (const [key, { label, keywords }] of Object.entries(SKILL_CATEGORIES)) {
    const found = keywords.filter((kw) => {
      const escaped = kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      if (kw === 'C') {
        return /\bC(?!\+\+|#)\b/i.test(text)
      }
      return new RegExp(`\\b${escaped}\\b`, 'i').test(text)
    })
    if (found.length > 0) {
      byCategory[key] = { label, skills: found }
      all.push(...found)
    }
  }

  const fallback = Object.keys(byCategory).length === 0 ? 'General fresher stack' : null
  if (fallback) {
    byCategory.other = { label: 'Other', skills: ['Communication', 'Problem solving', 'Basic coding', 'Projects'] }
  }
  return { byCategory, all: [...new Set(all)], fallback }
}

export function generateChecklist(extractedSkills) {
  const { byCategory, fallback } = extractedSkills
  const hasDSA = !!byCategory.coreCS
  const hasWeb = !!byCategory.web
  const hasData = !!byCategory.data
  const hasCloud = !!byCategory.cloudDevOps
  const hasTesting = !!byCategory.testing

  return [
    {
      round: 'Round 1: Aptitude / Basics',
      items: [
        'Revise quantitative aptitude (percentages, ratios, time-speed)',
        'Practice logical reasoning and puzzles',
        'Brush up verbal ability and comprehension',
        'Review basic CS fundamentals (binary, number systems)',
        'Practice time-bound mock tests',
        hasDSA && 'Quick mental math warm-up',
        hasWeb && 'Basic HTML/CSS concepts',
        'Company background and values research',
      ].filter(Boolean).slice(0, 8),
    },
    {
      round: 'Round 2: DSA + Core CS',
      items: [
        hasDSA && 'Arrays, Strings, HashMaps - common patterns',
        hasDSA && 'Trees, Graphs - traversal and BFS/DFS',
        hasDSA && 'Dynamic Programming - 1D and 2D problems',
        hasDSA && 'Sorting, Searching, Two pointers',
        byCategory.coreCS && 'OOP concepts - encapsulation, inheritance, polymorphism',
        byCategory.coreCS && 'DBMS - normalization, indexing, transactions',
        byCategory.coreCS && 'OS - processes, threads, scheduling',
        byCategory.coreCS && 'Networks - TCP/IP, HTTP, REST basics',
      ].filter(Boolean).slice(0, 8),
    },
    {
      round: 'Round 3: Tech Interview (Projects + Stack)',
      items: [
        'Prepare 2–3 project deep-dives with STAR format',
        hasWeb && 'Explain React/Vue lifecycle and hooks',
        hasWeb && 'REST vs GraphQL, API design',
        hasData && 'SQL queries - joins, subqueries, optimization',
        hasData && 'NoSQL vs SQL trade-offs',
        hasCloud && 'Docker basics, containerization',
        hasCloud && 'CI/CD pipeline understanding',
        hasTesting && 'Unit vs integration testing approach',
      ].filter(Boolean).slice(0, 8),
    },
    {
      round: 'Round 4: Managerial / HR',
      items: [
        'Why this company? Why this role?',
        'Strengths, weaknesses, and growth areas',
        'Past team conflicts and resolution',
        'Handling deadlines and prioritization',
        'Career goals and 5-year vision',
        'Questions to ask the interviewer',
        'Salary expectations (if applicable)',
        'Availability and notice period',
      ].filter(Boolean).slice(0, 8),
    },
  ]
}

export function generatePlan(extractedSkills) {
  const { byCategory } = extractedSkills
  const hasDSA = !!byCategory.coreCS
  const hasWeb = !!byCategory.web
  const hasData = !!byCategory.data

  const day1_2 = [
    'Revise core CS: OOP, DBMS, OS, Networks',
    hasDSA && 'Data structures basics: arrays, linked lists, stacks, queues',
    'Aptitude: quantitative and logical reasoning',
    'Company research and role alignment',
  ].filter(Boolean)

  const day3_4 = [
    'DSA: Trees, Graphs, DP patterns',
    'Coding practice: 3–4 problems daily',
    'Time complexity analysis',
    'Mock coding rounds',
  ]

  const day5 = [
    'Project deep-dive preparation',
    'Resume alignment with JD',
    hasWeb && 'Frontend/backend project walkthrough',
    hasData && 'Database design for projects',
  ].filter(Boolean)

  const day6 = [
    'Mock interview questions',
    'Behavioral STAR stories',
    'System design basics (if applicable)',
  ]

  const day7 = [
    'Revision of weak areas',
    'Final DSA pattern recap',
    'Relax and stay confident',
  ]

  return [
    { day: 'Day 1–2', title: 'Basics + Core CS', items: day1_2 },
    { day: 'Day 3–4', title: 'DSA + Coding Practice', items: day3_4 },
    { day: 'Day 5', title: 'Project + Resume Alignment', items: day5 },
    { day: 'Day 6', title: 'Mock Interview Questions', items: day6 },
    { day: 'Day 7', title: 'Revision + Weak Areas', items: day7 },
  ]
}

export function generateQuestions(extractedSkills) {
  const { byCategory } = extractedSkills
  const questions = []

  if (byCategory.data?.skills.some((s) => /sql|mysql|postgres/i.test(s))) {
    questions.push('Explain indexing in databases and when it helps performance.')
  }
  if (byCategory.data) {
    questions.push('What is the difference between SQL and NoSQL? When would you choose each?')
  }
  if (byCategory.web?.skills.some((s) => /react/i.test(s))) {
    questions.push('Explain state management options in React (useState, Context, Redux).')
  }
  if (byCategory.web?.skills.some((s) => /react/i.test(s))) {
    questions.push('What is the virtual DOM and how does React use it?')
  }
  if (byCategory.coreCS) {
    questions.push('How would you optimize search in sorted data? Discuss time complexity.')
  }
  if (byCategory.coreCS) {
    questions.push('Explain time complexity of common sorting algorithms.')
  }
  if (byCategory.coreCS?.skills.some((s) => /oop|object/i.test(s))) {
    questions.push('Explain polymorphism and give a real-world example.')
  }
  if (byCategory.cloudDevOps?.skills.some((s) => /docker/i.test(s))) {
    questions.push('What is containerization? How does Docker differ from VMs?')
  }
  if (byCategory.cloudDevOps?.skills.some((s) => /kubernetes|k8s/i.test(s))) {
    questions.push('Explain Kubernetes pods and deployments at a high level.')
  }
  if (byCategory.web?.skills.some((s) => /rest|api/i.test(s))) {
    questions.push('REST vs GraphQL: when would you choose one over the other?')
  }
  if (byCategory.coreCS?.skills.some((s) => /dbms|database/i.test(s))) {
    questions.push('Explain ACID properties in databases.')
  }
  if (byCategory.testing) {
    questions.push('How do you approach writing unit tests for a new feature?')
  }
  if (byCategory.languages?.skills.some((s) => /javascript|js/i.test(s))) {
    questions.push('Explain event loop and async behavior in JavaScript.')
  }
  if (byCategory.coreCS) {
    questions.push('Describe a challenging technical problem you solved.')
  }
  if (byCategory.other && Object.keys(byCategory).length === 1) {
    questions.push(
      'How do you approach learning a new technology or concept?',
      'Describe a project where you demonstrated problem-solving skills.',
      'How do you communicate technical ideas to non-technical stakeholders?',
      'What is your process for debugging and fixing issues?',
      'Tell me about a time you worked in a team under pressure.',
      'How do you stay updated with industry trends?',
      'What coding practices do you follow for maintainable code?',
      'Describe your experience with version control and collaboration.',
      'How do you prioritize tasks when facing multiple deadlines?',
      'What motivates you to pursue a career in tech?'
    )
  }

  const unique = [...new Set(questions)]
  return unique.slice(0, 10)
}

export function calculateReadinessScore({ company, role, jdText }) {
  let score = 35

  const { byCategory } = extractSkills(jdText || '')
  const categoryCount = Object.keys(byCategory).length
  score += Math.min(categoryCount * 5, 30)

  if (company && company.trim().length > 0) score += 10
  if (role && role.trim().length > 0) score += 10
  if (jdText && jdText.length > 800) score += 10

  return Math.min(score, 100)
}

export function runAnalysis(company, role, jdText) {
  const extractedSkills = extractSkills(jdText)
  const checklist = generateChecklist(extractedSkills)
  const plan = generatePlan(extractedSkills)
  const questions = generateQuestions(extractedSkills)
  const readinessScore = calculateReadinessScore({ company, role, jdText })

  return {
    extractedSkills,
    checklist,
    plan,
    questions,
    readinessScore,
  }
}
