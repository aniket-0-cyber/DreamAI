import { WebhookManager, EventBuilder, TestServer } from './webhook-manager';

// Test scenarios for webhook functionality
export class WebhookTests {

  // Test 1: Basic webhook setup and triggering
  static async basicTest() {
    console.log('🔧 Test 1: Basic Webhook Setup');
    
    const manager = new WebhookManager();
    const server = await TestServer.create(3001);
    
    try {
      // Add webhook
      const webhookId = manager.addWebhook(
        server.url, 
        ['dream_created', 'user_signup'], 
        'test_secret_123'
      );
      
      // Trigger events
      await manager.trigger('dream_created', EventBuilder.dream(
        'dream_001', 'user_123', 'Flying Dream', 'I was flying over mountains...'
      ));
      
      await manager.trigger('user_signup', EventBuilder.user(
        'user_123', 'test@example.com', 'premium'
      ));
      
      // Wait for processing
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const received = server.getReceived();
      console.log(`📨 Received ${received.length} webhooks`);
      received.forEach((r, i) => console.log(`   ${i+1}. ${r.body.event}`));
      
    } finally {
      server.stop();
    }
  }

  // Test 2: Multiple webhooks with different events
  static async multiWebhookTest() {
    console.log('\n🔀 Test 2: Multiple Webhooks');
    
    const manager = new WebhookManager();
    const server1 = await TestServer.create(3002);
    const server2 = await TestServer.create(3003);
    
    try {
      // Add different webhooks for different events
      manager.addWebhook(server1.url, ['dream_created'], 'secret1');
      manager.addWebhook(server2.url, ['payment_success', 'analysis_complete'], 'secret2');
      
      // Trigger various events
      await manager.trigger('dream_created', EventBuilder.dream(
        'dream_002', 'user_456', 'Ocean Dream', 'Underwater adventure...'
      ));
      
      await manager.trigger('payment_success', EventBuilder.payment(
        'user_456', 19.99, 'Premium Monthly'
      ));
      
      await manager.trigger('analysis_complete', EventBuilder.analysis(
        'dream_002', 'user_456', 'Represents freedom and exploration', 0.85
      ));
      
      await new Promise(resolve => setTimeout(resolve, 600));
      
      console.log(`📨 Server 1 received: ${server1.getReceived().length} webhooks`);
      console.log(`📨 Server 2 received: ${server2.getReceived().length} webhooks`);
      
    } finally {
      server1.stop();
      server2.stop();
    }
  }

  // Test 3: Webhook management operations
  static async managementTest() {
    console.log('\n⚙️  Test 3: Webhook Management');
    
    const manager = new WebhookManager();
    
    // Add multiple webhooks
    const id1 = manager.addWebhook('https://webhook1.com', ['dream_created']);
    const id2 = manager.addWebhook('https://webhook2.com', ['user_signup']);
    const id3 = manager.addWebhook('https://webhook3.com', ['payment_success']);
    
    console.log(`📋 Total webhooks: ${manager.listWebhooks().length}`);
    
    // List webhooks
    manager.listWebhooks().forEach(wh => {
      console.log(`   - ${wh.url} (${wh.events.join(', ')})`);
    });
    
    // Get specific webhook
    const webhook = manager.getWebhook(id1);
    console.log(`🔍 Webhook ${id1}: ${webhook?.url}`);
    
    // Remove webhook
    const removed = manager.removeWebhook(id2);
    console.log(`🗑️  Removed webhook: ${removed}`);
    console.log(`📋 Remaining webhooks: ${manager.listWebhooks().length}`);
  }

  // Test 4: Error handling
  static async errorTest() {
    console.log('\n⚠️  Test 4: Error Handling');
    
    const manager = new WebhookManager();
    
    // Add webhook with invalid URL
    manager.addWebhook('http://invalid-domain-12345.com/webhook', ['dream_created']);
    
    // Trigger event
    await manager.trigger('dream_created', EventBuilder.dream(
      'dream_003', 'user_789', 'Error Test Dream', 'This should fail...'
    ));
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('✅ Error handling test completed');
  }

  // Test 5: Performance test
  static async performanceTest() {
    console.log('\n⚡ Test 5: Performance Test');
    
    const manager = new WebhookManager();
    const server = await TestServer.create(3004);
    
    try {
      manager.addWebhook(server.url, ['dream_created', 'user_signup']);
      
      const startTime = Date.now();
      
      // Fire multiple events quickly
      const promises = [];
      for (let i = 0; i < 20; i++) {
        promises.push(
          manager.trigger('dream_created', EventBuilder.dream(
            `dream_${i}`, `user_${i}`, `Dream ${i}`, `Content ${i}`
          ))
        );
      }
      
      await Promise.all(promises);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const duration = Date.now() - startTime;
      const received = server.getReceived();
      
      console.log(`📊 Processed ${received.length} webhooks in ${duration}ms`);
      console.log(`🔥 Rate: ${(received.length / duration * 1000).toFixed(1)} webhooks/sec`);
      
    } finally {
      server.stop();
    }
  }

  // Run all tests
  static async runAll() {
    console.log('🚀 Running All Webhook Tests');
    console.log('============================');
    
    await this.basicTest();
    await this.multiWebhookTest();
    await this.managementTest();
    await this.errorTest();
    await this.performanceTest();
    
    console.log('\n🎉 All tests completed!');
  }
}

// Real-world usage examples
export class UsageExamples {
  
  // Example: Dream analysis workflow
  static async dreamWorkflow() {
    console.log('\n🌙 Example: Dream Analysis Workflow');
    
    const manager = new WebhookManager();
    const server = await TestServer.create(3005);
    
    try {
      // Setup webhooks for different services
      manager.addWebhook(server.url, ['dream_created'], 'analytics_secret');
      manager.addWebhook(server.url, ['analysis_complete'], 'notification_secret');
      
      // User submits dream
      console.log('1. 👤 User submits dream...');
      await manager.trigger('dream_created', EventBuilder.dream(
        'dream_workflow_1', 'user_workflow', 'Mysterious Forest', 
        'Walking through a glowing forest at night...'
      ));
      
      // Simulate AI analysis delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // AI completes analysis
      console.log('2. 🤖 AI analysis complete...');
      await manager.trigger('analysis_complete', EventBuilder.analysis(
        'dream_workflow_1', 'user_workflow', 
        'Symbolizes personal growth and inner guidance', 0.92
      ));
      
      await new Promise(resolve => setTimeout(resolve, 200));
      
      console.log(`✅ Workflow complete! ${server.getReceived().length} events processed`);
      
    } finally {
      server.stop();
    }
  }

  // Example: User journey tracking
  static async userJourney() {
    console.log('\n👤 Example: User Journey Tracking');
    
    const manager = new WebhookManager();
    const server = await TestServer.create(3006);
    
    try {
      // Add webhooks for user events
      manager.addWebhook(server.url, ['user_signup', 'payment_success']);
      
      // User signs up
      console.log('1. 📝 User signs up...');
      await manager.trigger('user_signup', EventBuilder.user(
        'journey_user_1', 'journey@example.com', 'free'
      ));
      
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // User upgrades to premium
      console.log('2. 💳 User upgrades to premium...');
      await manager.trigger('payment_success', EventBuilder.payment(
        'journey_user_1', 9.99, 'Premium Monthly'
      ));
      
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const events = server.getReceived();
      console.log(`📈 User journey tracked: ${events.length} events`);
      events.forEach((e, i) => console.log(`   ${i+1}. ${e.body.event}`));
      
    } finally {
      server.stop();
    }
  }

  static async runExamples() {
    console.log('\n📚 Running Usage Examples');
    console.log('==========================');
    
    await this.dreamWorkflow();
    await this.userJourney();
    
    console.log('\n✨ Examples completed!');
  }
}

// Auto-run if called directly
if (require.main === module) {
  (async () => {
    await WebhookTests.runAll();
    await UsageExamples.runExamples();
  })().catch(console.error);
} 