import crypto from 'crypto';

// Types
export interface WebhookEvent {
  id: string;
  type: 'dream.created' | 'user.registered' | 'payment.completed';
  data: Record<string, any>;
  timestamp: string;
}

export interface WebhookConfig {
  url: string;
  secret: string;
  timeout?: number;
}

// Webhook Client
export class WebhookClient {
  constructor(private config: WebhookConfig) {}

  async send(event: WebhookEvent): Promise<boolean> {
    try {
      const payload = JSON.stringify(event);
      const signature = crypto.createHmac('sha256', this.config.secret).update(payload).digest('hex');
      
      const response = await fetch(this.config.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Signature': signature,
        },
        body: payload,
        signal: AbortSignal.timeout(this.config.timeout || 5000),
      });

      return response.ok;
    } catch {
      return false;
    }
  }

  static verify(payload: string, signature: string, secret: string): boolean {
    const expected = crypto.createHmac('sha256', secret).update(payload).digest('hex');
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  }
}

// Event Factory
export class EventFactory {
  static dream(dreamId: string, userId: string, title: string): WebhookEvent {
    return {
      id: `evt_${Date.now()}`,
      type: 'dream.created',
      data: { dreamId, userId, title },
      timestamp: new Date().toISOString(),
    };
  }

  static user(userId: string, email: string): WebhookEvent {
    return {
      id: `evt_${Date.now()}`,
      type: 'user.registered',
      data: { userId, email },
      timestamp: new Date().toISOString(),
    };
  }

  static payment(userId: string, amount: number): WebhookEvent {
    return {
      id: `evt_${Date.now()}`,
      type: 'payment.completed',
      data: { userId, amount },
      timestamp: new Date().toISOString(),
    };
  }
}

// Test Utilities
export class WebhookTest {
  static config(url: string = 'https://webhook.site/test'): WebhookConfig {
    return {
      url,
      secret: 'test_secret_123',
      timeout: 3000,
    };
  }

  static async mockServer(port: number = 3000) {
    const express = require('express');
    const app = express();
    const events: WebhookEvent[] = [];

    app.use(express.json());
    app.post('/webhook', (req: any, res: any) => {
      events.push(req.body);
      res.json({ ok: true });
    });

    const server = app.listen(port);
    
    return {
      stop: () => server.close(),
      events: () => events,
      url: `http://localhost:${port}/webhook`,
    };
  }
} 