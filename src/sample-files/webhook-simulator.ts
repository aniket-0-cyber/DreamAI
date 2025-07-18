import crypto from 'crypto';

// Event types for DreamAI
export type WebhookEventType = 
  | 'dream.submitted' 
  | 'dream.analyzed' 
  | 'user.created' 
  | 'subscription.activated'
  | 'ai.processing';

// Webhook payload structure
export interface WebhookPayload {
  event: WebhookEventType;
  id: string;
  timestamp: string;
  data: any;
  signature?: string;
}

// Webhook simulator class
export class WebhookSimulator {
  private secret: string;
  private baseUrl: string;

  constructor(secret: string = 'sim_secret_key', baseUrl: string = 'https://api.dreamai.com') {
    this.secret = secret;
    this.baseUrl = baseUrl;
  }

  // Generate webhook payload
  generate(event: WebhookEventType, data: any): WebhookPayload {
    const payload: WebhookPayload = {
      event,
      id: `wh_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      timestamp: new Date().toISOString(),
      data,
    };

    payload.signature = this.sign(JSON.stringify(payload));
    return payload;
  }

  // Create dream-related payloads
  dreamSubmitted(dreamId: string, userId: string, content: string) {
    return this.generate('dream.submitted', {
      dreamId,
      userId,
      content: content.substring(0, 100) + '...',
      submittedAt: new Date().toISOString(),
      metadata: {
        length: content.length,
        language: 'en',
        source: 'web_app'
      }
    });
  }

  dreamAnalyzed(dreamId: string, userId: string, analysis: string, symbols: string[]) {
    return this.generate('dream.analyzed', {
      dreamId,
      userId,
      analysis,
      symbols,
      confidence: Math.random() * 0.3 + 0.7, // 0.7-1.0
      analyzedAt: new Date().toISOString(),
      processingTime: Math.floor(Math.random() * 5000) + 1000 // 1-6 seconds
    });
  }

  userCreated(userId: string, email: string, plan: string = 'free') {
    return this.generate('user.created', {
      userId,
      email,
      plan,
      createdAt: new Date().toISOString(),
      profile: {
        isVerified: false,
        preferences: {
          notifications: true,
          publicDreams: false
        }
      }
    });
  }

  subscriptionActivated(userId: string, plan: string, amount: number) {
    return this.generate('subscription.activated', {
      userId,
      plan,
      amount,
      currency: 'USD',
      billingCycle: plan.includes('yearly') ? 'yearly' : 'monthly',
      activatedAt: new Date().toISOString(),
      nextBilling: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    });
  }

  aiProcessing(taskId: string, status: 'started' | 'progress' | 'completed' | 'failed') {
    return this.generate('ai.processing', {
      taskId,
      status,
      progress: status === 'progress' ? Math.floor(Math.random() * 100) : undefined,
      estimatedCompletion: status === 'started' ? 
        new Date(Date.now() + Math.random() * 10000).toISOString() : undefined,
      updatedAt: new Date().toISOString()
    });
  }

  // Sign payload
  private sign(payload: string): string {
    return crypto.createHmac('sha256', this.secret).update(payload).digest('hex');
  }

  // Verify signature
  static verify(payload: string, signature: string, secret: string): boolean {
    const expected = crypto.createHmac('sha256', secret).update(payload).digest('hex');
    return signature === expected;
  }

  // Send webhook (simulation)
  async send(payload: WebhookPayload, targetUrl: string): Promise<WebhookResponse> {
    const startTime = Date.now();
    
    try {
      const response = await fetch(targetUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Webhook-Event': payload.event,
          'X-Webhook-Signature': payload.signature || '',
          'X-Webhook-ID': payload.id,
          'User-Agent': 'DreamAI-Webhook-Simulator/1.0'
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(5000)
      });

      return {
        success: response.ok,
        status: response.status,
        responseTime: Date.now() - startTime,
        body: await response.text().catch(() => ''),
        headers: Object.fromEntries(response.headers.entries())
      };

    } catch (error) {
      return {
        success: false,
        status: 0,
        responseTime: Date.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown error',
        body: '',
        headers: {}
      };
    }
  }

  // Batch send multiple webhooks
  async sendBatch(payloads: WebhookPayload[], targetUrl: string, delay: number = 100) {
    const results: WebhookResponse[] = [];
    
    for (const payload of payloads) {
      const result = await this.send(payload, targetUrl);
      results.push(result);
      
      if (delay > 0) {
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    return results;
  }
}

// Response interface
export interface WebhookResponse {
  success: boolean;
  status: number;
  responseTime: number;
  body: string;
  error?: string;
  headers: Record<string, string>;
}

// Mock webhook receiver
export class MockWebhookReceiver {
  private receivedWebhooks: WebhookPayload[] = [];
  private responses: Map<string, any> = new Map();

  // Add custom response for specific event types
  setResponse(eventType: WebhookEventType, response: any) {
    this.responses.set(eventType, response);
  }

  // Process webhook (simulate receiving)
  receive(payload: WebhookPayload): { status: number; body: any } {
    this.receivedWebhooks.push(payload);
    
    // Return custom response if set
    const customResponse = this.responses.get(payload.event);
    if (customResponse) {
      return { status: 200, body: customResponse };
    }

    // Default successful response
    return {
      status: 200,
      body: {
        received: true,
        eventId: payload.id,
        processedAt: new Date().toISOString()
      }
    };
  }

  // Get all received webhooks
  getReceived(): WebhookPayload[] {
    return [...this.receivedWebhooks];
  }

  // Get webhooks by event type
  getByEvent(eventType: WebhookEventType): WebhookPayload[] {
    return this.receivedWebhooks.filter(wh => wh.event === eventType);
  }

  // Clear received webhooks
  clear() {
    this.receivedWebhooks = [];
  }

  // Get statistics
  getStats() {
    const byEvent = new Map<string, number>();
    
    this.receivedWebhooks.forEach(wh => {
      byEvent.set(wh.event, (byEvent.get(wh.event) || 0) + 1);
    });

    return {
      total: this.receivedWebhooks.length,
      byEvent: Object.fromEntries(byEvent),
      latestEvent: this.receivedWebhooks[this.receivedWebhooks.length - 1]?.event
    };
  }
}

// Test data generator
export class TestDataGenerator {
  
  static randomDream() {
    const dreams = [
      'Flying through colorful clouds in a magical sky',
      'Swimming with dolphins in crystal clear waters',
      'Walking through an enchanted forest with talking animals',
      'Discovering a hidden library with infinite books',
      'Climbing a mountain that reaches the stars'
    ];
    
    const symbols = [
      ['flying', 'freedom', 'sky'],
      ['water', 'emotions', 'peace'],
      ['nature', 'communication', 'wisdom'],
      ['knowledge', 'discovery', 'infinity'],
      ['achievement', 'perseverance', 'goals']
    ];
    
    const index = Math.floor(Math.random() * dreams.length);
    return {
      content: dreams[index],
      symbols: symbols[index]
    };
  }

  static randomUser() {
    const names = ['alice', 'bob', 'charlie', 'diana', 'emma'];
    const domains = ['gmail.com', 'yahoo.com', 'outlook.com'];
    
    const name = names[Math.floor(Math.random() * names.length)];
    const domain = domains[Math.floor(Math.random() * domains.length)];
    const number = Math.floor(Math.random() * 1000);
    
    return {
      email: `${name}${number}@${domain}`,
      userId: `user_${name}_${number}`
    };
  }

  static randomSubscription() {
    const plans = [
      { name: 'Premium Monthly', amount: 9.99 },
      { name: 'Premium Yearly', amount: 99.99 },
      { name: 'Pro Monthly', amount: 19.99 },
      { name: 'Pro Yearly', amount: 199.99 }
    ];
    
    return plans[Math.floor(Math.random() * plans.length)];
  }
} 