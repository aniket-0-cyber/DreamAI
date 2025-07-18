// Webhook Testing Suite - Main exports
export * from './webhook-models';
export * from './webhook-client';
export * from './webhook-server';
export * from './webhook-utils';
export * from './webhook-test-runner';

// Re-export commonly used types for convenience
export type {
  WebhookPayload,
  DreamWebhookPayload,
  UserWebhookPayload,
  WebhookConfig,
  WebhookResponse,
  WebhookError,
  WebhookDelivery,
} from './webhook-models';

// Example usage and quick start guide
export const WEBHOOK_EXAMPLES = {
  // Basic usage example
  basicUsage: `
import { WebhookClient, WebhookUtils } from './webhook-testing-suite';

// 1. Create a webhook client
const config = WebhookUtils.createTestWebhookConfig({
  url: 'https://your-webhook-endpoint.com/webhook',
  secret: 'your-secret-key'
});
const client = new WebhookClient(config);

// 2. Create and send a webhook
const payload = WebhookUtils.createDreamWebhookPayload('dream.created');
const delivery = await client.sendWebhook(payload);
console.log('Webhook sent:', delivery.status);
  `,

  // Server setup example
  serverSetup: `
import { WebhookServer } from './webhook-testing-suite';

// 1. Create and configure server
const server = new WebhookServer({
  port: 3001,
  secret: 'your-secret-key',
  endpoint: '/webhook',
  enableLogging: true
});

// 2. Add event handlers
server.onEvent('dream.created', async (payload) => {
  console.log('New dream:', payload.data.title);
});

// 3. Start the server
await server.start();
  `,

  // Testing example
  testing: `
import { WebhookTestRunner } from './webhook-testing-suite';

// Run comprehensive tests
await WebhookTestRunner.runAllTests();
  `,
};

// Quick start function
export async function quickStart(): Promise<void> {
  console.log('🚀 Webhook Testing Suite Quick Start');
  console.log('===================================');
  console.log(WEBHOOK_EXAMPLES.basicUsage);
  console.log('\nFor more examples, check the WebhookTestRunner class!');
} 