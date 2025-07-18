import crypto from 'crypto';

// Simple webhook types
type EventType = 'dream_created' | 'user_signup' | 'payment_success' | 'analysis_complete';

interface Webhook {
  id: string;
  url: string;
  events: EventType[];
  secret: string;
  active: boolean;
}

interface WebhookPayload {
  event: EventType;
  data: any;
  timestamp: number;
  id: string;
}

// Webhook Manager Class
export class WebhookManager {
  private webhooks: Map<string, Webhook> = new Map();
  private queue: Array<{ webhook: Webhook; payload: WebhookPayload }> = [];
  private processing = false;

  // Add webhook endpoint
  addWebhook(url: string, events: EventType[], secret?: string): string {
    const id = `wh_${Date.now()}`;
    const webhook: Webhook = {
      id,
      url,
      events,
      secret: secret || this.generateSecret(),
      active: true,
    };
    
    this.webhooks.set(id, webhook);
    console.log(`✅ Added webhook: ${url}`);
    return id;
  }

  // Send event to all matching webhooks
  async trigger(event: EventType, data: any) {
    const payload: WebhookPayload = {
      event,
      data,
      timestamp: Date.now(),
      id: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`,
    };

    // Find matching webhooks
    for (const webhook of this.webhooks.values()) {
      if (webhook.active && webhook.events.includes(event)) {
        this.queue.push({ webhook, payload });
      }
    }

    if (!this.processing) {
      this.processQueue();
    }
  }

  // Process webhook queue
  private async processQueue() {
    this.processing = true;
    
    while (this.queue.length > 0) {
      const item = this.queue.shift()!;
      await this.sendWebhook(item.webhook, item.payload);
    }
    
    this.processing = false;
  }

  // Send individual webhook
  private async sendWebhook(webhook: Webhook, payload: WebhookPayload) {
    try {
      const body = JSON.stringify(payload);
      const signature = this.sign(body, webhook.secret);
      
      const response = await fetch(webhook.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Signature': signature,
          'X-Event': payload.event,
        },
        body,
        signal: AbortSignal.timeout(5000),
      });

      if (response.ok) {
        console.log(`✅ Sent ${payload.event} to ${webhook.url}`);
      } else {
        console.log(`❌ Failed ${payload.event} to ${webhook.url}: ${response.status}`);
      }
    } catch (error) {
      console.log(`💥 Error sending to ${webhook.url}:`, error instanceof Error ? error.message : 'Unknown');
    }
  }

  // Generate signature
  private sign(data: string, secret: string): string {
    return crypto.createHmac('sha256', secret).update(data).digest('hex');
  }

  // Generate random secret
  private generateSecret(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  // Get webhook info
  getWebhook(id: string): Webhook | undefined {
    return this.webhooks.get(id);
  }

  // List all webhooks
  listWebhooks(): Webhook[] {
    return Array.from(this.webhooks.values());
  }

  // Remove webhook
  removeWebhook(id: string): boolean {
    return this.webhooks.delete(id);
  }
}

// Event builders for easy usage
export class EventBuilder {
  static dream(dreamId: string, userId: string, title: string, content: string) {
    return {
      dreamId,
      userId,
      title,
      content,
      createdAt: new Date().toISOString(),
    };
  }

  static user(userId: string, email: string, plan: string = 'free') {
    return {
      userId,
      email,
      plan,
      signupAt: new Date().toISOString(),
    };
  }

  static payment(userId: string, amount: number, plan: string) {
    return {
      userId,
      amount,
      plan,
      currency: 'USD',
      paidAt: new Date().toISOString(),
    };
  }

  static analysis(dreamId: string, userId: string, analysis: string, confidence: number) {
    return {
      dreamId,
      userId,
      analysis,
      confidence,
      analyzedAt: new Date().toISOString(),
    };
  }
}

// Simple test server
export class TestServer {
  static async create(port: number = 3000) {
    const express = require('express');
    const app = express();
    const received: any[] = [];

    app.use(express.json());
    
    app.post('/webhook', (req: any, res: any) => {
      received.push({
        headers: req.headers,
        body: req.body,
        receivedAt: new Date().toISOString(),
      });
      res.json({ success: true });
    });

    app.get('/received', (req: any, res: any) => {
      res.json({ count: received.length, events: received });
    });

    const server = app.listen(port);
    console.log(`🖥️  Test server running on http://localhost:${port}`);

    return {
      port,
      url: `http://localhost:${port}/webhook`,
      getReceived: () => received,
      stop: () => server.close(),
    };
  }
} 