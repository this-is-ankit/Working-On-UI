import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AnimatedCard, AnimatedCardContent, AnimatedCardDescription, AnimatedCardHeader, AnimatedCardTitle } from '../../ui/animated-card';
import { AnimatedBadge } from '../../ui/animated-badge';
import { AnimatedButton } from '../../ui/animated-button';
import { StatsCard } from '../../ui/stats-card';
import { CounterAnimation } from '../../ui/counter-animation';
import { LoadingSpinner } from '../../ui/loading-spinner';
import { ApiService, showApiError , showApiSuccess } from '../../../utils/frontend/api-service';
import { Waves, TreePine, Award, ExternalLink, MapPin, Calendar, Leaf, RefreshCw, AlertCircle, Server } from 'lucide-react';
import { toast } from 'sonner';
import { projectId } from '../../../utils/supabase/info';
// At the top of PublicDashboard.tsx, add these imports:
import { NewProjectDialog } from '../ProjectManager/NewProjectDialog'; // Adjust path if needed
import { NewProjectData } from '../ProjectManager/types'; // Adjust path if needed


interface Project {
  id: string;
  name: string;
  description: string;
  location: string;
  ecosystemType: string;
  area: number;
  status: string;
  createdAt: string;
  onChainTxHash?: string;
}

interface PublicStats {
  totalCreditsIssued: number;
  totalCreditsRetired: number;
  totalProjects: number;
  projects: Project[];
}

export function PublicDashboard() {
  const [stats, setStats] = useState<PublicStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [connectionError, setConnectionError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  // Mock data for demonstration when server is not available
  const mockStats: PublicStats = {
    totalCreditsIssued: 12500,
    totalCreditsRetired: 8500,
    totalProjects: 8,
    projects: [
      {
        id: '1',
        name: 'Sundarbans Mangrove Conservation',
        description: 'Protection and restoration of mangrove forests in the Sundarbans delta',
        location: 'West Bengal',
        ecosystemType: 'Mangrove',
        area: 2500,
        status: 'approved',
        createdAt: '2023-05-15T00:00:00Z',
        onChainTxHash: '0x1234567890abcdef'
      },
      {
        id: '2',
        name: 'Goa Seagrass Preservation',
        description: 'Conservation of seagrass meadows along the Goa coastline',
        location: 'Goa',
        ecosystemType: 'Seagrass',
        area: 1200,
        status: 'mrv_submitted',
        createdAt: '2023-08-22T00:00:00Z'
      }
    ]
  };

  useEffect(() => {
    fetchPublicStats();
  }, [retryCount]);

  const fetchPublicStats = async () => {
    try {
      setLoading(true);
      setConnectionError(false);
      
      // First try the primary endpoint
      let apiUrl = `https://${projectId}.supabase.co/functions/v1/make-server-a82c4acb/public/stats`;
      console.log('Trying to fetch from:', apiUrl);
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Public stats data:', data);
      setStats(data);
      
    } catch (error) {
      console.error('Error fetching from primary endpoint:', error);
      
      // Try fallback endpoint (common Supabase Edge Functions pattern)
      try {
        const fallbackUrl = `https://${projectId}.supabase.co/functions/v1/public/stats`;
        console.log('Trying fallback endpoint:', fallbackUrl);
        
        const fallbackResponse = await fetch(fallbackUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        if (fallbackResponse.ok) {
          const data = await fallbackResponse.json();
          console.log('Success with fallback endpoint:', data);
          setStats(data);
          toast.success('Connected to server using fallback endpoint');
          return;
        }
      } catch (fallbackError) {
        console.error('Fallback endpoint also failed:', fallbackError);
      }
      
      // If both endpoints fail, show connection error and use mock data for demo
      setConnectionError(true);
      setStats(mockStats); // Use mock data for demonstration
      toast.error('Server connection failed. Showing demo data.', {
        description: 'The application will use real data when the server is available.',
        duration: 5000
      });
      
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    toast.info('Retrying server connection...');
  };

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

  if (loading) {
    return (
      <motion.div 
        className="space-y-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="bg-white rounded-2xl p-6 shadow-lg"
              animate={{ 
                opacity: [0.5, 1, 0.5],
                scale: [1, 1.02, 1]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                delay: i * 0.2
              }}
            >
              <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl mb-4"></div>
              <div className="h-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl"></div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="space-y-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Connection Status Banner */}
      {connectionError && (
        <motion.div 
          className="bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-400 text-yellow-800 p-6 rounded-2xl shadow-lg"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center">
            <AlertCircle className="h-6 w-6 mr-2" />
            <div>
              <p className="font-medium">Server Connection Issue</p>
              <p>Cannot connect to the backend server. Showing demo data.</p>
              <AnimatedButton 
                variant="outline" 
                size="sm" 
                className="mt-2"
                onClick={handleRetry}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry Connection
              </AnimatedButton>
            </div>
          </div>
        </motion.div>
      )}

      {/* Hero Section */}
      <motion.div 
        className="text-center py-16 bg-gradient-to-r from-blue-600 to-green-600 rounded-3xl text-white shadow-2xl relative overflow-hidden"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-green-600/90"
          animate={{
            background: [
              "linear-gradient(45deg, rgba(37, 99, 235, 0.9), rgba(34, 197, 94, 0.9))",
              "linear-gradient(45deg, rgba(34, 197, 94, 0.9), rgba(37, 99, 235, 0.9))",
              "linear-gradient(45deg, rgba(37, 99, 235, 0.9), rgba(34, 197, 94, 0.9))"
            ]
          }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <div className="relative z-10">
          <motion.h2 
            className="text-4xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            India's Blue Carbon Future
          </motion.h2>
          <motion.p 
            className="text-xl opacity-95 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Protecting coastal ecosystems while generating verified carbon credits 
            through transparent, blockchain-powered monitoring and verification.
          </motion.p>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <StatsCard
          title="Total Credits Issued"
          value={stats?.totalCreditsIssued || 0}
          unit="tCO₂e"
          description="Verified carbon sequestration"
          icon={Award}
          color="blue"
          delay={0}
        />
        <StatsCard
          title="Credits Retired"
          value={stats?.totalCreditsRetired || 0}
          unit="tCO₂e"
          description="Permanently offset emissions"
          icon={Leaf}
          color="green"
          delay={0.1}
        />
        <StatsCard
          title="Active Projects"
          value={stats?.totalProjects || 0}
          description={connectionError ? "Demo data - Coastal ecosystem projects" : "Coastal ecosystem projects"}
          icon={TreePine}
          color="teal"
          delay={0.2}
        />
      </div>

      {/* Rest of your component remains the same */}
      {/* Impact Metrics */}
      <AnimatedCard delay={0.3}>
        <AnimatedCardHeader>
          <AnimatedCardTitle className="flex items-center space-x-2 text-2xl">
            <Waves className="h-5 w-5 text-blue-600" />
            <span>Environmental Impact</span>
          </AnimatedCardTitle>
          <AnimatedCardDescription className="text-lg">
            Our blue carbon projects are making a measurable difference
          </AnimatedCardDescription>
        </AnimatedCardHeader>
        <AnimatedCardContent className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                value: Math.round((stats?.totalCreditsIssued || 0) * 2.5),
                label: "Hectares Protected",
                color: "blue",
                delay: 0
              },
              {
                value: Math.round((stats?.totalCreditsIssued || 0) * 0.4),
                label: "Trees Equivalent",
                color: "green", 
                delay: 0.1
              },
              {
                value: Math.round((stats?.totalCreditsIssued || 0) * 1.2),
                label: "Tonnes Biomass",
                color: "teal",
                delay: 0.2
              },
              {
                value: Math.round((stats?.totalCreditsRetired || 0) * 0.22),
                label: "Cars Off Road (yearly)",
                color: "purple",
                delay: 0.3
              }
            ].map((metric, index) => (
              <motion.div 
                key={index}
                className={`text-center p-6 bg-gradient-to-br ${
                  metric.color === 'blue' ? 'from-blue-50 to-blue-100' :
                  metric.color === 'green' ? 'from-green-50 to-green-100' :
                  metric.color === 'teal' ? 'from-teal-50 to-teal-100' :
                  'from-purple-50 to-purple-100'
                } rounded-2xl shadow-lg`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: metric.delay }}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 20px 40px rgba(0,0,0,0.1)"
                }}
              >
                <div className={`text-3xl font-bold mb-2 ${
                  metric.color === 'blue' ? 'text-blue-700' :
                  metric.color === 'green' ? 'text-green-700' :
                  metric.color === 'teal' ? 'text-teal-700' :
                  'text-purple-700'
                }`}>
                  <CounterAnimation end={metric.value} duration={2} />
                </div>
                <div className={`text-sm font-medium ${
                  metric.color === 'blue' ? 'text-blue-600' :
                  metric.color === 'green' ? 'text-green-600' :
                  metric.color === 'teal' ? 'text-teal-600' :
                  'text-purple-600'
                }`}>
                  {metric.label}
                </div>
              </motion.div>
            ))}
          </div>
        </AnimatedCardContent>
      </AnimatedCard>

      {/* Projects List */}
      <AnimatedCard delay={0.4}>
        <AnimatedCardHeader>
          <AnimatedCardTitle className="flex items-center space-x-2 text-2xl">
            <TreePine className="h-5 w-5 text-green-600" />
            <span>Registered Projects</span>
          </AnimatedCardTitle>
          <AnimatedCardDescription className="text-lg">
            Explore blue carbon projects across India's coastal regions
          </AnimatedCardDescription>
        </AnimatedCardHeader>
        <AnimatedCardContent>
          {!stats?.projects || stats.projects.length === 0 ? (
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
              <p className="text-sm mt-2">Be the first to register a blue carbon project!</p>
            </motion.div>
          ) : (
            <>
              {connectionError && (
                <motion.div 
                  className="mb-6 bg-gradient-to-r from-amber-50 to-yellow-50 border-l-4 border-amber-400 p-4 rounded-2xl"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="flex items-center">
                    <AlertCircle className="h-5 w-5 text-amber-500 mr-2" />
                    <span className="text-amber-700">Showing demo project data</span>
                  </div>
                </motion.div>
              )}
              <div className="max-h-96 overflow-y-auto space-y-6">
                <div className="space-y-6">
                  {stats.projects.map((project) => (
                    <motion.div 
                      key={project.id} 
                      className="border border-gray-100 rounded-2xl p-6 hover:bg-gray-50 transition-all duration-300 shadow-sm hover:shadow-lg"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      whileHover={{ y: -2 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            <h3 className="font-bold text-xl text-gray-800">{project.name}</h3>
                            <AnimatedBadge 
                              variant={
                                project.status === 'approved' ? 'success' :
                                project.status === 'rejected' ? 'error' :
                                project.status === 'mrv_submitted' ? 'warning' :
                                'info'
                              }
                            >
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
                          
                          <div className="text-sm text-gray-600">
                            <span className="font-semibold">Area:</span> {project.area.toLocaleString()} hectares
                          </div>
                        </div>
                        
                        {project.onChainTxHash && (
                          <AnimatedButton variant="outline" size="sm" className="ml-4">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            View on Chain
                          </AnimatedButton>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </>
          )}
        </AnimatedCardContent>
      </AnimatedCard>

      {/* Call to Action */}
      <AnimatedCard className="bg-gradient-to-r from-blue-600 to-green-600 text-white border-none shadow-2xl" delay={0.5}>
        <AnimatedCardContent className="py-12">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h3 className="text-3xl font-bold mb-6">Join the Blue Carbon Movement</h3>
            <p className="text-xl opacity-95 mb-8 max-w-3xl mx-auto leading-relaxed">
              Whether you're a coastal community, project developer, or corporate buyer, 
              help us build a transparent and sustainable blue carbon economy for India.
            </p>
            <motion.div 
              className="flex flex-col sm:flex-row gap-6 justify-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <AnimatedButton variant="secondary" size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                Register a Project
              </AnimatedButton>
              <AnimatedButton variant="outline" size="lg" className="text-white border-white hover:bg-white hover:text-blue-600">
                Become a Buyer
              </AnimatedButton>
            </motion.div>
          </motion.div>
        </AnimatedCardContent>
      </AnimatedCard>
    </motion.div>
  );
}