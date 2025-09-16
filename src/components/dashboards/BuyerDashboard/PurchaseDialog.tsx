import React from 'react';
import { AnimatedDialog, AnimatedDialogContent, AnimatedDialogDescription, AnimatedDialogHeader, AnimatedDialogTitle } from '../../ui/animated-dialog';
import { AnimatedButton } from '../../ui/animated-button';
import { AnimatedInput } from '../../ui/animated-input';
import { CreditCard } from 'lucide-react';
import { CarbonCredit } from '../../../types/dashboard';
import { getHealthScoreColor } from '../../../utils/formatters';

interface PurchaseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  credit: CarbonCredit | null;
  purchaseAmount: number;
  onPurchaseAmountChange: (amount: number) => void;
  onPurchase: () => void;
}

export function PurchaseDialog({
  open,
  onOpenChange,
  credit,
  purchaseAmount,
  onPurchaseAmountChange,
  onPurchase
}: PurchaseDialogProps) {
  if (!credit) return null;

  return (
    <AnimatedDialog open={open} onOpenChange={onOpenChange}>
      <AnimatedDialogContent>
        <AnimatedDialogHeader>
          <AnimatedDialogTitle>Purchase Carbon Credits</AnimatedDialogTitle>
          <AnimatedDialogDescription>
            Purchase verified blue carbon credits from Project {credit.projectId.slice(-8)}
          </AnimatedDialogDescription>
        </AnimatedDialogHeader>
        
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl p-6 border border-blue-100">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600 font-medium">Available Credits</p>
                <p className="font-bold text-lg text-blue-700">{credit.amount.toLocaleString()} tCO₂e</p>
              </div>
              <div>
                <p className="text-gray-600 font-medium">Quality Score</p>
                <p className={`font-bold text-lg ${getHealthScoreColor(credit.healthScore)}`}>
                  {(credit.healthScore * 100).toFixed(1)}%
                </p>
              </div>
            </div>
          </div>
          <div>
            <AnimatedInput
              label="Select Amount to Purchase"
              type="number"
              min={1}
              max={credit.amount}
              value={purchaseAmount}
              onChange={e => onPurchaseAmountChange(Number(e.target.value))}
            />
            <p className="text-xs text-gray-500 mt-2">Max: {credit.amount.toLocaleString()} tCO₂e</p>
          </div>
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-6 text-sm border border-yellow-200">
            <p className="font-bold text-yellow-800 text-base mb-2">Purchase Summary</p>
            <p className="text-yellow-700 font-medium">
              Purchasing {purchaseAmount.toLocaleString()} tCO₂e credits
            </p>
            <p className="text-yellow-700 font-medium">
              Estimated cost: ${(purchaseAmount * 15).toLocaleString()} USD
            </p>
          </div>
          <div className="flex justify-end space-x-3 pt-6">
            <AnimatedButton variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </AnimatedButton>
            <AnimatedButton 
              onClick={onPurchase} 
              disabled={purchaseAmount < 1 || purchaseAmount > credit.amount}
            >
              <CreditCard className="h-4 w-4 mr-2" />
              Purchase Credits
            </AnimatedButton>
          </div>
        </div>
      </AnimatedDialogContent>
    </AnimatedDialog>
  );
}