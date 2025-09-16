import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AnimatedCard, AnimatedCardContent, AnimatedCardDescription, AnimatedCardHeader, AnimatedCardTitle } from './components/ui/animated-card';
import { AnimatedButton } from './components/ui/animated-button';
import { AnimatedTabs } from './components/ui/animated-tabs';
import { AnimatedBadge } from './components/ui/animated-badge';
import { LoadingSpinner } from './components/ui/loading-spinner';
import { LandingPage } from './components/LandingPage';
import { PublicDashboard } from './components/dashboards/PublicDashboard/PublicDashboard';
import { ProjectManagerDashboard } from './components/dashboards/ProjectManagerDashboard';
import { NCCRVerifierDashboard } from './components/dashboards/NCCRVerifierDashboard';
import { BuyerDashboard } from './components/BuyerDashboard';
import { AuthForm } from './components/AuthForm';
import { supabase } from './utils/supabase/client';
import { Waves, Leaf, Shield, TrendingUp, LogOut } from 'lucide-react';
import { toast } from 'sonner';
import { Toaster } from './components/ui/sonner';
import { BlockchainStatus } from './components/BlockchainStatus';

interface User {
  id: string;
  email: string;
  user_metadata: {
    name: string;
    role: 'project_manager' | 'nccr_verifier' | 'buyer';
  };
}

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAuth, setShowAuth] = useState(false);
  const [activeTab, setActiveTab] = useState('public');

  useEffect(() => {
    // Check for existing session
    checkUser();
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          setUser(session.user as unknown as User);
          // Set active tab based on user role
          if (session.user.user_metadata?.role) {
            setActiveTab(session.user.user_metadata.role);
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setActiveTab('public');
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user as unknown as User);
        if (session.user.user_metadata?.role) {
          setActiveTab(session.user.user_metadata.role);
        }
      }
    } catch (error) {
      console.error('Error checking user session:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      setShowAuth(false); // Return to landing page
      toast.success('Signed out successfully');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Error signing out');
    }
  };

  const handleGetStarted = () => {
    setShowAuth(true);
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'project_manager':
        return <Leaf className="h-4 w-4" />;
      case 'nccr_verifier':
        return <Shield className="h-4 w-4" />;
      case 'buyer':
        return <TrendingUp className="h-4 w-4" />;
      default:
        return <Waves className="h-4 w-4" />;
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'project_manager':
        return 'Project Manager';
      case 'nccr_verifier':
        return 'NCCR Verifier';
      case 'buyer':
        return 'Buyer';
      default:
        return 'Public';
    }
  };

  const getGridCols = () => {
    if (!user) return 'grid-cols-1';
    
    // Always has public tab, plus user's role-specific tab
    return 'grid-cols-2';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <LoadingSpinner size="lg" />
          <motion.p 
            className="mt-4 text-gray-600 font-medium"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Loading Samudra Ledger...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  // Show landing page first
  if (!showAuth && !user) {
    return <LandingPage onGetStarted={handleGetStarted} />;
  }

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Header */}
      <motion.header 
        className="bg-white/80 backdrop-blur-md shadow-lg border-b border-white/20"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <motion.div 
              className="flex items-center space-x-3 cursor-pointer" 
              onClick={() => !user && setShowAuth(false)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-2xl p-3 shadow-lg">
                <Waves className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                  Samudra Ledger
                </h1>
                <p className="text-sm text-gray-600 font-medium">Blue Carbon Registry</p>
              </div>
            </motion.div>
            
            {user ? (
              <motion.div 
                className="flex items-center space-x-4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <AnimatedBadge variant="info" className="flex items-center space-x-1">
                  {getRoleIcon(user.user_metadata.role)}
                  <span>{getRoleLabel(user.user_metadata.role)}</span>
                </AnimatedBadge>
                <span className="text-sm text-gray-600 font-medium">{user.user_metadata.name}</span>
                <AnimatedButton variant="outline" size="sm" onClick={handleSignOut}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </AnimatedButton>
              </motion.div>
            ) : (
              <AnimatedButton variant="outline" onClick={() => setShowAuth(false)}>
                Back to Home
              </AnimatedButton>
            )}
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className={user ? "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12" : ""}>
        {!user ? (
          <motion.div 
            className="max-w-md mx-auto py-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <AuthForm />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <AnimatedTabs
              tabs={[
                { value: "public", label: "Public", icon: <Waves className="h-4 w-4" /> },
                ...(user.user_metadata.role === 'project_manager' ? [
                  { value: "project_manager", label: "Projects", icon: <Leaf className="h-4 w-4" /> }
                ] : []),
                ...(user.user_metadata.role === 'nccr_verifier' ? [
                  { value: "nccr_verifier", label: "Verification", icon: <Shield className="h-4 w-4" /> }
                ] : []),
                ...(user.user_metadata.role === 'buyer' ? [
                  { value: "buyer", label: "Marketplace", icon: <TrendingUp className="h-4 w-4" /> }
                ] : [])
              ]}
              value={activeTab}
              onValueChange={setActiveTab}
            >
              <AnimatePresence mode="wait">
                {activeTab === "public" && (
                  <motion.div
                    key="public"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <PublicDashboard />
                  </motion.div>
                )}
                
                {activeTab === "project_manager" && (
                  <motion.div
                    key="project_manager"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ProjectManagerDashboard user={user} />
                  </motion.div>
                )}
                
                {activeTab === "nccr_verifier" && (
                  <motion.div
                    key="nccr_verifier"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <NCCRVerifierDashboard user={user} />
                  </motion.div>
                )}
                
                {activeTab === "buyer" && (
                  <motion.div
                    key="buyer"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <BuyerDashboard user={user} />
                  </motion.div>
                )}
              </AnimatePresence>
            </AnimatedTabs>
          </motion.div>
        )}
      </main>

      {/* Footer */}
      <motion.footer 
        className="bg-white/80 backdrop-blur-md border-t border-gray-100 mt-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div 
            className="text-center text-gray-600"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p>© 2025 Samudra Ledger - Transparent Blue Carbon Registry for India</p>
            <div className="mt-3 flex justify-center">
              <BlockchainStatus variant="footer" showDetails />
            </div>
          </motion.div>
        </div>
      </motion.footer>
      
      <Toaster />
    </motion.div>
  );
}

export default App;