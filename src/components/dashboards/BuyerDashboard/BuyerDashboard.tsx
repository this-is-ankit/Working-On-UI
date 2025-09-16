import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AnimatedCard, AnimatedCardContent, AnimatedCardDescription, AnimatedCardHeader, AnimatedCardTitle } from '../../ui/animated-card';
import { AnimatedButton } from '../../ui/animated-button';
import { StatsCard as UIStatsCard } from '../../ui/stats-card';
import { LoadingSpinner } from '../../ui/loading-spinner';
import { projectId } from '../../../utils/supabase/info';
import { supabase } from '../../../utils/supabase/client';
import { ShoppingCart, Award, TrendingUp, Leaf } from 'lucide-react';
import { toast } from 'sonner';
import { WalletConnect } from '../../WalletConnect';
import { StatsCard as LocalStatsCard } from './StatsCard';
import { CreditCard } from './CreditCard';
import { PurchaseDialog } from './PurchaseDialog';
import { RetirementDialog } from './RetirementDialog';
import { RetirementHistory } from './RetirementHistory';
import { TransactionHistory } from './TransactionHistory';
import { User, CarbonCredit, Retirement } from '../../../types/dashboard';

interface BuyerDashboardProps {
  user: User;
}

export function BuyerDashboard({ user }: BuyerDashboardProps) {
  const [availableCredits, setAvailableCredits] = useState<CarbonCredit[]>([]);
  const [ownedCredits, setOwnedCredits] = useState<CarbonCredit[]>([]);
  const [selectedCredit, setSelectedCredit] = useState<CarbonCredit | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPurchaseDialog, setShowPurchaseDialog] = useState(false);
  const [showRetirementDialog, setShowRetirementDialog] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [retirementReason, setRetirementReason] = useState('');
  const [retirements, setRetirements] = useState<Retirement[]>([]);
  const [purchaseAmount, setPurchaseAmount] = useState(1);
  const [paymentData, setPaymentData] = useState<any>(null);

  useEffect(() => {
    fetchAvailableCredits();
    fetchOwnedCredits();
  }, []);

  const fetchAvailableCredits = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-a82c4acb/credits/available`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch available credits');
      }

      const data = await response.json();
      setAvailableCredits(data.availableCredits || []);
    } catch (error) {
      console.error('Error fetching available credits:', error);
      toast.error('Failed to load available credits');
    }
  };

  const fetchOwnedCredits = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-a82c4acb/credits/owned`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch owned credits');
      }

      const data = await response.json();
      setOwnedCredits(data.ownedCredits || []);
    } catch (error) {
      console.error('Error fetching owned credits:', error);
      toast.error('Failed to load owned credits');
    } finally {
      setLoading(false);
    }
  };

  const handleInitiatePurchase = () => {
    if (!selectedCredit || purchaseAmount < 1 || purchaseAmount > selectedCredit.amount) return;
    setShowPaymentForm(true);
  };

  const handlePaymentSuccess = async (payment: any) => {
    setPaymentData(payment);
    
    // Now complete the credit purchase with payment verification
    await completePurchase(payment);
  };

  const completePurchase = async (payment: any) => {
    if (!selectedCredit) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-a82c4acb/credits/purchase`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          creditId: selectedCredit.id,
          amount: purchaseAmount,
          paymentData: payment
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to purchase credit');
      }

      toast.success(`Successfully purchased ${purchaseAmount} tCO₂e credits!`);
      setShowPurchaseDialog(false);
      setShowPaymentForm(false);
      setSelectedCredit(null);

      setPaymentData(null);

      fetchAvailableCredits();
      fetchOwnedCredits();
    } catch (error) {
      const err = error as Error;
      console.error('Error purchasing credits:', err.message);
      toast.error(`Failed to purchase credits: ${err.message}`);
    }
  };

  const handleRetirement = async () => {
    if (!selectedCredit || !retirementReason.trim()) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-a82c4acb/credits/retire`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          creditId: selectedCredit.id,
          reason: retirementReason
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to retire credits');
      }

      const data = await response.json();
      toast.success(`Successfully retired ${selectedCredit.amount} tCO₂e credits!`);
      setRetirements(prev => [data.retirement, ...prev]);

      fetchOwnedCredits();

      setShowRetirementDialog(false);
      setRetirementReason('');
      setSelectedCredit(null);
    } catch (error) {
      const err = error as Error;
      console.error('Error retiring credits:', err.message);
      toast.error(`Failed to retire credits: ${err.message}`);
    }
  };

  const openPurchaseDialog = (credit: CarbonCredit) => {
    setSelectedCredit(credit);
    setPurchaseAmount(1);
    setShowPaymentForm(false);
    setPaymentData(null);
    setShowPurchaseDialog(true);
  };

  const handleBackToSummary = () => {
    setShowPaymentForm(false);
    setPaymentData(null);
  };

  const openRetirementDialog = (credit: CarbonCredit) => {
    setSelectedCredit(credit);
    setRetirementReason('');
    setShowRetirementDialog(true);
  };

  if (loading) {
    return (
      <motion.div 
        className="space-y-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
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
      className="space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Header */}
      <motion.div 
        className="flex justify-between items-start"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div>
          <h2 className="text-3xl font-bold flex items-center space-x-3 mb-2">
            <ShoppingCart className="h-6 w-6 text-green-600" />
            <span>Carbon Credit Marketplace</span>
          </h2>
          <p className="text-gray-600 text-lg">Purchase and retire verified blue carbon credits</p>
        </div>
        <WalletConnect variant="button-only" />
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <UIStatsCard
          title="Owned Credits"
          value={ownedCredits.reduce((sum, credit) => sum + credit.amount, 0)}
          unit="tCO₂e"
          description="Available for retirement"
          icon={ShoppingCart}
          color="green"
          delay={0}
        />
        <UIStatsCard
          title="Available Credits"
          value={availableCredits.reduce((sum, credit) => sum + credit.amount, 0)}
          unit="tCO₂e"
          description="In marketplace"
          icon={Award}
          color="blue"
          delay={0.1}
        />
        <UIStatsCard
          title="Premium Credits"
          value={availableCredits.filter(credit => credit.healthScore >= 0.8).length}
          unit=""
          description="High-quality projects"
          icon={TrendingUp}
          color="purple"
          delay={0.2}
        />
        <LocalStatsCard
          title="Retired Credits"
          value={retirements.reduce((sum, retirement) => sum + retirement.amount, 0)}
          unit="tCO₂e"
          description="Your offset impact"
          icon={Leaf}
          color="teal"
        />
      </div>

      {/* Available Credits Marketplace */}
      <AnimatedCard delay={0.4}>
        <AnimatedCardHeader>
          <AnimatedCardTitle className="text-2xl">Available Carbon Credits</AnimatedCardTitle>
          <AnimatedCardDescription className="text-lg">
            Purchase verified blue carbon credits from coastal restoration projects
          </AnimatedCardDescription>
        </AnimatedCardHeader>
        <AnimatedCardContent>
          {availableCredits.length === 0 ? (
            <motion.div 
              className="text-center py-16 text-gray-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 10, -10, 0]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Award className="h-16 w-16 mx-auto mb-6 opacity-50" />
              </motion.div>
              <p className="text-lg font-medium">No credits available for purchase</p>
              <p className="text-sm mt-2">Check back later for new verified projects</p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {availableCredits.map((credit) => (
                <CreditCard
                  key={credit.id}
                  credit={credit}
                  type="available"
                  onAction={openPurchaseDialog}
                  actionLabel="Purchase"
                  actionIcon={ShoppingCart}
                />
              ))}
            </div>
          )}
        </AnimatedCardContent>
      </AnimatedCard>

      {/* Owned Credits for Retirement */}
      {ownedCredits.length > 0 && (
        <AnimatedCard delay={0.5}>
          <AnimatedCardHeader>
            <AnimatedCardTitle className="text-2xl">Your Owned Credits</AnimatedCardTitle>
            <AnimatedCardDescription className="text-lg">
              Credits you own and can retire for carbon offsetting
            </AnimatedCardDescription>
          </AnimatedCardHeader>
          <AnimatedCardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {ownedCredits.map((credit) => (
                <CreditCard
                  key={credit.id}
                  credit={credit}
                  type="owned"
                  onAction={openRetirementDialog}
                  actionLabel="Retire Credit"
                  actionIcon={Leaf}
                  actionClass="bg-green-600 hover:bg-green-700"
                />
              ))}
            </div>
          </AnimatedCardContent>
        </AnimatedCard>
      )}

      {/* Retirement History */}
      {retirements.length > 0 && (
        <RetirementHistory retirements={retirements} />
      )}

      {/* Transaction History */}
      <TransactionHistory userId={user.id} />

      {/* Purchase Dialog */}
      <PurchaseDialog
        open={showPurchaseDialog}
        onOpenChange={setShowPurchaseDialog}
        credit={selectedCredit}
        purchaseAmount={purchaseAmount}
        onPurchaseAmountChange={setPurchaseAmount}
        onPurchase={handleInitiatePurchase}
        onPaymentSuccess={handlePaymentSuccess}
        showPaymentForm={showPaymentForm}
        onBackToSummary={handleBackToSummary}
      />

      {/* Retirement Dialog */}
      <RetirementDialog
        open={showRetirementDialog}
        onOpenChange={setShowRetirementDialog}
        credit={selectedCredit}
        retirementReason={retirementReason}
        onRetirementReasonChange={setRetirementReason}
        onRetire={handleRetirement}
      />
    </motion.div>
  );
}
