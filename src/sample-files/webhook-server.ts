import express, { Request, Response } from 'express';
import { WebhookClient } from './webhook-client';
import { 
  WebhookPayload, 
  DreamWebhookPayload, 
  UserWebhookPayload,
  WebhookResponse 
} from './webhook-models';

export interface WebhookServerConfig {
  port: number;
  secret: string;
  endpoint: string;
  enableLogging: boolean;
}

export class WebhookServer {
  private app: express.Application;
  private config: WebhookServerConfig;
  private eventHandlers: Map<string, (payload: WebhookPayload) => Promise<void>>;

  constructor(config: WebhookServerConfig) {
    this.app = express();
    this.config = config;
    this.eventHandlers = new Map();
    this.setupMiddleware();
    this.setupRoutes();
  }

  private setupMiddleware(): void {
    // Parse JSON bodies
    this.app.use(express.json({
      verify: (req: any, res: any, buf: Buffer) => {
        req.rawBody = buf;
      }
    }));

    // CORS middleware
    this.app.use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'POST, OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Content-Type, X-Webhook-Signature, X-Webhook-Timestamp, X-Webhook-Event');
      next();
    });

    // Logging middleware
    if (this.config.enableLogging) {
      this.app.use((req, res, next) => {
        console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
        next();
      });
    }
  }

  private setupRoutes(): void {
    // Health check endpoint
    this.app.get('/health', (req: Request, res: Response) => {
      res.json({ status: 'healthy', timestamp: new Date().toISOString() });
    });

    // Main webhook endpoint
    this.app.post(this.config.endpoint, async (req: Request, res: Response) => {
      try {
        const startTime = Date.now();
        
        // Verify signature
        const signature = req.headers['x-webhook-signature'] as string;
        const timestamp = req.headers['x-webhook-timestamp'] as string;
        
        if (!signature) {
          return res.status(401).json({ error: 'Missing webhook signature' });
        }

        const rawBody = (req as any).rawBody?.toString() || JSON.stringify(req.body);
        
        if (!WebhookClient.verifySignature(rawBody, signature, this.config.secret)) {
          return res.status(401).json({ error: 'Invalid webhook signature' });
        }

        // Verify timestamp (reject requests older than 5 minutes)
        if (timestamp) {
          const webhookTime = new Date(timestamp).getTime();
          const currentTime = Date.now();
          const timeDiff = Math.abs(currentTime - webhookTime);
          
          if (timeDiff > 5 * 60 * 1000) { // 5 minutes
            return res.status(400).json({ error: 'Webhook timestamp too old' });
          }
        }

        const payload: WebhookPayload = req.body;

        // Validate payload
        if (!this.validatePayload(payload)) {
          return res.status(400).json({ error: 'Invalid webhook payload' });
        }

        // Process the webhook
        await this.processWebhook(payload);

        const processingTime = Date.now() - startTime;
        
        const response: WebhookResponse = {
          success: true,
          message: 'Webhook processed successfully',
          timestamp: new Date().toISOString(),
          processingTime,
        };

        res.json(response);

        if (this.config.enableLogging) {
          console.log(`Webhook processed: ${payload.event} (${processingTime}ms)`);
        }

      } catch (error) {
        console.error('Webhook processing error:', error);
        
        res.status(500).json({
          error: 'Internal server error',
          message: error instanceof Error ? error.message : 'Unknown error',
          timestamp: new Date().toISOString(),
        });
      }
    });

    // 404 handler
    this.app.use((req: Request, res: Response) => {
      res.status(404).json({ error: 'Endpoint not found' });
    });
  }

  private validatePayload(payload: any): payload is WebhookPayload {
    return (
      payload &&
      typeof payload.id === 'string' &&
      typeof payload.event === 'string' &&
      typeof payload.timestamp === 'string' &&
      typeof payload.data === 'object' &&
      typeof payload.source === 'string'
    );
  }

  private async processWebhook(payload: WebhookPayload): Promise<void> {
    // Call registered event handlers
    const handler = this.eventHandlers.get(payload.event);
    
    if (handler) {
      await handler(payload);
    } else {
      // Default processing based on event type
      await this.defaultEventProcessor(payload);
    }
  }

  private async defaultEventProcessor(payload: WebhookPayload): Promise<void> {
    switch (payload.event) {
      case 'dream.created':
        await this.processDreamCreated(payload as DreamWebhookPayload);
        break;
      case 'dream.interpreted':
        await this.processDreamInterpreted(payload as DreamWebhookPayload);
        break;
      case 'dream.shared':
        await this.processDreamShared(payload as DreamWebhookPayload);
        break;
      case 'user.created':
        await this.processUserCreated(payload as UserWebhookPayload);
        break;
      case 'user.updated':
        await this.processUserUpdated(payload as UserWebhookPayload);
        break;
      case 'user.deleted':
        await this.processUserDeleted(payload as UserWebhookPayload);
        break;
      default:
        console.log(`Unhandled event: ${payload.event}`);
    }
  }

  // Event-specific processors
  private async processDreamCreated(payload: DreamWebhookPayload): Promise<void> {
    console.log(`New dream created: ${payload.data.title} by user ${payload.data.userId}`);
    // Add your dream creation logic here
  }

  private async processDreamInterpreted(payload: DreamWebhookPayload): Promise<void> {
    console.log(`Dream interpreted: ${payload.data.dreamId}`);
    // Add your dream interpretation logic here
  }

  private async processDreamShared(payload: DreamWebhookPayload): Promise<void> {
    console.log(`Dream shared: ${payload.data.dreamId}`);
    // Add your dream sharing logic here
  }

  private async processUserCreated(payload: UserWebhookPayload): Promise<void> {
    console.log(`New user created: ${payload.data.username} (${payload.data.email})`);
    // Add your user creation logic here
  }

  private async processUserUpdated(payload: UserWebhookPayload): Promise<void> {
    console.log(`User updated: ${payload.data.userId}`);
    // Add your user update logic here
  }

  private async processUserDeleted(payload: UserWebhookPayload): Promise<void> {
    console.log(`User deleted: ${payload.data.userId}`);
    // Add your user deletion logic here
  }

  /**
   * Register a custom event handler
   */
  public onEvent(event: string, handler: (payload: WebhookPayload) => Promise<void>): void {
    this.eventHandlers.set(event, handler);
  }

  /**
   * Remove an event handler
   */
  public removeEventHandler(event: string): void {
    this.eventHandlers.delete(event);
  }

  /**
   * Start the webhook server
   */
  public start(): Promise<void> {
    return new Promise((resolve) => {
      this.app.listen(this.config.port, () => {
        console.log(`Webhook server listening on port ${this.config.port}`);
        console.log(`Webhook endpoint: POST ${this.config.endpoint}`);
        resolve();
      });
    });
  }

  /**
   * Get Express app instance for testing
   */
  public getApp(): express.Application {
    return this.app;
  }
} 