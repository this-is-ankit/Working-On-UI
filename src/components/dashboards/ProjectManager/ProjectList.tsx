import React from 'react';
import { motion } from 'framer-motion';
import { AnimatedCard, AnimatedCardContent, AnimatedCardDescription, AnimatedCardHeader, AnimatedCardTitle } from '../../ui/animated-card';
import { AnimatedButton } from '../../ui/animated-button';
import { AnimatedBadge } from '../../ui/animated-badge';
import { LoadingSpinner } from '../../ui/loading-spinner';
import { MapPin, TreePine, Calendar, Upload, FileText, Trash2 } from 'lucide-react';

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

interface ProjectListProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
  onDeleteProject: (projectId: string, projectName: string) => void;
  loading?: boolean;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'registered':
      return 'bg-blue-100 text-blue-800';
    case 'mrv_submitted':
      return 'bg-yellow-100 text-yellow-800';
    case 'approved':
      return 'bg-green-100 text-green-800';
    case 'rejected':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export function ProjectList({ projects, onSelectProject, onDeleteProject, loading = false }: ProjectListProps) {
  if (loading) {
    return (
      <AnimatedCard>
        <AnimatedCardHeader>
          <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl animate-pulse"></div>
        </AnimatedCardHeader>
        <AnimatedCardContent>
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <motion.div 
                key={i} 
                className="h-20 bg-gradient-to-r from-gray-200 to-gray-300 rounded-2xl"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
              />
            ))}
          </div>
        </AnimatedCardContent>
      </AnimatedCard>
    );
  }

  if (projects.length === 0) {
    return (
      <AnimatedCard>
        <AnimatedCardHeader>
          <AnimatedCardTitle className="text-2xl">Your Projects</AnimatedCardTitle>
          <AnimatedCardDescription className="text-lg">
            Manage your registered blue carbon projects and submit MRV data
          </AnimatedCardDescription>
        </AnimatedCardHeader>
        <AnimatedCardContent>
          <motion.div 
            className="text-center py-16 text-gray-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <TreePine className="h-16 w-16 mx-auto mb-6 opacity-50" />
            </motion.div>
            <p className="text-lg font-medium">No projects registered yet</p>
            <p className="text-sm mt-2">Create your first blue carbon project to get started</p>
          </motion.div>
        </AnimatedCardContent>
      </AnimatedCard>
    );
  }

  return (
    <AnimatedCard delay={0.4}>
      <AnimatedCardHeader>
        <AnimatedCardTitle className="text-2xl">Your Projects</AnimatedCardTitle>
        <AnimatedCardDescription className="text-lg">
          Manage your registered blue carbon projects and submit MRV data
        </AnimatedCardDescription>
      </AnimatedCardHeader>
      <AnimatedCardContent>
        <div className="space-y-6">
          {projects.map((project) => (
            <motion.div 
              key={project.id} 
              className="border border-gray-100 rounded-2xl p-6 hover:bg-gray-50 transition-all duration-300 shadow-sm hover:shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -2 }}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <h3 className="font-bold text-xl text-gray-800">{project.name}</h3>
                    <AnimatedBadge variant={
                      project.status === 'approved' ? 'success' :
                      project.status === 'rejected' ? 'error' :
                      project.status === 'mrv_submitted' ? 'warning' :
                      'info'
                    }>
                      {project.status.replace('_', ' ').toUpperCase()}
                    </AnimatedBadge>
                  </div>
                  
                  <p className="text-gray-600 mb-4 leading-relaxed">{project.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-4">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="font-medium">{project.location}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <TreePine className="h-4 w-4 text-gray-400" />
                      <span className="font-medium capitalize">{project.ecosystemType}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="font-medium">{formatDate(project.createdAt)}</span>
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-600 mb-4">
                    <span className="font-semibold">Area:</span> {project.area.toLocaleString()} hectares
                    {project.onChainTxHash && (
                      <motion.div 
                        className="mt-3 flex items-center space-x-2"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-gradient-to-r from-blue-100 to-green-100 text-blue-800 font-medium">
                          <span className="w-2 h-2 bg-blue-400 rounded-full mr-1"></span>
                          On Avalanche Blockchain
                        </span>
                        <code className="text-xs text-gray-500 font-mono bg-gray-100 px-2 py-1 rounded">
                          {project.onChainTxHash.slice(0, 10)}...
                        </code>
                      </motion.div>
                    )}
                  </div>
                </div>
                
                <div className="flex space-x-3 ml-4">
                  {project.status === 'registered' && (
                    <>
                      <AnimatedButton 
                        variant="outline" 
                        size="sm"
                        onClick={() => onSelectProject(project)}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Submit MRV
                      </AnimatedButton>
                      <AnimatedButton 
                        variant="outline" 
                        size="sm"
                        onClick={() => onDeleteProject(project.id, project.name)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 hover:border-red-300"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </AnimatedButton>
                    </>
                  )}
                  <AnimatedButton variant="outline" size="sm">
                    <FileText className="h-4 w-4 mr-2" />
                    Details
                  </AnimatedButton>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </AnimatedCardContent>
    </AnimatedCard>
  );
}