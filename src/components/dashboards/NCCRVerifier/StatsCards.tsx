import { StatsCard } from '../../ui/stats-card';
import { TreePine, Clock, CheckCircle, AlertTriangle, TrendingUp } from 'lucide-react';

interface StatsCardsProps {
  projectsCount: number;
  pendingMrvCount: number;
  highQualityCount: number;
  needsReviewCount: number;
  totalCredits: number;
}

export function StatsCards({ 
  projectsCount, 
  pendingMrvCount, 
  highQualityCount, 
  needsReviewCount, 
  totalCredits 
}: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
      <StatsCard
        title="Total Projects"
        value={projectsCount}
        description="Registered projects"
        icon={TreePine}
        color="blue"
        delay={0}
      />
      <StatsCard
        title="Pending Reviews"
        value={pendingMrvCount}
        description="Awaiting verification"
        icon={Clock}
        color="orange"
        delay={0.1}
      />
      <StatsCard
        title="High Quality Reports"
        value={highQualityCount}
        description="Premium submissions"
        icon={CheckCircle}
        color="green"
        delay={0.2}
      />
      <StatsCard
        title="Needs Review"
        value={needsReviewCount}
        description="Requires attention"
        icon={AlertTriangle}
        color="orange"
        delay={0.3}
      />
      <StatsCard
        title="Total Credits"
        value={totalCredits}
        unit="tCO₂e"
        description="Pending approval"
        icon={TrendingUp}
        color="blue"
        delay={0.4}
      />
    </div>
  );
}