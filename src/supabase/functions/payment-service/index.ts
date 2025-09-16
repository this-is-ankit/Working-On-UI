import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { createClient } from "@supabase/supabase-js";

const app = new Hono();

// Enable CORS and logging
app.use('*', logger(console.log));
app.use("/*", cors({
  origin: "*",
  allowHeaders: ["Content-Type", "Authorization", "Stripe-Signature"],
  allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  exposeHeaders: ["Content-Length"],
  maxAge: 600,
}));

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

// Mock Stripe configuration (replace with actual Stripe keys)
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || 'sk_test_mock_key';
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || 'whsec_mock_secret';

interface PaymentSession {
  id: string;
  creditId: string;
  buyerId: string;
  amount: number;
  priceInINR: number;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  stripeSessionId?: string;
  paymentIntentId?: string;
  createdAt: string;
  completedAt?: string;
}

interface PaymentVerification {
  isValid: boolean;
  paymentId: string;
  amount: number;
  currency: string;
  status: string;
  error?: string;
}

// Create payment session
app.post("/payment-service/create-session", async (c) => {
  try {
    const { creditId, amount, buyerId } = await c.req.json();
    
    if (!creditId || !amount || !buyerId) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    // Convert USD to INR (mock rate: 1 USD = 83 INR)
    const priceInINR = Math.round(amount * 15 * 83); // $15 per credit * 83 INR/USD
    
    // Create payment session record
    const sessionId = `ps_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const paymentSession: PaymentSession = {
      id: sessionId,
      creditId,
      buyerId,
      amount,
      priceInINR,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    // Store in KV store
    await storePaymentSession(paymentSession);

    // Mock Stripe session creation
    const mockStripeSession = {
      id: `cs_${Math.random().toString(36).substr(2, 24)}`,
      url: `https://checkout.stripe.com/pay/${sessionId}#mock`,
      payment_intent: `pi_${Math.random().toString(36).substr(2, 24)}`
    };

    // Update session with Stripe details
    paymentSession.stripeSessionId = mockStripeSession.id;
    paymentSession.paymentIntentId = mockStripeSession.payment_intent;
    await storePaymentSession(paymentSession);

    return c.json({
      success: true,
      sessionId: sessionId,
      stripeSessionId: mockStripeSession.id,
      checkoutUrl: mockStripeSession.url,
      amount: priceInINR,
      currency: 'INR'
    });

  } catch (error) {
    console.error('Payment session creation error:', error);
    return c.json({ error: 'Failed to create payment session' }, 500);
  }
});

// Verify payment completion
app.post("/payment-service/verify-payment", async (c) => {
  try {
    const { sessionId } = await c.req.json();
    
    if (!sessionId) {
      return c.json({ error: 'Session ID is required' }, 400);
    }

    const session = await getPaymentSession(sessionId);
    if (!session) {
      return c.json({ error: 'Payment session not found' }, 404);
    }

    // Mock payment verification (in production, verify with Stripe)
    const verification: PaymentVerification = {
      isValid: true,
      paymentId: session.paymentIntentId || 'mock_payment_id',
      amount: session.priceInINR,
      currency: 'INR',
      status: 'succeeded'
    };

    // Update session status
    session.status = 'completed';
    session.completedAt = new Date().toISOString();
    await storePaymentSession(session);

    return c.json({
      success: true,
      verification,
      session
    });

  } catch (error) {
    console.error('Payment verification error:', error);
    return c.json({ error: 'Failed to verify payment' }, 500);
  }
});

// Webhook endpoint for payment gateway notifications
app.post("/payment-service/webhook", async (c) => {
  try {
    const body = await c.req.text();
    const signature = c.req.header('stripe-signature');

    // Mock webhook verification (in production, verify Stripe signature)
    console.log('Received webhook:', { body: body.substring(0, 100), signature });

    // Parse webhook data
    const event = JSON.parse(body);
    
    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object;
      
      // Find payment session by payment intent ID
      const sessions = await getAllPaymentSessions();
      const session = sessions.find(s => s.paymentIntentId === paymentIntent.id);
      
      if (session) {
        // Update session status
        session.status = 'completed';
        session.completedAt = new Date().toISOString();
        await storePaymentSession(session);
        
        // Trigger credit transfer (this would call the main API)
        console.log(`Payment confirmed for session ${session.id}, triggering credit transfer`);
      }
    }

    return c.json({ received: true });

  } catch (error) {
    console.error('Webhook processing error:', error);
    return c.json({ error: 'Webhook processing failed' }, 500);
  }
});

// Get payment session status
app.get("/payment-service/session/:sessionId", async (c) => {
  try {
    const sessionId = c.req.param('sessionId');
    const session = await getPaymentSession(sessionId);
    
    if (!session) {
      return c.json({ error: 'Session not found' }, 404);
    }

    return c.json({ session });

  } catch (error) {
    console.error('Get session error:', error);
    return c.json({ error: 'Failed to get session' }, 500);
  }
});

// Calculate seller payout
app.post("/payment-service/calculate-payout", async (c) => {
  try {
    const { sessionId } = await c.req.json();
    
    const session = await getPaymentSession(sessionId);
    if (!session || session.status !== 'completed') {
      return c.json({ error: 'Invalid or incomplete session' }, 400);
    }

    // Platform fee: 10% of transaction
    const platformFeePercent = 0.10;
    const platformFee = Math.round(session.priceInINR * platformFeePercent);
    const sellerPayout = session.priceInINR - platformFee;

    return c.json({
      totalAmount: session.priceInINR,
      platformFee,
      sellerPayout,
      currency: 'INR'
    });

  } catch (error) {
    console.error('Payout calculation error:', error);
    return c.json({ error: 'Failed to calculate payout' }, 500);
  }
});

// Helper functions for KV storage
async function storePaymentSession(session: PaymentSession): Promise<void> {
  const { data, error } = await supabase
    .from('kv_store_a82c4acb')
    .upsert({
      key: `payment_session_${session.id}`,
      value: session
    });
  
  if (error) {
    throw new Error(`Failed to store payment session: ${error.message}`);
  }
}

async function getPaymentSession(sessionId: string): Promise<PaymentSession | null> {
  const { data, error } = await supabase
    .from('kv_store_a82c4acb')
    .select('value')
    .eq('key', `payment_session_${sessionId}`)
    .maybeSingle();
  
  if (error) {
    throw new Error(`Failed to get payment session: ${error.message}`);
  }
  
  return data?.value || null;
}

async function getAllPaymentSessions(): Promise<PaymentSession[]> {
  const { data, error } = await supabase
    .from('kv_store_a82c4acb')
    .select('value')
    .like('key', 'payment_session_%');
  
  if (error) {
    throw new Error(`Failed to get payment sessions: ${error.message}`);
  }
  
  return data?.map(d => d.value) || [];
}

export default app;