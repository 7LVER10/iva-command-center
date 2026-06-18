'use client';

import { Project } from '@/lib/iva/types';
import ProjectCard from './project-card';
import MetricsBar from './metrics-bar';
import { AnalysisMetrics } from '@/lib/iva/types';

interface ResultCardsProps {
  items: Project[];
  metrics: AnalysisMetrics;
}

export default function ResultCards({ items, metrics }: ResultCardsProps) {
  return (
    <div className="results-container">
      <MetricsBar metrics={metrics} />
      <div className="results-grid">
        {items.map(project => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}
