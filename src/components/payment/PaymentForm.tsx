import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Separator } from '../ui/separator';
import { Badge } from '../ui/badge';
import { CreditCard, Smartphone, Building, Shield, Lock, IndianRupee } from 'lucide-react';
import { toast } from 'sonner';

interface PaymentFormProps {
  amount: number;
  creditAmount: number;
  onPaymentSuccess: (paymentData: any) => void;
  onPaymentError: (error: string) => void;
  loading?: boolean;
}

interface PaymentMethod {
  id: string;
  name: string;
  icon: React.ElementType;
  description: string;
}

const paymentMethods: PaymentMethod[] = [
  {
    id: 'card',
    name: 'Credit/Debit Card',
    icon: CreditCard,
    description: 'Visa, Mastercard, RuPay'
  },
  {
    id: 'upi',
    name: 'UPI',
    icon: Smartphone,
    description: 'PhonePe, Google Pay, Paytm'
  },
  {
    id: 'netbanking',
    name: 'Net Banking',
    icon: Building,
    description: 'All major banks'
  }
];

export function PaymentForm({ amount, creditAmount, onPaymentSuccess, onPaymentError, loading = false }: PaymentFormProps) {
  const [selectedMethod, setSelectedMethod] = useState<string>('card');
  const [processing, setProcessing] = useState(false);
  const [formData, setFormData] = useState({
    // Card details
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    cardholderName: '',
    // UPI details
    upiId: '',
    // Net banking
    bankCode: '',
    // Billing details
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  });

  // Convert USD to INR (mock rate: 1 USD = 83 INR)
  const amountInINR = Math.round(amount * 83);
  const platformFee = Math.round(amountInINR * 0.029); // 2.9% payment gateway fee
  const totalAmount = amountInINR + platformFee;

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = (): boolean => {
    if (!formData.email || !formData.phone) {
      toast.error('Email and phone number are required');
      return false;
    }

    if (selectedMethod === 'card') {
      if (!formData.cardNumber || !formData.expiryMonth || !formData.expiryYear || !formData.cvv || !formData.cardholderName) {
        toast.error('Please fill in all card details');
        return false;
      }
      
      // Basic card number validation (should be 16 digits)
      if (formData.cardNumber.replace(/\s/g, '').length !== 16) {
        toast.error('Please enter a valid 16-digit card number');
        return false;
      }
    } else if (selectedMethod === 'upi') {
      if (!formData.upiId) {
        toast.error('Please enter your UPI ID');
        return false;
      }
      
      // Basic UPI ID validation
      if (!formData.upiId.includes('@')) {
        toast.error('Please enter a valid UPI ID (e.g., user@paytm)');
        return false;
      }
    } else if (selectedMethod === 'netbanking') {
      if (!formData.bankCode) {
        toast.error('Please select your bank');
        return false;
      }
    }

    return true;
  };

  const handlePayment = async () => {
    if (!validateForm()) return;

    setProcessing(true);
    
    try {
      // Simulate payment processing
      toast.info('Processing payment...');
      
      // Mock payment gateway integration
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate successful payment
      const paymentData = {
        paymentId: `pay_${Math.random().toString(36).substr(2, 24)}`,
        sessionId: `sess_${Math.random().toString(36).substr(2, 24)}`,
        amount: totalAmount,
        currency: 'INR',
        method: selectedMethod,
        status: 'succeeded',
        timestamp: new Date().toISOString()
      };

      toast.success('Payment successful!');
      onPaymentSuccess(paymentData);
      
    } catch (error) {
      console.error('Payment error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Payment failed';
      toast.error(errorMessage);
      onPaymentError(errorMessage);
    } finally {
      setProcessing(false);
    }
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <IndianRupee className="h-5 w-5 text-green-600" />
          <span>Secure Payment</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Order Summary */}
        <div className="bg-blue-50 rounded-lg p-4">
          <h4 className="font-medium mb-3">Order Summary</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Carbon Credits ({creditAmount} tCO₂e)</span>
              <span>₹{amountInINR.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Payment Gateway Fee (2.9%)</span>
              <span>₹{platformFee.toLocaleString()}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-semibold">
              <span>Total Amount</span>
              <span>₹{totalAmount.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Payment Method Selection */}
        <div>
          <Label className="text-base font-medium mb-3 block">Select Payment Method</Label>
          <div className="grid grid-cols-1 gap-3">
            {paymentMethods.map((method) => {
              const Icon = method.icon;
              return (
                <div
                  key={method.id}
                  className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                    selectedMethod === method.id 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedMethod(method.id)}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="h-5 w-5 text-gray-600" />
                    <div className="flex-1">
                      <p className="font-medium">{method.name}</p>
                      <p className="text-sm text-gray-600">{method.description}</p>
                    </div>
                    {selectedMethod === method.id && (
                      <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Payment Details Form */}
        <div className="space-y-4">
          {/* Contact Information */}
          <div>
            <Label className="text-base font-medium mb-3 block">Contact Information</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          {/* Payment Method Specific Fields */}
          {selectedMethod === 'card' && (
            <div>
              <Label className="text-base font-medium mb-3 block">Card Details</Label>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input
                    id="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    value={formData.cardNumber}
                    onChange={(e) => handleInputChange('cardNumber', formatCardNumber(e.target.value))}
                    maxLength={19}
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="expiryMonth">Month</Label>
                    <Select value={formData.expiryMonth} onValueChange={(value) => handleInputChange('expiryMonth', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="MM" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 12 }, (_, i) => (
                          <SelectItem key={i + 1} value={String(i + 1).padStart(2, '0')}>
                            {String(i + 1).padStart(2, '0')}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="expiryYear">Year</Label>
                    <Select value={formData.expiryYear} onValueChange={(value) => handleInputChange('expiryYear', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="YY" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 10 }, (_, i) => {
                          const year = new Date().getFullYear() + i;
                          return (
                            <SelectItem key={year} value={String(year).slice(-2)}>
                              {String(year).slice(-2)}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      placeholder="123"
                      value={formData.cvv}
                      onChange={(e) => handleInputChange('cvv', e.target.value.replace(/\D/g, '').slice(0, 4))}
                      maxLength={4}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="cardholderName">Cardholder Name</Label>
                  <Input
                    id="cardholderName"
                    placeholder="Name as on card"
                    value={formData.cardholderName}
                    onChange={(e) => handleInputChange('cardholderName', e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {selectedMethod === 'upi' && (
            <div>
              <Label className="text-base font-medium mb-3 block">UPI Details</Label>
              <div>
                <Label htmlFor="upiId">UPI ID</Label>
                <Input
                  id="upiId"
                  placeholder="yourname@paytm"
                  value={formData.upiId}
                  onChange={(e) => handleInputChange('upiId', e.target.value)}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter your UPI ID (e.g., 9876543210@paytm, user@googlepay)
                </p>
              </div>
            </div>
          )}

          {selectedMethod === 'netbanking' && (
            <div>
              <Label className="text-base font-medium mb-3 block">Net Banking</Label>
              <div>
                <Label htmlFor="bankCode">Select Your Bank</Label>
                <Select value={formData.bankCode} onValueChange={(value) => handleInputChange('bankCode', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose your bank" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sbi">State Bank of India</SelectItem>
                    <SelectItem value="hdfc">HDFC Bank</SelectItem>
                    <SelectItem value="icici">ICICI Bank</SelectItem>
                    <SelectItem value="axis">Axis Bank</SelectItem>
                    <SelectItem value="kotak">Kotak Mahindra Bank</SelectItem>
                    <SelectItem value="pnb">Punjab National Bank</SelectItem>
                    <SelectItem value="bob">Bank of Baroda</SelectItem>
                    <SelectItem value="canara">Canara Bank</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </div>

        {/* Security Notice */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Shield className="h-5 w-5 text-green-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-green-800">Secure Payment</p>
              <p className="text-xs text-green-700 mt-1">
                Your payment information is encrypted and processed securely. We never store your card details.
              </p>
            </div>
          </div>
        </div>

        {/* Payment Button */}
        <Button 
          onClick={handlePayment}
          disabled={processing || loading}
          className="w-full h-12 text-base font-medium"
        >
          {processing ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Processing Payment...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Lock className="h-4 w-4" />
              <span>Pay ₹{totalAmount.toLocaleString()}</span>
            </div>
          )}
        </Button>

        {/* Payment Gateway Info */}
        <div className="text-center">
          <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
            <Badge variant="outline" className="text-xs">
              <Shield className="h-3 w-3 mr-1" />
              SSL Secured
            </Badge>
            <Badge variant="outline" className="text-xs">
              PCI Compliant
            </Badge>
            <Badge variant="outline" className="text-xs">
              Bank Grade Security
            </Badge>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Powered by Razorpay • Trusted by millions of Indians
          </p>
        </div>
      </CardContent>
    </Card>
  );
}