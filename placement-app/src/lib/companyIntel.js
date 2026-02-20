const ENTERPRISE_COMPANIES = [
  'amazon', 'google', 'microsoft', 'meta', 'apple', 'netflix',
  'infosys', 'tcs', 'wipro', 'hcl', 'cognizant', 'accenture',
  'capgemini', 'ibm', 'oracle', 'sap', 'salesforce', 'adobe',
  'intel', 'nvidia', 'qualcomm', 'cisco', 'vmware', 'dell',
  'hp', 'jpmorgan', 'goldman', 'morgan stanley', 'deloitte',
  'ey', 'kpmg', 'pwc', 'tech mahindra', 'ltimindtree', 'lti',
]

const INDUSTRY_KEYWORDS = {
  fintech: ['finance', 'banking', 'fintech', 'payment', 'lending'],
  ecommerce: ['ecommerce', 'e-commerce', 'retail', 'marketplace'],
  healthtech: ['healthcare', 'health tech', 'medical', 'pharma'],
  edtech: ['education', 'edtech', 'learning', 'course'],
  saas: ['saas', 'software as a service', 'subscription'],
  product: ['product', 'b2b', 'b2c'],
}

export function getCompanyIntel(company, jdText, extractedSkills) {
  if (!company || !company.trim()) return null

  const name = company.trim()
  const text = (jdText || '').toLowerCase()
  const companyLower = name.toLowerCase()

  const size = getSizeCategory(companyLower)
  const industry = inferIndustry(text, companyLower)
  const hiringFocus = getHiringFocus(size, extractedSkills)

  return {
    companyName: name,
    industry,
    sizeCategory: size,
    sizeLabel: getSizeLabel(size),
    hiringFocus,
  }
}

function getSizeCategory(companyLower) {
  const isEnterprise = ENTERPRISE_COMPANIES.some((c) => companyLower.includes(c))
  if (isEnterprise) return 'enterprise'
  return 'startup'
}

function getSizeLabel(size) {
  switch (size) {
    case 'enterprise':
      return 'Enterprise (2000+)'
    case 'mid-size':
      return 'Mid-size (200–2000)'
    case 'startup':
    default:
      return 'Startup (<200)'
  }
}

function inferIndustry(text, companyLower) {
  for (const [industry, keywords] of Object.entries(INDUSTRY_KEYWORDS)) {
    if (keywords.some((kw) => text.includes(kw) || companyLower.includes(kw))) {
      return industry.charAt(0).toUpperCase() + industry.slice(1)
    }
  }
  return 'Technology Services'
}

function getHiringFocus(size, extractedSkills) {
  const hasDSA = !!extractedSkills?.byCategory?.coreCS
  const hasWeb = !!extractedSkills?.byCategory?.web

  if (size === 'enterprise') {
    return [
      'Structured DSA and core CS fundamentals',
      'Algorithmic problem-solving and complexity analysis',
      'System design basics and scalability',
      'Behavioral and STAR-based interviews',
    ]
  }

  if (size === 'startup') {
    return [
      'Practical problem-solving and stack depth',
      'Hands-on coding and project discussion',
      'Culture fit and ownership mindset',
      'Quick iteration and learning agility',
    ]
  }

  return [
    'Balanced technical and practical skills',
    'Core fundamentals with applied knowledge',
  ]
}
