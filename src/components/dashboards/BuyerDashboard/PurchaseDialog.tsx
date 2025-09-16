import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../../ui/dialog';
import { Button } from '../../ui/button';
import { CreditCard, ArrowLeft } from 'lucide-react';
import { CarbonCredit } from '../../../types/dashboard';
import { getHealthScoreColor } from '../../../utils/formatters';
import { PaymentForm } from '../../payment/PaymentForm';

interface PurchaseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  credit: CarbonCredit | null;
  purchaseAmount: number;
  onPurchaseAmountChange: (amount: number) => void;
  onPurchase: () => void;
  onPaymentSuccess: (paymentData: any) => void;
  showPaymentForm: boolean;
  onBackToSummary: () => void;
}

export function PurchaseDialog({
  open,
  onOpenChange,
  credit,
  purchaseAmount,
  onPurchaseAmountChange,
  onPurchase,
  onPaymentSuccess,
  showPaymentForm,
  onBackToSummary
}: PurchaseDialogProps) {
  if (!credit) return null;

  const totalCostUSD = purchaseAmount * 15; // $15 per credit
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            {showPaymentForm && (
              <Button variant="ghost" size="sm" onClick={onBackToSummary}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            <span>{showPaymentForm ? 'Complete Payment' : 'Purchase Carbon Credits'}</span>
          </DialogTitle>
          <DialogDescription>
            {showPaymentForm 
              ? 'Complete your secure payment to purchase carbon credits'
              : `Purchase verified blue carbon credits from Project ${credit.projectId.slice(-8)}`
            }
          </DialogDescription>
        </DialogHeader>
        
        {showPaymentForm ? (
          <PaymentForm
            amount={totalCostUSD}
            creditAmount={purchaseAmount}
            onPaymentSuccess={onPaymentSuccess}
            onPaymentError={(error) => {
              console.error('Payment error:', error);
            }}
          />
        ) : (
          <div className="space-y-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Available Credits</p>
                  <p className="font-semibold">{credit.amount.toLocaleString()} tCO₂e</p>
                </div>
                <div>
                  <p className="text-gray-600">Quality Score</p>
                  <p className={`font-semibold ${getHealthScoreColor(credit.healthScore)}`}>
                    {(credit.healthScore * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>
            <div>
              <label htmlFor="purchaseAmount" className="block text-sm font-medium text-gray-700 mb-1">
                Select Amount to Purchase
              </label>
              <input
                id="purchaseAmount"
                type="number"
                min={1}
                max={credit.amount}
                value={purchaseAmount}
                onChange={e => onPurchaseAmountChange(Number(e.target.value))}
                className="w-full border rounded px-3 py-2"
              />
              <p className="text-xs text-gray-500 mt-1">Max: {credit.amount.toLocaleString()} tCO₂e</p>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4 text-sm">
              <p className="font-medium text-yellow-800">Purchase Summary</p>
              <p className="text-yellow-700 mt-1">
                Purchasing {purchaseAmount.toLocaleString()} tCO₂e credits
              </p>
              <p className="text-yellow-700">
                Cost: ${totalCostUSD.toLocaleString()} USD (₹{Math.round(totalCostUSD * 83).toLocaleString()})
              </p>
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button 
                onClick={onPurchase} 
                disabled={purchaseAmount < 1 || purchaseAmount > credit.amount}
              >
                <CreditCard className="h-4 w-4 mr-2" />
                Proceed to Payment
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}