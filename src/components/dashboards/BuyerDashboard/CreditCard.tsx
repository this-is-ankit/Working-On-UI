import React from 'react';
import { motion } from 'framer-motion';
import { AnimatedCard, AnimatedCardContent, AnimatedCardHeader, AnimatedCardTitle } from '../../ui/animated-card';
import { AnimatedButton } from '../../ui/animated-button';
import { AnimatedBadge } from '../../ui/animated-badge';
import { ExternalLink } from 'lucide-react';
import { CarbonCredit } from '../../../types/dashboard';
import { CounterAnimation } from '../../ui/counter-animation';

import { getHealthScoreColor, getHealthScoreLabel, formatDate } from '../../../utils/formatters';

interface CreditCardProps {
  credit: CarbonCredit;
  type: 'available' | 'owned';
  onAction: (credit: CarbonCredit) => void;
  actionLabel: string;
  actionIcon: React.ElementType;
  actionClass?: string;
}

export function CreditCard({ 
  credit, 
  type, 
  onAction, 
  actionLabel, 
  actionIcon: ActionIcon,
  actionClass = '' 
}: CreditCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ 
        y: -8, 
        scale: 1.02,
        boxShadow: "0 25px 50px rgba(0,0,0,0.15)"
      }}
      transition={{ duration: 0.3 }}
      className={`bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden ${
        type === 'owned' ? 'border-2 border-green-200 bg-gradient-to-br from-green-50/30 to-white' : 'border border-gray-100'
      }`}
    >
      <AnimatedCardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <AnimatedCardTitle className="text-xl">Project {credit.projectId.slice(-8)}</AnimatedCardTitle>
          <AnimatedBadge variant={
            type === 'owned' 
              ? 'success'
              : credit.healthScore >= 0.8 
                ? 'success'
                : credit.healthScore >= 0.6 
                  ? 'warning'
                  : 'default'
          }>
            {type === 'owned' ? 'OWNED' : getHealthScoreLabel(credit.healthScore)}
          </AnimatedBadge>
        </div>
      </AnimatedCardHeader>
      <AnimatedCardContent className="space-y-6">
        <motion.div 
          className="text-center"
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, type: "spring" }}
        >
          <div className={`text-3xl font-bold ${type === 'owned' ? 'text-green-700' : 'text-blue-700'}`}>
            <CounterAnimation end={credit.amount} duration={1.5} />
          </div>
          <p className="text-sm text-gray-600 font-medium mt-1">tCO₂e {type === 'owned' ? 'Owned' : 'Available'}</p>
        </motion.div>

        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="font-medium">Quality Score</span>
            <span className={getHealthScoreColor(credit.healthScore)}>
              {(credit.healthScore * 100).toFixed(1)}%
            </span>
          </div>
          <motion.div 
            className="w-full bg-gray-200 rounded-full h-3 overflow-hidden"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <motion.div
              className={`h-full rounded-full ${
                credit.healthScore >= 0.8 ? 'bg-gradient-to-r from-green-400 to-green-600' :
                credit.healthScore >= 0.6 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' :
                'bg-gradient-to-r from-gray-400 to-gray-600'
              }`}
              initial={{ width: 0 }}
              whileInView={{ width: `${credit.healthScore * 100}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.3 }}
            />
          </motion.div>
        </div>

        <div className="text-sm text-gray-600 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-medium">Verified:</span>
            <span className="font-medium">{formatDate(credit.verifiedAt)}</span>
          </div>
          {type === 'available' && (
            <div className="flex items-center justify-between mt-1">
              <span className="font-medium">Evidence:</span>
              <AnimatedButton variant="ghost" size="sm" className="h-auto p-0 text-xs text-blue-600">
                <ExternalLink className="h-3 w-3 mr-1" />
                IPFS
              </AnimatedButton>
            </div>
          )}
        </div>

        <div className="border-t border-gray-100 my-4"></div>

        <AnimatedButton 
          size="sm" 
          className={`w-full ${actionClass}`}
          onClick={() => onAction(credit)}
        >
          <ActionIcon className="h-4 w-4 mr-2" />
          {actionLabel}
        </AnimatedButton>
      </AnimatedCardContent>
    </motion.div>
  );
}