import React from 'react';
import { StatsCard } from '../../ui/stats-card';
import { TreePine, Activity, MapPin } from 'lucide-react';


export interface Project {
  id: string;
  name: string;
  description: string;
  location: string;
  ecosystemType: string;
  area: number;
  status: string;
  createdAt: string;
  managerId: string;
  onChainTxHash?: string;
}

interface StatsCardsProps {
  projects: Project[];
}

const calculateTotalArea = (projects: Project[]) => {
  return projects.reduce((sum, p) => sum + p.area, 0);
};

export function StatsCards({ projects }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
      <StatsCard
        title="Total Projects"
        value={projects.length}
        description="Registered projects"
        icon={TreePine}
        color="blue"
        delay={0}
      />
      <StatsCard
        title="Approved Projects"
        value={projects.filter(p => p.status === 'approved').length}
        description="Successfully verified"
        icon={Activity}
        color="green"
        delay={0.1}
      />
      <StatsCard
        title="Total Area"
        value={calculateTotalArea(projects)}
        unit="ha"
        description="Hectares under management"
        icon={MapPin}
        color="teal"
        delay={0.2}
      />
      <StatsCard
        title="On Blockchain"
        value={projects.filter(p => p.onChainTxHash).length}
        description="Blockchain verified"
        icon={Activity}
        color="purple"
        delay={0.3}
      />
    </div>
  );
}