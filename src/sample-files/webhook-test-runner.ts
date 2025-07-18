import { WebhookClient } from './webhook-client';
import { WebhookServer } from './webhook-server';
import { WebhookUtils } from './webhook-utils';
import { DreamWebhookPayload, UserWebhookPayload } from './webhook-models';

/**
 * Comprehensive webhook test runner with examples
 */
export class WebhookTestRunner {
  
  /**
   * Run basic webhook client tests
   */
  static async testWebhookClient(): Promise<void> {
    console.log('\n🔧 Testing Webhook Client...\n');
    
    // Create test configuration
    const config = WebhookUtils.createTestWebhookConfig({
      url: 'https://webhook.site/your-unique-url', // Replace with actual test URL
      retryAttempts: 2,
      timeout: 3000,
    });
    
    const client = new WebhookClient(config);
    
    // Test 1: Dream created webhook
    console.log('1. Sending dream.created webhook...');
    const dreamPayload = WebhookUtils.createDreamWebhookPayload('dream.created', {
      title: 'Test Dream',
      content: 'This is a test dream for webhook validation',
      tags: ['test', 'validation'],
    });
    
    try {
      const delivery = await client.sendWebhook(dreamPayload);
      console.log(`   ${WebhookUtils.formatDeliveryResult(delivery)}`);
    } catch (error) {
      console.error('   Error:', error);
    }
    
    // Test 2: User created webhook
    console.log('\n2. Sending user.created webhook...');
    const userPayload = WebhookUtils.createUserWebhookPayload('user.created', {
      email: 'testuser@webhook-test.com',
      username: 'webhook_tester',
    });
    
    try {
      const delivery = await client.sendWebhook(userPayload);
      console.log(`   ${WebhookUtils.formatDeliveryResult(delivery)}`);
    } catch (error) {
      console.error('   Error:', error);
    }
    
    // Test 3: Connection test
    console.log('\n3. Testing connection...');
    const isConnected = await client.testConnection();
    console.log(`   Connection status: ${isConnected ? '✅ Connected' : '❌ Failed'}`);
  }
  
  /**
   * Run webhook server tests
   */
  static async testWebhookServer(): Promise<void> {
    console.log('\n🖥️  Testing Webhook Server...\n');
    
    const server = new WebhookServer({
      port: 3001,
      secret: 'test_secret_key_123',
      endpoint: '/webhook',
      enableLogging: true,
    });
    
    // Add custom event handlers
    server.onEvent('dream.created', async (payload: DreamWebhookPayload) => {
      console.log(`🌙 Custom handler: Dream "${payload.data.title}" created by ${payload.data.userId}`);
      
      // Simulate some processing
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // You could trigger other actions here, like:
      // - Send email notifications
      // - Update analytics
      // - Trigger AI interpretation
    });
    
    server.onEvent('user.created', async (payload: UserWebhookPayload) => {
      console.log(`👤 Custom handler: Welcome ${payload.data.username}!`);
      
      // Simulate welcome email or setup
      await new Promise(resolve => setTimeout(resolve, 50));
    });
    
    try {
      await server.start();
      console.log('Server started successfully');
      
      // Give some time for manual testing
      console.log('\nServer is running. You can test it with:');
      console.log('curl -X POST http://localhost:3001/webhook \\');
      console.log('  -H "Content-Type: application/json" \\');
      console.log('  -H "X-Webhook-Signature: your_signature" \\');
      console.log('  -d \'{"id":"test","event":"test.event","timestamp":"' + new Date().toISOString() + '","data":{"test":true},"source":"manual"}\'\n');
      
      // Wait 30 seconds for testing
      await new Promise(resolve => setTimeout(resolve, 30000));
      
    } catch (error) {
      console.error('Server error:', error);
    }
  }
  
  /**
   * Run mock server integration tests
   */
  static async testMockServerIntegration(): Promise<void> {
    console.log('\n🔗 Testing Mock Server Integration...\n');
    
    // Start mock server
    const mockServer = WebhookUtils.createMockServer(3002);
    await mockServer.start();
    
    try {
      // Create client pointing to mock server
      const config = WebhookUtils.createTestWebhookConfig({
        url: 'http://localhost:3002/webhook',
      });
      const client = new WebhookClient(config);
      
      // Send multiple test payloads
      console.log('Sending test payloads to mock server...');
      const payloads = WebhookUtils.createTestPayloadBatch(3);
      
      for (let i = 0; i < payloads.length; i++) {
        const payload = payloads[i];
        console.log(`${i + 1}. Sending ${payload.event}...`);
        
        try {
          const delivery = await client.sendWebhook(payload);
          console.log(`   ${WebhookUtils.formatDeliveryResult(delivery)}`);
        } catch (error) {
          console.error('   Error:', error);
        }
      }
      
      // Check received payloads
      const receivedPayloads = mockServer.getReceivedPayloads();
      console.log(`\n📦 Mock server received ${receivedPayloads.length} payloads:`);
      receivedPayloads.forEach((payload, index) => {
        console.log(`   ${index + 1}. ${payload.event} (ID: ${payload.id})`);
      });
      
    } finally {
      mockServer.stop();
    }
  }
  
  /**
   * Run performance tests
   */
  static async testPerformance(): Promise<void> {
    console.log('\n⚡ Running Performance Tests...\n');
    
    const mockServer = WebhookUtils.createMockServer(3003);
    await mockServer.start();
    
    try {
      const config = WebhookUtils.createTestWebhookConfig({
        url: 'http://localhost:3003/webhook',
        timeout: 1000,
      });
      const client = new WebhookClient(config);
      
      // Test different scenarios
      const testScenarios = [
        { name: 'Light load', payloadCount: 10, concurrency: 2 },
        { name: 'Medium load', payloadCount: 50, concurrency: 5 },
        { name: 'Heavy load', payloadCount: 100, concurrency: 10 },
      ];
      
      for (const scenario of testScenarios) {
        console.log(`🧪 ${scenario.name}: ${scenario.payloadCount} payloads, ${scenario.concurrency} concurrent`);
        
        const results = await WebhookUtils.performanceTest(client, scenario);
        
        console.log(`   ✅ Success: ${results.successful}/${results.totalPayloads}`);
        console.log(`   ❌ Failed: ${results.failed}/${results.totalPayloads}`);
        console.log(`   ⏱️  Duration: ${results.duration}ms`);
        console.log(`   📊 Throughput: ${results.throughput.toFixed(2)} req/sec\n`);
      }
      
    } finally {
      mockServer.stop();
    }
  }
  
  /**
   * Test webhook signature verification
   */
  static testSignatureVerification(): void {
    console.log('\n🔐 Testing Signature Verification...\n');
    
    const secret = 'test_secret_key';
    const payload = '{"test": "data"}';
    
    // Test valid signature
    const client = new WebhookClient({
      url: 'http://test.com',
      secret,
      events: [],
      active: true,
      retryAttempts: 1,
      timeout: 1000,
    });
    
    const validSignature = (client as any).generateSignature(payload);
    const isValid = WebhookClient.verifySignature(payload, validSignature, secret);
    console.log(`1. Valid signature verification: ${isValid ? '✅ Passed' : '❌ Failed'}`);
    
    // Test invalid signature
    const invalidSignature = 'invalid_signature';
    const isInvalid = WebhookClient.verifySignature(payload, invalidSignature, secret);
    console.log(`2. Invalid signature rejection: ${!isInvalid ? '✅ Passed' : '❌ Failed'}`);
    
    // Test wrong secret
    const wrongSecret = 'wrong_secret';
    const isWrongSecret = WebhookClient.verifySignature(payload, validSignature, wrongSecret);
    console.log(`3. Wrong secret rejection: ${!isWrongSecret ? '✅ Passed' : '❌ Failed'}`);
  }
  
  /**
   * Test payload validation
   */
  static testPayloadValidation(): void {
    console.log('\n✅ Testing Payload Validation...\n');
    
    // Valid payload
    const validPayload = WebhookUtils.createDreamWebhookPayload('dream.created');
    const validResult = WebhookUtils.validateWebhookPayload(validPayload);
    console.log(`1. Valid payload: ${validResult.valid ? '✅ Passed' : '❌ Failed'}`);
    
    // Invalid payloads
    const invalidPayloads = [
      { test: 'missing required fields' },
      { id: 123, event: 'test', timestamp: 'invalid', data: {}, source: 'test' },
      { id: 'test', event: 'test', timestamp: 'not-a-date', data: null, source: 'test' },
    ];
    
    invalidPayloads.forEach((payload, index) => {
      const result = WebhookUtils.validateWebhookPayload(payload);
      console.log(`${index + 2}. Invalid payload ${index + 1}: ${!result.valid ? '✅ Passed' : '❌ Failed'}`);
      if (!result.valid) {
        console.log(`   Errors: ${result.errors.join(', ')}`);
      }
    });
  }
  
  /**
   * Run all tests
   */
  static async runAllTests(): Promise<void> {
    console.log('🚀 Starting Webhook Test Suite...');
    console.log('=====================================');
    
    try {
      // Run synchronous tests first
      this.testSignatureVerification();
      this.testPayloadValidation();
      
      // Run asynchronous tests
      await this.testMockServerIntegration();
      await this.testPerformance();
      
      // Uncomment these for manual testing
      // await this.testWebhookClient();
      // await this.testWebhookServer();
      
      console.log('\n🎉 All tests completed!');
      
    } catch (error) {
      console.error('\n💥 Test suite failed:', error);
    }
  }
}

// Example usage
if (require.main === module) {
  WebhookTestRunner.runAllTests().catch(console.error);
} 