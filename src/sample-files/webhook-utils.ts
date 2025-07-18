import { WebhookConfig, DreamWebhookPayload, UserWebhookPayload, WebhookPayload } from './webhook-models';
import { WebhookClient } from './webhook-client';

/**
 * Utility functions for webhook testing and development
 */
export class WebhookUtils {
  
  /**
   * Generate a test dream webhook payload
   */
  static createDreamWebhookPayload(
    event: 'dream.created' | 'dream.interpreted' | 'dream.shared',
    overrides: Partial<DreamWebhookPayload['data']> = {}
  ): DreamWebhookPayload {
    const baseData = {
      dreamId: `dream_${Date.now()}`,
      userId: `user_${Math.random().toString(36).substr(2, 9)}`,
      title: 'Flying Through Clouds',
      content: 'I dreamed I was soaring through fluffy white clouds...',
      tags: ['flying', 'clouds', 'freedom'],
      isPublic: false,
      ...overrides,
    };

    if (event === 'dream.interpreted') {
      baseData.interpretation = 'This dream represents a desire for freedom and escape from daily constraints.';
    }

    return {
      id: `webhook_${Date.now()}`,
      event,
      timestamp: new Date().toISOString(),
      data: baseData,
      source: 'DreamAI',
    };
  }

  /**
   * Generate a test user webhook payload
   */
  static createUserWebhookPayload(
    event: 'user.created' | 'user.updated' | 'user.deleted',
    overrides: Partial<UserWebhookPayload['data']> = {}
  ): UserWebhookPayload {
    const baseData = {
      userId: `user_${Math.random().toString(36).substr(2, 9)}`,
      email: 'test@example.com',
      username: 'dreamuser',
      profile: {
        firstName: 'John',
        lastName: 'Doe',
        avatar: 'https://example.com/avatar.jpg',
      },
      ...overrides,
    };

    return {
      id: `webhook_${Date.now()}`,
      event,
      timestamp: new Date().toISOString(),
      data: baseData,
      source: 'DreamAI',
    };
  }

  /**
   * Generate a custom webhook payload
   */
  static createCustomWebhookPayload(
    event: string,
    data: Record<string, any>,
    source: string = 'DreamAI'
  ): WebhookPayload {
    return {
      id: `webhook_${Date.now()}`,
      event,
      timestamp: new Date().toISOString(),
      data,
      source,
    };
  }

  /**
   * Create a test webhook configuration
   */
  static createTestWebhookConfig(overrides: Partial<WebhookConfig> = {}): WebhookConfig {
    return {
      url: 'http://localhost:3001/webhook',
      secret: 'test_secret_key_123',
      events: ['dream.created', 'dream.interpreted', 'user.created'],
      active: true,
      retryAttempts: 3,
      timeout: 5000,
      headers: {
        'X-API-Version': '1.0',
      },
      ...overrides,
    };
  }

  /**
   * Create multiple test payloads for batch testing
   */
  static createTestPayloadBatch(count: number = 5): WebhookPayload[] {
    const payloads: WebhookPayload[] = [];
    
    for (let i = 0; i < count; i++) {
      const eventTypes = ['dream.created', 'dream.interpreted', 'user.created'] as const;
      const randomEvent = eventTypes[Math.floor(Math.random() * eventTypes.length)];
      
      if (randomEvent.startsWith('dream.')) {
        payloads.push(this.createDreamWebhookPayload(randomEvent as any));
      } else {
        payloads.push(this.createUserWebhookPayload(randomEvent as any));
      }
    }
    
    return payloads;
  }

  /**
   * Simulate webhook delivery with artificial delays and failures
   */
  static async simulateWebhookDelivery(
    client: WebhookClient,
    payload: WebhookPayload,
    options: {
      failureRate?: number; // 0-1, probability of failure
      delayRange?: [number, number]; // [min, max] delay in ms
    } = {}
  ) {
    const { failureRate = 0, delayRange = [100, 500] } = options;
    
    // Simulate network delay
    const delay = Math.random() * (delayRange[1] - delayRange[0]) + delayRange[0];
    await new Promise(resolve => setTimeout(resolve, delay));
    
    // Simulate random failures
    if (Math.random() < failureRate) {
      throw new Error('Simulated webhook delivery failure');
    }
    
    return client.sendWebhook(payload);
  }

  /**
   * Validate webhook payload structure
   */
  static validateWebhookPayload(payload: any): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!payload) {
      errors.push('Payload is required');
      return { valid: false, errors };
    }
    
    if (typeof payload.id !== 'string') {
      errors.push('id must be a string');
    }
    
    if (typeof payload.event !== 'string') {
      errors.push('event must be a string');
    }
    
    if (typeof payload.timestamp !== 'string') {
      errors.push('timestamp must be a string');
    } else {
      const date = new Date(payload.timestamp);
      if (isNaN(date.getTime())) {
        errors.push('timestamp must be a valid ISO date string');
      }
    }
    
    if (typeof payload.data !== 'object' || payload.data === null) {
      errors.push('data must be an object');
    }
    
    if (typeof payload.source !== 'string') {
      errors.push('source must be a string');
    }
    
    return { valid: errors.length === 0, errors };
  }

  /**
   * Create a mock webhook server for testing
   */
  static createMockServer(port: number = 3001): {
    start: () => Promise<void>;
    stop: () => void;
    getReceivedPayloads: () => WebhookPayload[];
    clearPayloads: () => void;
  } {
    const express = require('express');
    const app = express();
    const receivedPayloads: WebhookPayload[] = [];
    let server: any;

    app.use(express.json());

    app.post('/webhook', (req: any, res: any) => {
      receivedPayloads.push(req.body);
      res.json({ success: true, timestamp: new Date().toISOString() });
    });

    app.get('/health', (req: any, res: any) => {
      res.json({ status: 'healthy' });
    });

    return {
      start: () => new Promise(resolve => {
        server = app.listen(port, () => {
          console.log(`Mock webhook server started on port ${port}`);
          resolve();
        });
      }),
      stop: () => {
        if (server) {
          server.close();
          console.log('Mock webhook server stopped');
        }
      },
      getReceivedPayloads: () => [...receivedPayloads],
      clearPayloads: () => receivedPayloads.length = 0,
    };
  }

  /**
   * Performance test webhook delivery
   */
  static async performanceTest(
    client: WebhookClient,
    options: {
      payloadCount: number;
      concurrency: number;
      delayBetweenBatches?: number;
    }
  ) {
    const { payloadCount, concurrency, delayBetweenBatches = 0 } = options;
    const results: any[] = [];
    const startTime = Date.now();
    
    console.log(`Starting performance test: ${payloadCount} payloads, ${concurrency} concurrent`);
    
    for (let i = 0; i < payloadCount; i += concurrency) {
      const batch = [];
      const batchSize = Math.min(concurrency, payloadCount - i);
      
      for (let j = 0; j < batchSize; j++) {
        const payload = this.createDreamWebhookPayload('dream.created');
        batch.push(client.sendWebhook(payload));
      }
      
      try {
        const batchResults = await Promise.allSettled(batch);
        results.push(...batchResults);
        
        if (delayBetweenBatches > 0 && i + concurrency < payloadCount) {
          await new Promise(resolve => setTimeout(resolve, delayBetweenBatches));
        }
      } catch (error) {
        console.error('Batch error:', error);
      }
    }
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    const successful = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;
    
    return {
      totalPayloads: payloadCount,
      successful,
      failed,
      duration,
      throughput: (payloadCount / duration) * 1000, // per second
      results,
    };
  }

  /**
   * Format webhook delivery results for logging
   */
  static formatDeliveryResult(delivery: any): string {
    const status = delivery.status.toUpperCase();
    const attempts = delivery.attempts;
    const duration = delivery.response?.processingTime || 'N/A';
    
    return `[${status}] ${delivery.payload.event} (${attempts} attempts, ${duration}ms)`;
  }
} 