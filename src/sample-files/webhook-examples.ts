import { WebhookClient, EventFactory, WebhookTest } from './webhook-core';

// Basic Usage Examples
export class WebhookExamples {
  
  // Example 1: Send a simple webhook
  static async basicExample() {
    console.log('📤 Basic Webhook Example');
    
    const client = new WebhookClient(WebhookTest.config());
    const event = EventFactory.dream('dream_123', 'user_456', 'Flying Dream');
    
    const success = await client.send(event);
    console.log(success ? '✅ Sent!' : '❌ Failed');
  }

  // Example 2: Test with mock server
  static async mockExample() {
    console.log('🖥️  Mock Server Example');
    
    const mock = await WebhookTest.mockServer(3001);
    const client = new WebhookClient(WebhookTest.config(mock.url));
    
    // Send some events
    await client.send(EventFactory.user('user_123', 'test@example.com'));
    await client.send(EventFactory.payment('user_123', 19.99));
    await client.send(EventFactory.dream('dream_456', 'user_123', 'Ocean Dream'));
    
    console.log(`📨 Received ${mock.events().length} events`);
    mock.events().forEach(e => console.log(`   - ${e.type}`));
    
    mock.stop();
  }

  // Example 3: Signature verification
  static verifyExample() {
    console.log('🔐 Signature Verification Example');
    
    const secret = 'my_secret';
    const payload = '{"test": "data"}';
    const signature = require('crypto').createHmac('sha256', secret).update(payload).digest('hex');
    
    const isValid = WebhookClient.verify(payload, signature, secret);
    console.log(isValid ? '✅ Valid signature' : '❌ Invalid signature');
  }

  // Example 4: Batch sending
  static async batchExample() {
    console.log('📦 Batch Sending Example');
    
    const mock = await WebhookTest.mockServer(3002);
    const client = new WebhookClient(WebhookTest.config(mock.url));
    
    const events = [
      EventFactory.dream('dream_1', 'user_1', 'Dream 1'),
      EventFactory.dream('dream_2', 'user_2', 'Dream 2'),
      EventFactory.user('user_3', 'user3@test.com'),
      EventFactory.payment('user_1', 9.99),
    ];
    
    const results = await Promise.all(events.map(e => client.send(e)));
    const successful = results.filter(Boolean).length;
    
    console.log(`📊 ${successful}/${events.length} webhooks sent successfully`);
    
    mock.stop();
  }

  // Run all examples
  static async runAll() {
    console.log('🚀 Running All Webhook Examples\n');
    
    await this.basicExample();
    console.log();
    
    await this.mockExample();
    console.log();
    
    this.verifyExample();
    console.log();
    
    await this.batchExample();
    
    console.log('\n🎉 All examples completed!');
  }
}

// Quick Test Runner
export class QuickTest {
  
  static async performanceTest() {
    console.log('⚡ Quick Performance Test');
    
    const mock = await WebhookTest.mockServer(3003);
    const client = new WebhookClient(WebhookTest.config(mock.url));
    
    const startTime = Date.now();
    const promises = Array.from({ length: 50 }, (_, i) => 
      client.send(EventFactory.dream(`dream_${i}`, `user_${i}`, `Test Dream ${i}`))
    );
    
    const results = await Promise.all(promises);
    const duration = Date.now() - startTime;
    const successful = results.filter(Boolean).length;
    
    console.log(`📊 Results: ${successful}/50 success in ${duration}ms`);
    console.log(`🔥 Rate: ${(50 / duration * 1000).toFixed(1)} req/sec`);
    
    mock.stop();
  }

  static async errorTest() {
    console.log('⚠️  Error Handling Test');
    
    const client = new WebhookClient({
      url: 'http://invalid-url-12345.com/webhook',
      secret: 'test',
      timeout: 1000,
    });
    
    const event = EventFactory.user('test_user', 'test@test.com');
    const success = await client.send(event);
    
    console.log(success ? '❌ Should have failed' : '✅ Properly handled error');
  }

  static async runQuickTests() {
    console.log('🧪 Running Quick Tests\n');
    
    await this.performanceTest();
    console.log();
    
    await this.errorTest();
    
    console.log('\n✨ Quick tests completed!');
  }
}

// Auto-run examples if called directly
if (require.main === module) {
  (async () => {
    await WebhookExamples.runAll();
    console.log();
    await QuickTest.runQuickTests();
  })().catch(console.error);
} 