import React from 'react';
import { AnimatedDialog, AnimatedDialogContent, AnimatedDialogDescription, AnimatedDialogHeader, AnimatedDialogTitle } from '../../ui/animated-dialog';
import { AnimatedButton } from '../../ui/animated-button';
import { AnimatedTextarea } from '../../ui/animated-textarea';
import { Leaf } from 'lucide-react';
import { CarbonCredit } from '../../../types/dashboard';
import { getHealthScoreColor, getHealthScoreLabel } from '../../../utils/formatters';

interface RetirementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  credit: CarbonCredit | null;
  retirementReason: string;
  onRetirementReasonChange: (reason: string) => void;
  onRetire: () => void;
}

export function RetirementDialog({
  open,
  onOpenChange,
  credit,
  retirementReason,
  onRetirementReasonChange,
  onRetire
}: RetirementDialogProps) {
  if (!credit) return null;

  return (
    <AnimatedDialog open={open} onOpenChange={onOpenChange}>
      <AnimatedDialogContent>
        <AnimatedDialogHeader>
          <AnimatedDialogTitle>Retire Carbon Credits</AnimatedDialogTitle>
          <AnimatedDialogDescription>
            Permanently retire carbon credits to offset your emissions
          </AnimatedDialogDescription>
        </AnimatedDialogHeader>
        
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-2xl p-6 border border-green-200">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600 font-medium">Credit Amount</p>
                <p className="font-bold text-lg text-green-700">{credit.amount.toLocaleString()} tCO₂e</p>
              </div>
              <div>
                <p className="text-gray-600 font-medium">Project Quality</p>
                <p className={`font-bold text-lg ${getHealthScoreColor(credit.healthScore)}`}>
                  {getHealthScoreLabel(credit.healthScore)}
                </p>
              </div>
            </div>
          </div>

          <div>
            <AnimatedTextarea
              label="Reason for Retirement"
              placeholder="e.g., Offsetting corporate emissions for Q4 2024"
              value={retirementReason}
              onChange={(e) => onRetirementReasonChange(e.target.value)}
            />
          </div>

          <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl p-6 text-sm border border-red-200">
            <p className="font-bold text-red-800 text-base mb-2">⚠️ Permanent Action</p>
            <p className="text-red-700 font-medium leading-relaxed">
              Retiring {credit.amount.toLocaleString()} tCO₂e credits will permanently remove them from circulation.
              This action cannot be undone.
            </p>
          </div>

          <div className="flex justify-end space-x-3 pt-6">
            <AnimatedButton variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </AnimatedButton>
            <AnimatedButton 
              onClick={onRetire} 
              disabled={!retirementReason.trim()}
              className="bg-green-600 hover:bg-green-700"
            >
              <Leaf className="h-4 w-4 mr-2" />
              Retire Credits
            </AnimatedButton>
          </div>
        </div>
      </AnimatedDialogContent>
    </AnimatedDialog>
  );
}