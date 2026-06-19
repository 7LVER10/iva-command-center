import { Project, Locale } from './types';
import {
  AgentOutput, SynthesisOutput,
  ProjectScores, ScoreBreakdown, SourceSignal,
  ActionRecommendation, CompetitorContext, GeoNicheScenario
} from './vnext-types';

// ===== GEO ANALYST =====
function runGeoAnalyst(project: Project): AgentOutput {
  const geoRiskMap: Record<string, number> = {
    'Russia': 0.7, 'Turkey': 0.4, 'UAE': 0.2, 'Saudi Arabia': 0.25,
    'Germany': 0.15, 'United Kingdom': 0.15, 'United States': 0.2,
    'China': 0.35, 'Japan': 0.15, 'India': 0.4, 'Brazil': 0.45,
    'Qatar': 0.2, 'Switzerland': 0.1, 'France': 0.15, 'Italy': 0.2,
    'South Korea': 0.2, 'Singapore': 0.15, 'Israel': 0.3,
    'Kazakhstan': 0.35, 'UAE (Dubai)': 0.2,
  };
  const risk = geoRiskMap[project.country] ?? 0.3;
  const stability = 1 - risk;

  return {
    role: 'geo_analyst',
    signal: `Geographic assessment for ${project.country}: stability ${Math.round(stability * 100)}%, regulatory risk ${Math.round(risk * 100)}%`,
    confidence: 0.85,
    factors: [
      `Market stability: ${Math.round(stability * 100)}%`,
      `Regulatory environment: ${risk < 0.3 ? 'Favorable' : risk < 0.5 ? 'Moderate' : 'Challenging'}`,
      `Infrastructure readiness: ${risk < 0.3 ? 'High' : 'Standard'}`,
    ],
    raw_data: { country: project.country, risk, stability },
  };
}

// ===== NICHE ANALYST =====
function runNicheAnalyst(project: Project): AgentOutput {
  const nicheGrowthMap: Record<string, number> = {
    'IT & Software': 0.92, 'AI & Machine Learning': 0.95, 'Cybersecurity': 0.9,
    'Pharmaceuticals': 0.85, 'Healthcare & MedTech': 0.88, 'Biotechnology': 0.87,
    'Renewable Energy': 0.9, 'EV & Autonomous Vehicles': 0.88,
    'Construction': 0.7, 'Real Estate': 0.65, 'Finance & Banking': 0.75,
    'Logistics & Transport': 0.72, 'Telecommunications': 0.78,
    'Aerospace & Defense': 0.8, 'Automotive': 0.75, 'Mining & Metals': 0.6,
    'Glass Industry': 0.65, 'Agritech': 0.7, 'Education & EdTech': 0.75,
    'Tourism & Hospitality': 0.6, 'Energy (Oil & Gas)': 0.65,
  };
  const growth = nicheGrowthMap[project.niche] ?? 0.7;

  return {
    role: 'niche_analyst',
    signal: `Niche growth index for ${project.niche}: ${Math.round(growth * 100)}%`,
    confidence: 0.8,
    factors: [
      `Market growth rate: ${Math.round(growth * 100)}%`,
      `Demand trajectory: ${growth > 0.8 ? 'Strong upward' : growth > 0.6 ? 'Stable' : 'Moderate'}`,
      `Entry barriers: ${growth > 0.85 ? 'High (specialized)' : 'Moderate'}`,
    ],
    raw_data: { niche: project.niche, growth },
  };
}

// ===== COMPETITOR ANALYST =====
function runCompetitorAnalyst(_project: Project): AgentOutput {
  const competitorCount = Math.floor(Math.random() * 8) + 3;
  const saturation = competitorCount > 8 ? 'high' : competitorCount > 5 ? 'medium' : 'low';

  return {
    role: 'competitor_analyst',
    signal: `Competitive landscape: ${competitorCount} active players, ${saturation} saturation`,
    confidence: 0.75,
    factors: [
      `Active competitors: ${competitorCount}`,
      `Market saturation: ${saturation}`,
      `Differentiation potential: ${saturation === 'low' ? 'High' : saturation === 'medium' ? 'Moderate' : 'Requires innovation'}`,
    ],
    raw_data: { competitorCount, saturation },
  };
}

// ===== PRICING ANALYST =====
function runPricingAnalyst(project: Project): AgentOutput {
  const budgetMln = project.relevance * 1200;
  const pricingPower = project.relevance > 0.85 ? 'strong' : project.relevance > 0.7 ? 'moderate' : 'limited';

  return {
    role: 'pricing_analyst',
    signal: `Budget scale: ${budgetMln.toFixed(0)} mln, pricing power: ${pricingPower}`,
    confidence: 0.82,
    factors: [
      `Estimated budget: ${budgetMln.toFixed(0)} mln RUB`,
      `Pricing power: ${pricingPower}`,
      `Payment terms: ${budgetMln > 500 ? 'Milestone-based preferred' : 'Standard Net-30'}`,
    ],
    raw_data: { budgetMln, pricingPower },
  };
}

// ===== MARGIN ANALYST =====
function runMarginAnalyst(project: Project): AgentOutput {
  const margin = Math.round(project.relevance * 85 + (project.id % 15));
  const marginQuality = margin > 70 ? 'excellent' : margin > 50 ? 'good' : 'acceptable';

  return {
    role: 'margin_analyst',
    signal: `Projected margin: ${margin}%, quality: ${marginQuality}`,
    confidence: 0.78,
    factors: [
      `Margin projection: ${margin}%`,
      `Quality classification: ${marginQuality}`,
      `Key driver: ${project.relevance > 0.85 ? 'High relevance premium' : 'Standard market rate'}`,
    ],
    raw_data: { margin, marginQuality },
  };
}

// ===== SYNTHESIS AGENT =====
function runSynthesisAgent(
  project: Project,
  geoOutput: AgentOutput,
  nicheOutput: AgentOutput,
  competitorOutput: AgentOutput,
  pricingOutput: AgentOutput,
  _marginOutput: AgentOutput,
  locale: Locale
): SynthesisOutput {
  const avgConfidence = (
    geoOutput.confidence + nicheOutput.confidence +
    competitorOutput.confidence + pricingOutput.confidence +
    _marginOutput.confidence
  ) / 5;

  const keyFactors = [
    ...geoOutput.factors.slice(0, 1),
    ...nicheOutput.factors.slice(0, 1),
    ..._marginOutput.factors.slice(0, 1),
  ];

  const summaryKey = locale === 'ru'
    ? `${project.name}: проект в ${project.country}, ниша ${project.niche}. Релевантность ${Math.round(project.relevance * 100)}%, маржа ${Math.round(project.relevance * 85 + (project.id % 15))}%.`
    : `${project.name}: project in ${project.country}, niche ${project.niche}. Relevance ${Math.round(project.relevance * 100)}%, margin ${Math.round(project.relevance * 85 + (project.id % 15))}%.`;

  const recKey = locale === 'ru'
    ? `Рекомендация: ${project.relevance > 0.8 ? 'Высокий приоритет — рекомендуется к рассмотрению' : 'Средний приоритет — требует дополнительной оценки'}.`
    : `Recommendation: ${project.relevance > 0.8 ? 'High priority — recommended for review' : 'Medium priority — requires additional assessment'}.`;

  return {
    summary: summaryKey,
    recommendation: recKey,
    confidence: Math.round(avgConfidence * 100) / 100,
    key_factors: keyFactors,
    generated_at: new Date().toISOString(),
  };
}

// ===== SCORING ENGINE =====
function computeScores(project: Project, geoOutput: AgentOutput, nicheOutput: AgentOutput, _marginOutput: AgentOutput): ProjectScores {
  const geoData = geoOutput.raw_data as { stability: number };
  const nicheData = nicheOutput.raw_data as { growth: number };
  const marginVal = project.relevance * 85 + (project.id % 15);

  const opportunityScore: ScoreBreakdown = {
    value: Math.round((project.relevance * 0.4 + nicheData.growth * 0.35 + geoData.stability * 0.25) * 100),
    factors: [
      { name: 'Relevance', weight: 0.4, contribution: Math.round(project.relevance * 40) },
      { name: 'Niche Growth', weight: 0.35, contribution: Math.round(nicheData.growth * 35) },
      { name: 'Geo Stability', weight: 0.25, contribution: Math.round(geoData.stability * 25) },
    ],
    methodology: 'Weighted composite of relevance, niche growth index, and geographic stability.',
  };

  const riskScore: ScoreBreakdown = {
    value: Math.round((1 - project.relevance) * 50 + (1 - geoData.stability) * 30 + (1 - nicheData.growth) * 20),
    factors: [
      { name: 'Low Relevance Risk', weight: 0.5, contribution: Math.round((1 - project.relevance) * 50) },
      { name: 'Geo Risk', weight: 0.3, contribution: Math.round((1 - geoData.stability) * 30) },
      { name: 'Niche Maturity Risk', weight: 0.2, contribution: Math.round((1 - nicheData.growth) * 20) },
    ],
    methodology: 'Inverse relevance + geographic risk + niche maturity risk.',
  };

  const marginScore: ScoreBreakdown = {
    value: Math.round(marginVal),
    factors: [
      { name: 'Base Margin', weight: 0.6, contribution: Math.round(project.relevance * 51) },
      { name: 'Complexity Premium', weight: 0.25, contribution: Math.round((project.id % 15) * 2.5) },
      { name: 'Market Position', weight: 0.15, contribution: Math.round(marginVal * 0.15) },
    ],
    methodology: 'Base margin from relevance + complexity premium + market position factor.',
  };

  return { opportunity: opportunityScore, risk: riskScore, margin: marginScore };
}

// ===== SOURCE GENERATION =====
function generateSources(project: Project): SourceSignal[] {
  return [
    {
      type: 'tender_registry',
      freshness: '2 days ago',
      confidence: 0.92,
      explanation: 'Official tender registry data, verified against government sources.',
    },
    {
      type: 'industry_report',
      freshness: '1 week ago',
      confidence: 0.85,
      explanation: 'Industry analysis report from established market research firm.',
    },
    {
      type: 'web_scrape',
      freshness: '3 days ago',
      confidence: 0.7,
      explanation: 'Automated web scraping from public business registries and news.',
    },
  ];
}

// ===== ACTION RECOMMENDATIONS =====
function generateActions(project: Project, scores: ProjectScores): ActionRecommendation[] {
  const actions: ActionRecommendation[] = [];

  if (scores.opportunity.value > 70) {
    actions.push({
      type: 'opportunity',
      label: 'High opportunity detected',
      description: `Opportunity score ${scores.opportunity.value}/100 indicates strong potential for this ${project.niche} project in ${project.country}.`,
      priority: 'high',
    });
  }

  if (scores.risk.value > 50) {
    actions.push({
      type: 'risk',
      label: 'Elevated risk factors',
      description: `Risk score ${scores.risk.value}/100. Key concerns: ${scores.risk.factors[0]?.name || 'market conditions'}.`,
      priority: scores.risk.value > 70 ? 'high' : 'medium',
    });
  }

  actions.push({
    type: 'next_step',
    label: 'Recommended action',
    description: project.relevance > 0.8
      ? 'Initiate direct engagement with project stakeholder. Prepare capability deck.'
      : 'Monitor developments. Gather additional intelligence before committing resources.',
    priority: project.relevance > 0.8 ? 'high' : 'medium',
  });

  return actions;
}

// ===== COMPETITOR CONTEXT =====
function generateCompetitorContext(project: Project): CompetitorContext {
  const count = Math.floor(Math.random() * 8) + 3;
  return {
    market_position: project.relevance > 0.85 ? 'Strong' : project.relevance > 0.7 ? 'Competitive' : 'Challenging',
    competitor_count: count,
    competitive_advantage: project.relevance > 0.8 ? 'Specialized expertise + regional presence' : 'Price competitiveness',
    threat_level: count > 8 ? 'high' : count > 5 ? 'medium' : 'low',
    differentiation: project.relevance > 0.85 ? 'Unique capability match' : 'Standard offering',
  };
}

// ===== MAIN ORCHESTRATOR =====
export function runAgentStack(project: Project, locale: Locale) {
  const geoOutput = runGeoAnalyst(project);
  const nicheOutput = runNicheAnalyst(project);
  const competitorOutput = runCompetitorAnalyst(project);
  const pricingOutput = runPricingAnalyst(project);
  const marginOutput = runMarginAnalyst(project);

  const synthesis = runSynthesisAgent(project, geoOutput, nicheOutput, competitorOutput, pricingOutput, marginOutput, locale);
  const scores = computeScores(project, geoOutput, nicheOutput, marginOutput);
  const sources = generateSources(project);
  const actions = generateActions(project, scores);
  const competitorContext = generateCompetitorContext(project);

  return {
    agentOutputs: [geoOutput, nicheOutput, competitorOutput, pricingOutput, marginOutput],
    synthesis,
    scores,
    sources,
    actions,
    competitorContext,
  };
}

// ===== GEO+NICHE MATRIX =====
export function getGeoNicheScenario(geo: string, niche: string): GeoNicheScenario {
  const scenarios: Record<string, GeoNicheScenario> = {
    'Turkey+Construction': {
      geo: 'Turkey', niche: 'Construction',
      signals: ['Infrastructure boom', 'Government incentives', 'EU accession preparations'],
      market_context: 'Turkey construction market growing 5-7% annually. Major urbanization projects.',
      risk_factors: ['Currency volatility', 'Regulatory changes', 'Political uncertainty'],
      opportunity_factors: ['Young workforce', 'Strategic location', 'EU convergence'],
    },
    'UAE+Tourism & Hospitality': {
      geo: 'UAE', niche: 'Tourism & Hospitality',
      signals: ['Post-Expo expansion', 'Vision 2030', 'Luxury segment growth'],
      market_context: 'UAE hospitality market recovering strongly. New mega-projects announced.',
      risk_factors: ['Oversupply risk', 'Seasonal dependency', 'Competition from Saudi'],
      opportunity_factors: ['High margins', 'Premium positioning', 'Government support'],
    },
    'Germany+Pharmaceuticals': {
      geo: 'Germany', niche: 'Pharmaceuticals',
      signals: ['EU regulatory harmonization', 'Biotech investment surge', 'Aging population'],
      market_context: 'German pharma market stable with strong export orientation.',
      risk_factors: ['Regulatory complexity', 'High compliance costs', 'Patent cliffs'],
      opportunity_factors: ['Strong IP protection', 'Skilled workforce', 'EU market access'],
    },
  };

  const key = `${geo}+${niche}`;
  return scenarios[key] || {
    geo, niche,
    signals: ['Market assessment in progress'],
    market_context: `Standard market conditions for ${niche} in ${geo}.`,
    risk_factors: ['General market risk', 'Regulatory environment'],
    opportunity_factors: ['Market presence', 'Network effects'],
  };
}
