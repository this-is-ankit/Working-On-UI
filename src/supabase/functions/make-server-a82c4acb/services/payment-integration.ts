// Payment Gateway Integration Service
// Handles integration with payment providers like Stripe/Razorpay

export interface PaymentProvider {
  createSession(params: CreateSessionParams): Promise<PaymentSession>;
  verifyPayment(paymentId: string): Promise<PaymentVerification>;
  processRefund(paymentId: string, amount: number): Promise<RefundResult>;
}

export interface CreateSessionParams {
  amount: number; // Amount in smallest currency unit (paise for INR)
  currency: string;
  description: string;
  customerEmail: string;
  customerPhone?: string;
  metadata: Record<string, string>;
  successUrl: string;
  cancelUrl: string;
}

export interface PaymentSession {
  id: string;
  url: string;
  paymentIntentId: string;
  status: 'created' | 'processing' | 'succeeded' | 'failed' | 'cancelled';
}

export interface PaymentVerification {
  isValid: boolean;
  paymentId: string;
  amount: number;
  currency: string;
  status: string;
  customerEmail?: string;
  metadata?: Record<string, string>;
  error?: string;
}

export interface RefundResult {
  refundId: string;
  amount: number;
  status: 'pending' | 'succeeded' | 'failed';
  reason?: string;
}

// Mock Stripe/Razorpay implementation for demonstration
export class MockPaymentProvider implements PaymentProvider {
  private apiKey: string;
  private webhookSecret: string;

  constructor(apiKey: string, webhookSecret: string) {
    this.apiKey = apiKey;
    this.webhookSecret = webhookSecret;
  }

  async createSession(params: CreateSessionParams): Promise<PaymentSession> {
    // Mock session creation
    const sessionId = `cs_${Math.random().toString(36).substr(2, 24)}`;
    const paymentIntentId = `pi_${Math.random().toString(36).substr(2, 24)}`;
    
    console.log('Creating payment session:', {
      amount: params.amount,
      currency: params.currency,
      description: params.description
    });

    return {
      id: sessionId,
      url: `https://checkout.razorpay.com/v1/checkout.js?session_id=${sessionId}`,
      paymentIntentId,
      status: 'created'
    };
  }

  async verifyPayment(paymentId: string): Promise<PaymentVerification> {
    // Mock payment verification
    console.log('Verifying payment:', paymentId);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock successful verification
    return {
      isValid: true,
      paymentId,
      amount: 12450, // Mock amount in paise
      currency: 'INR',
      status: 'succeeded',
      customerEmail: 'buyer@example.com'
    };
  }

  async processRefund(paymentId: string, amount: number): Promise<RefundResult> {
    console.log('Processing refund:', { paymentId, amount });
    
    const refundId = `rf_${Math.random().toString(36).substr(2, 24)}`;
    
    return {
      refundId,
      amount,
      status: 'pending',
      reason: 'Credit transfer failed'
    };
  }

  // Webhook signature verification
  verifyWebhookSignature(payload: string, signature: string): boolean {
    // In production, implement proper signature verification
    console.log('Verifying webhook signature');
    return true;
  }
}

// Factory function to create payment provider
export function createPaymentProvider(provider: 'stripe' | 'razorpay' = 'razorpay'): PaymentProvider {
  const apiKey = process.env[`${provider.toUpperCase()}_SECRET_KEY`] || 'mock_key';
  const webhookSecret = process.env[`${provider.toUpperCase()}_WEBHOOK_SECRET`] || 'mock_secret';
  
  // In production, return actual Stripe or Razorpay implementation
  return new MockPaymentProvider(apiKey, webhookSecret);
}

// Payment utilities
export class PaymentUtils {
  // Convert USD to INR (in production, use real exchange rate API)
  static convertUSDToINR(usdAmount: number): number {
    const exchangeRate = 83; // Mock rate
    return Math.round(usdAmount * exchangeRate);
  }

  // Convert amount to smallest currency unit (paise for INR)
  static toSmallestUnit(amount: number, currency: string): number {
    switch (currency) {
      case 'INR':
        return Math.round(amount * 100); // Convert to paise
      case 'USD':
        return Math.round(amount * 100); // Convert to cents
      default:
        return amount;
    }
  }

  // Convert from smallest currency unit to main unit
  static fromSmallestUnit(amount: number, currency: string): number {
    switch (currency) {
      case 'INR':
      case 'USD':
        return amount / 100;
      default:
        return amount;
    }
  }

  // Calculate platform fee
  static calculatePlatformFee(amount: number, feePercent: number = 0.10): number {
    return Math.round(amount * feePercent);
  }

  // Generate payment description
  static generatePaymentDescription(creditAmount: number, projectId: string): string {
    return `Purchase of ${creditAmount} tCO₂e carbon credits from Project ${projectId.slice(-8)}`;
  }
}