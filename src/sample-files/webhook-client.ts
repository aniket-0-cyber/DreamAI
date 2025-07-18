import crypto from 'crypto';
import { WebhookConfig, WebhookPayload, WebhookResponse, WebhookError, WebhookDelivery } from './webhook-models';

export class WebhookClient {
  private config: WebhookConfig;

  constructor(config: WebhookConfig) {
    this.config = config;
  }

  /**
   * Send a webhook payload to the configured endpoint
   */
  async sendWebhook(payload: WebhookPayload): Promise<WebhookDelivery> {
    const delivery: WebhookDelivery = {
      id: this.generateId(),
      webhookId: this.config.url,
      payload,
      attempts: 0,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    for (let attempt = 1; attempt <= this.config.retryAttempts; attempt++) {
      delivery.attempts = attempt;
      delivery.status = attempt > 1 ? 'retrying' : 'pending';

      try {
        const response = await this.makeRequest(payload);
        delivery.response = response;
        delivery.status = 'success';
        delivery.deliveredAt = new Date().toISOString();
        break;
      } catch (error) {
        delivery.error = this.formatError(error);
        delivery.status = 'failed';

        if (attempt < this.config.retryAttempts) {
          await this.delay(this.getRetryDelay(attempt));
        }
      }
    }

    return delivery;
  }

  /**
   * Make HTTP request to webhook endpoint
   */
  private async makeRequest(payload: WebhookPayload): Promise<WebhookResponse> {
    const startTime = Date.now();
    const signature = this.generateSignature(JSON.stringify(payload));
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'User-Agent': 'DreamAI-Webhook/1.0',
      'X-Webhook-Signature': signature,
      'X-Webhook-Timestamp': payload.timestamp,
      'X-Webhook-Event': payload.event,
      ...this.config.headers,
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

    try {
      const response = await fetch(this.config.url, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const processingTime = Date.now() - startTime;
      const responseData = await response.text();

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${responseData}`);
      }

      return {
        success: true,
        message: responseData,
        timestamp: new Date().toISOString(),
        processingTime,
      };
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  /**
   * Generate HMAC signature for payload verification
   */
  private generateSignature(payload: string): string {
    return crypto
      .createHmac('sha256', this.config.secret)
      .update(payload)
      .digest('hex');
  }

  /**
   * Verify webhook signature
   */
  static verifySignature(payload: string, signature: string, secret: string): boolean {
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex');
    
    return crypto.timingSafeEqual(
      Buffer.from(signature, 'hex'),
      Buffer.from(expectedSignature, 'hex')
    );
  }

  /**
   * Format error for webhook delivery
   */
  private formatError(error: any): WebhookError {
    return {
      error: error.message || 'Unknown error',
      code: error.status || error.code || 500,
      details: {
        name: error.name,
        stack: error.stack,
      },
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Calculate retry delay with exponential backoff
   */
  private getRetryDelay(attempt: number): number {
    return Math.min(1000 * Math.pow(2, attempt - 1), 30000); // Max 30 seconds
  }

  /**
   * Delay execution for specified milliseconds
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Generate unique ID for webhook delivery
   */
  private generateId(): string {
    return `wh_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Update webhook configuration
   */
  updateConfig(newConfig: Partial<WebhookConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  /**
   * Test webhook endpoint connectivity
   */
  async testConnection(): Promise<boolean> {
    try {
      const testPayload: WebhookPayload = {
        id: 'test_' + Date.now(),
        event: 'webhook.test',
        timestamp: new Date().toISOString(),
        data: { test: true },
        source: 'DreamAI',
      };

      const delivery = await this.sendWebhook(testPayload);
      return delivery.status === 'success';
    } catch {
      return false;
    }
  }
} 