export const countries = [
  'United States', 'Germany', 'China', 'Japan', 'United Kingdom',
  'France', 'Canada', 'Australia', 'UAE', 'South Korea',
  'Switzerland', 'Netherlands', 'Turkey', 'Russia',
  'India', 'Brazil', 'Singapore', 'Israel', 'Saudi Arabia',
  'Italy', 'Spain', 'Sweden', 'Norway', 'Poland',
  'Indonesia', 'Vietnam', 'Thailand', 'Mexico', 'Argentina',
  'Egypt', 'Nigeria', 'Kenya', 'South Africa', 'Colombia',
  'Chile', 'Peru', 'Czech Republic', 'Austria', 'Belgium',
  'Denmark', 'Finland', 'Ireland', 'Portugal', 'Greece',
  'Hungary', 'Romania', 'Croatia', 'Slovakia', 'Slovenia',
  'Estonia', 'Latvia', 'Lithuania', 'Iceland', 'Luxembourg',
  'Malaysia', 'Philippines', 'Bangladesh', 'Pakistan', 'Sri Lanka',
  'New Zealand', 'Morocco', 'Tunisia', 'Ghana', 'Tanzania',
  'Ethiopia', 'Uganda', 'Senegal', 'Cameroon', 'Ivory Coast',
  'Kazakhstan', 'Uzbekistan', 'Georgia', 'Armenia', 'Azerbaijan',
  'Jordan', 'Lebanon', 'Qatar', 'Kuwait', 'Bahrain',
  'Oman', 'Iraq', 'Iran', 'Syria', 'Yemen',
];

export const niches = [
  'IT & Software', 'Construction', 'Glass Industry', 'Pharmaceuticals',
  'Finance & Banking', 'Energy (Oil & Gas)', 'Logistics & Transport',
  'Agritech', 'Telecommunications', 'Automotive',
  'Aerospace & Defense', 'Mining & Metals', 'Healthcare & MedTech',
  'Real Estate', 'Retail & E-commerce', 'Food & Beverage',
  'Chemical Industry', 'Textile & Fashion', 'Entertainment & Media',
  'Education & EdTech', 'Tourism & Hospitality', 'Marine & Shipbuilding',
  'Nuclear Energy', 'Renewable Energy', 'Water & Utilities',
  'Legal & Compliance', 'Consulting & Advisory', 'Insurance',
  'Cybersecurity', 'AI & Machine Learning', 'Blockchain & Web3',
  'Biotechnology', 'Quantum Computing', 'Space Technology',
  'Robotics & Automation', '3D Printing & Additive Manufacturing',
  'IoT & Smart Cities', 'EV & Autonomous Vehicles', 'Drone Technology',
  'VR/AR & Metaverse', 'Green Tech & Carbon Capture',
];

export const groups = ['Alpha', 'Beta', 'Gamma', 'Delta', 'Omega'];

export const statuses = ['active', 'pending', 'completed', 'archived'];

export const agents = [
  {
    id: 'scraper',
    nameKey: 'agentScraper',
    descriptionKey: 'agentScraperDesc',
    icon: 'Radio',
    metricsKey: ['agentRecords', 'agentSpeed', 'agentUptime'],
  },
  {
    id: 'classifier',
    nameKey: 'agentClassifier',
    descriptionKey: 'agentClassifierDesc',
    icon: 'Circle',
    metricsKey: ['agentAccuracy', 'agentCategories', 'agentProcessed'],
  },
  {
    id: 'strategist',
    nameKey: 'agentStrategist',
    descriptionKey: 'agentStrategistDesc',
    icon: 'CircleDot',
    metricsKey: ['agentInsights', 'agentConfidence', 'agentReports'],
  },
  {
    id: 'translator',
    nameKey: 'agentTranslator',
    descriptionKey: 'agentTranslatorDesc',
    icon: 'Globe',
    metricsKey: ['agentLanguages', 'agentTranslations', 'agentAccuracy'],
  },
  {
    id: 'generator',
    nameKey: 'agentGenerator',
    descriptionKey: 'agentGeneratorDesc',
    icon: 'FileText',
    metricsKey: ['agentDocuments', 'agentTemplates', 'agentGenerated'],
  },
  {
    id: 'sentinel',
    nameKey: 'agentSentinel',
    descriptionKey: 'agentSentinelDesc',
    icon: 'Shield',
    metricsKey: ['agentThreats', 'agentScans', 'agentBlocked'],
  },
  {
    id: 'oracle',
    nameKey: 'agentOracle',
    descriptionKey: 'agentOracleDesc',
    icon: 'Brain',
    metricsKey: ['agentPredictions', 'agentAccuracy', 'agentModels'],
  },
  {
    id: 'navigator',
    nameKey: 'agentNavigator',
    descriptionKey: 'agentNavigatorDesc',
    icon: 'Compass',
    metricsKey: ['agentRoutes', 'agentOptimized', 'agentSaved'],
  },
];

export const priorityLevels = ['high', 'medium', 'low'] as const;

export const projectCategories = [
  'Strategic Initiative',
  'Operational Project',
  'Research & Development',
  'Market Expansion',
  'Risk Assessment',
  'Compliance Audit',
  'Technology Migration',
  'Partnership Development',
  'Infrastructure Upgrade',
  'Talent Acquisition',
  'Brand Development',
  'Supply Chain Optimization',
  'Digital Transformation',
  'Sustainability Program',
  'M&A Due Diligence',
];

export const budgetRanges = [
  '< $1M', '$1M - $5M', '$5M - $10M', '$10M - $50M',
  '$50M - $100M', '$100M - $500M', '$500M - $1B', '> $1B',
];

export const riskLevels = ['low', 'medium', 'high', 'critical'] as const;
