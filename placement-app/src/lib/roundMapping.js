export function getRoundMapping(companyIntel, extractedSkills) {
  const size = companyIntel?.sizeCategory || 'startup'
  const hasDSA = !!extractedSkills?.byCategory?.coreCS
  const hasWeb = !!extractedSkills?.byCategory?.web
  const hasData = !!extractedSkills?.byCategory?.data
  const hasCloud = !!extractedSkills?.byCategory?.cloudDevOps

  if (size === 'enterprise' && hasDSA) {
    return [
      {
        round: 'Round 1: Online Test',
        focus: 'DSA + Aptitude',
        whyMatters: 'Filters candidates on core problem-solving and logical ability before technical depth.',
      },
      {
        round: 'Round 2: Technical',
        focus: 'DSA + Core CS',
        whyMatters: 'Validates fundamentals in data structures, algorithms, and computer science concepts.',
      },
      {
        round: 'Round 3: Tech + Projects',
        focus: 'System design, projects, stack',
        whyMatters: 'Assesses ability to build scalable systems and apply knowledge to real problems.',
      },
      {
        round: 'Round 4: HR',
        focus: 'Culture fit, behavioral',
        whyMatters: 'Ensures alignment with company values and team dynamics.',
      },
    ]
  }

  if (size === 'enterprise') {
    return [
      {
        round: 'Round 1: Aptitude / Screening',
        focus: 'Quantitative + Logical',
        whyMatters: 'Initial filter for analytical and reasoning skills.',
      },
      {
        round: 'Round 2: Technical',
        focus: 'Core CS + Domain',
        whyMatters: 'Tests domain knowledge and technical depth.',
      },
      {
        round: 'Round 3: Projects / System',
        focus: 'Projects, design',
        whyMatters: 'Evaluates practical application and design thinking.',
      },
      {
        round: 'Round 4: HR',
        focus: 'Behavioral',
        whyMatters: 'Assesses fit with company culture and values.',
      },
    ]
  }

  if (size === 'startup' && (hasWeb || hasData)) {
    return [
      {
        round: 'Round 1: Practical Coding',
        focus: hasWeb ? 'React/Node, APIs' : 'SQL, data modeling',
        whyMatters: 'Startups prioritize hands-on skills and quick delivery.',
      },
      {
        round: 'Round 2: System Discussion',
        focus: 'Architecture, trade-offs',
        whyMatters: 'Tests ability to reason about design and make pragmatic choices.',
      },
      {
        round: 'Round 3: Culture Fit',
        focus: 'Values, ownership, growth',
        whyMatters: 'Small teams need strong alignment and self-direction.',
      },
    ]
  }

  if (size === 'startup') {
    return [
      {
        round: 'Round 1: Coding / Problem-solving',
        focus: 'Practical coding',
        whyMatters: 'Direct assessment of coding ability and approach.',
      },
      {
        round: 'Round 2: Technical Discussion',
        focus: 'Projects + stack',
        whyMatters: 'Understanding of your work and technical choices.',
      },
      {
        round: 'Round 3: Culture Fit',
        focus: 'Values, motivation',
        whyMatters: 'Ensures mutual fit for a fast-paced environment.',
      },
    ]
  }

  return [
    {
      round: 'Round 1: Screening',
      focus: 'Aptitude / Basics',
      whyMatters: 'Initial assessment of foundational skills.',
    },
    {
      round: 'Round 2: Technical',
      focus: 'Core + Domain',
      whyMatters: 'Technical depth and domain knowledge.',
    },
    {
      round: 'Round 3: HR',
      focus: 'Behavioral',
      whyMatters: 'Culture and values alignment.',
    },
  ]
}
