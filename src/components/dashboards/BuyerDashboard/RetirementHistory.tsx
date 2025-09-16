import React from 'react';
import { motion } from 'framer-motion';
import { AnimatedCard, AnimatedCardContent, AnimatedCardDescription, AnimatedCardHeader, AnimatedCardTitle } from '../../ui/animated-card';
import { AnimatedButton } from '../../ui/animated-button';
import { AnimatedBadge } from '../../ui/animated-badge';
import { CounterAnimation } from '../../ui/counter-animation';
import { ExternalLink } from 'lucide-react';
import { Retirement } from '../../../types/dashboard';
import { formatDate } from '../../../utils/formatters';

interface RetirementHistoryProps {
  retirements: Retirement[];
}

export function RetirementHistory({ retirements }: RetirementHistoryProps) {
  return (
    <AnimatedCard delay={0.6}>
      <AnimatedCardHeader>
        <AnimatedCardTitle className="text-2xl">Your Retirement History</AnimatedCardTitle>
        <AnimatedCardDescription className="text-lg">
          View your carbon credit retirement certificates
        </AnimatedCardDescription>
      </AnimatedCardHeader>
      <AnimatedCardContent>
        <div className="space-y-6">
          {retirements.map((retirement) => (
            <motion.div 
              key={retirement.id} 
              className="border border-green-200 rounded-2xl p-6 bg-gradient-to-r from-green-50 to-teal-50 shadow-sm hover:shadow-md transition-all duration-300"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-xl text-green-800 mb-2">
                    <CounterAnimation end={retirement.amount} duration={1} /> tCO₂e Retired
                  </h3>
                  <p className="text-sm text-gray-700 font-medium mb-3 leading-relaxed">{retirement.reason}</p>
                  <p className="text-xs text-gray-500 font-medium">
                    Retired on {formatDate(retirement.retiredAt)}
                  </p>
                </div>
                <div className="text-right">
                  <AnimatedBadge variant="success" className="mb-3">
                    RETIRED
                  </AnimatedBadge>
                  <br />
                  <AnimatedButton variant="ghost" size="sm" className="h-auto p-0 text-green-600">
                    <ExternalLink className="h-3 w-3 mr-1" />
                    View Certificate
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