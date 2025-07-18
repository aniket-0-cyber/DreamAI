import crypto from 'crypto';

// ===== WEBHOOK MODELS =====

export interface WebhookEvent {
  id: string;
  type: 'dream.created' | 'dream.analyzed' | 'user.registered' | 'payment.completed' | 'notification.sent';
  timestamp: string;
  payload: Record<string, any>;
  source: string;
  version: string;
}

export interface WebhookConfig {
  endpoint: string;
  secret: string;
  timeout: number;
  retries: number;
  headers?: Record<string, string>;
}

export interface WebhookResponse {
  success: boolean;
  statusCode: number;
  responseTime: number;
  data?: any;
  error?: string;
}

// ===== WEBHOOK CLIENT =====

export class WebhookAPI {
  private config: WebhookConfig;

  constructor(config: WebhookConfig) {
    this.config = config;
  }

  /**
   * Send a webhook event
   */
  async sendEvent(event: WebhookEvent): Promise<WebhookResponse> {
    const startTime = Date.now();
    
    for (let attempt = 1; attempt <= this.config.retries; attempt++) {
      try {
        const signature = this.generateSignature(JSON.stringify(event));
        
        const response = await fetch(this.config.endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Webhook-Signature': signature,
            'X-Webhook-Event': event.type,
            'X-Webhook-Timestamp': event.timestamp,
            'User-Agent': 'DreamAI-Webhook/2.0',
            ...this.config.headers,
          },
          body: JSON.stringify(event),
          signal: AbortSignal.timeout(this.config.timeout),
        });

        const responseTime = Date.now() - startTime;
        const data = await response.text();

        return {
          success: response.ok,
          statusCode: response.status,
          responseTime,
          data: data || null,
          error: response.ok ? undefined : `HTTP ${response.status}: ${data}`,
        };

      } catch (error) {
        if (attempt === this.config.retries) {
          return {
            success: false,
            statusCode: 0,
            responseTime: Date.now() - startTime,
            error: error instanceof Error ? error.message : 'Unknown error',
          };
        }
        
        // Wait before retry with exponential backoff
        await this.delay(Math.pow(2, attempt - 1) * 1000);
      }
    }

    throw new Error('Max retries exceeded');
  }

  /**
   * Generate HMAC signature
   */
  private generateSignature(payload: string): string {
    return crypto.createHmac('sha256', this.config.secret).update(payload).digest('hex');
  }

  /**
   * Verify webhook signature
   */
  static verifySignature(payload: string, signature: string, secret: string): boolean {
    const expectedSignature = crypto.createHmac('sha256', secret).update(payload).digest('hex');
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));
  }

  /**
   * Delay utility
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// ===== EVENT FACTORIES =====

export class WebhookEventFactory {
  
  static createDreamEvent(type: 'dream.created' | 'dream.analyzed', dreamData: {
    dreamId: string;
    userId: string;
    title: string;
    content: string;
    analysis?: string;
    mood?: string;
    symbols?: string[];
  }): WebhookEvent {
    return {
      id: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`,
      type,
      timestamp: new Date().toISOString(),
      payload: {
        dream: dreamData,
        metadata: {
          source: 'dream-analyzer',
          confidence: type === 'dream.analyzed' ? Math.random() : undefined,
        }
      },
      source: 'DreamAI',
      version: '2.0',
    };
  }

  static createUserEvent(userData: {
    userId: string;
    email: string;
    username: string;
    plan?: 'free' | 'premium' | 'enterprise';
  }): WebhookEvent {
    return {
      id: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`,
      type: 'user.registered',
      timestamp: new Date().toISOString(),
      payload: {
        user: userData,
        registration: {
          ip: '192.168.1.100',
          userAgent: 'Mozilla/5.0...',
          referrer: 'https://dreamai.com/signup',
        }
      },
      source: 'DreamAI',
      version: '2.0',
    };
  }

  static createPaymentEvent(paymentData: {
    userId: string;
    amount: number;
    currency: string;
    plan: string;
    transactionId: string;
  }): WebhookEvent {
    return {
      id: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`,
      type: 'payment.completed',
      timestamp: new Date().toISOString(),
      payload: {
        payment: paymentData,
        billing: {
          method: 'stripe',
          nextBilling: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        }
      },
      source: 'DreamAI',
      version: '2.0',
    };
  }

  static createNotificationEvent(notificationData: {
    userId: string;
    type: 'email' | 'push' | 'sms';
    template: string;
    status: 'sent' | 'delivered' | 'failed';
  }): WebhookEvent {
    return {
      id: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`,
      type: 'notification.sent',
      timestamp: new Date().toISOString(),
      payload: {
        notification: notificationData,
        delivery: {
          attempts: 1,
          lastAttempt: new Date().toISOString(),
        }
      },
      source: 'DreamAI',
      version: '2.0',
    };
  }
}

// ===== TESTING UTILITIES =====

export class WebhookTester {
  
  /**
   * Create test configuration
   */
  static createTestConfig(overrides: Partial<WebhookConfig> = {}): WebhookConfig {
    return {
      endpoint: 'https://webhook.site/test-endpoint',
      secret: 'test_secret_' + Math.random().toString(36).substr(2, 16),
      timeout: 5000,
      retries: 3,
      headers: {
        'X-API-Key': 'test-key',
        'X-Environment': 'testing',
      },
      ...overrides,
    };
  }

  /**
   * Generate sample events for testing
   */
  static generateSampleEvents(count: number = 5): WebhookEvent[] {
    const events: WebhookEvent[] = [];
    
    for (let i = 0; i < count; i++) {
      const eventTypes = [
        () => WebhookEventFactory.createDreamEvent('dream.created', {
          dreamId: `dream_${i}`,
          userId: `user_${i}`,
          title: `Test Dream ${i}`,
          content: `This is test dream content ${i}`,
          mood: ['peaceful', 'exciting', 'mysterious', 'scary'][i % 4],
          symbols: ['water', 'flying', 'animals', 'people'].slice(0, (i % 3) + 1),
        }),
        () => WebhookEventFactory.createUserEvent({
          userId: `user_${i}`,
          email: `test${i}@example.com`,
          username: `testuser${i}`,
          plan: ['free', 'premium', 'enterprise'][i % 3] as any,
        }),
        () => WebhookEventFactory.createPaymentEvent({
          userId: `user_${i}`,
          amount: [9.99, 19.99, 49.99][i % 3],
          currency: 'USD',
          plan: ['Premium Monthly', 'Premium Yearly', 'Enterprise'][i % 3],
          transactionId: `txn_${Date.now()}_${i}`,
        }),
      ];
      
      const randomEvent = eventTypes[Math.floor(Math.random() * eventTypes.length)];
      events.push(randomEvent());
    }
    
    return events;
  }

  /**
   * Simulate batch webhook sending
   */
  static async sendBatch(
    api: WebhookAPI, 
    events: WebhookEvent[],
    options: { concurrent?: boolean; delay?: number } = {}
  ): Promise<WebhookResponse[]> {
    const { concurrent = false, delay = 0 } = options;
    
    if (concurrent) {
      return Promise.all(events.map(event => api.sendEvent(event)));
    } else {
      const results: WebhookResponse[] = [];
      for (const event of events) {
        const result = await api.sendEvent(event);
        results.push(result);
        
        if (delay > 0) {
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
      return results;
    }
  }

  /**
   * Analyze webhook test results
   */
  static analyzeResults(results: WebhookResponse[]): {
    total: number;
    successful: number;
    failed: number;
    averageResponseTime: number;
    successRate: number;
    errors: string[];
  } {
    const successful = results.filter(r => r.success).length;
    const failed = results.length - successful;
    const totalResponseTime = results.reduce((sum, r) => sum + r.responseTime, 0);
    const averageResponseTime = totalResponseTime / results.length;
    const errors = results.filter(r => !r.success).map(r => r.error || 'Unknown error');

    return {
      total: results.length,
      successful,
      failed,
      averageResponseTime: Math.round(averageResponseTime),
      successRate: (successful / results.length) * 100,
      errors,
    };
  }

  /**
   * Create a mock webhook receiver for testing
   */
  static createMockReceiver(port: number = 3000): {
    start: () => Promise<void>;
    stop: () => void;
    getReceivedEvents: () => WebhookEvent[];
    clear: () => void;
  } {
    const express = require('express');
    const app = express();
    const receivedEvents: WebhookEvent[] = [];
    let server: any;

    app.use(express.json());
    
    app.post('/webhook', (req: any, res: any) => {
      receivedEvents.push(req.body);
      res.json({ received: true, timestamp: new Date().toISOString() });
    });

    app.get('/health', (req: any, res: any) => {
      res.json({ status: 'healthy', eventsReceived: receivedEvents.length });
    });

    return {
      start: () => new Promise(resolve => {
        server = app.listen(port, () => {
          console.log(`Mock webhook receiver running on port ${port}`);
          resolve();
        });
      }),
      stop: () => {
        if (server) {
          server.close();
          console.log('Mock webhook receiver stopped');
        }
      },
      getReceivedEvents: () => [...receivedEvents],
      clear: () => receivedEvents.length = 0,
    };
  }
} 