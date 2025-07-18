import { WebhookAPI, WebhookEventFactory, WebhookTester, WebhookEvent, WebhookResponse } from './webhook-api';

// ===== DEMO SCENARIOS =====

export class WebhookDemos {
  
  /**
   * Demo 1: Basic webhook sending
   */
  static async basicWebhookDemo(): Promise<void> {
    console.log('🚀 Demo 1: Basic Webhook Sending');
    console.log('================================\n');

    // Setup
    const config = WebhookTester.createTestConfig({
      endpoint: 'https://webhook.site/unique-url', // Replace with your test URL
      timeout: 3000,
    });
    
    const api = new WebhookAPI(config);

    // Create a dream event
    const dreamEvent = WebhookEventFactory.createDreamEvent('dream.created', {
      dreamId: 'dream_123',
      userId: 'user_456',
      title: 'Flying Over Mountains',
      content: 'I was soaring high above snow-capped mountains...',
      mood: 'peaceful',
      symbols: ['flying', 'mountains', 'freedom'],
    });

    console.log('📤 Sending dream.created event...');
    console.log('Event ID:', dreamEvent.id);
    console.log('Event Type:', dreamEvent.type);

    try {
      const response = await api.sendEvent(dreamEvent);
      
      if (response.success) {
        console.log('✅ Webhook sent successfully!');
        console.log(`   Status: ${response.statusCode}`);
        console.log(`   Response Time: ${response.responseTime}ms`);
      } else {
        console.log('❌ Webhook failed:');
        console.log(`   Error: ${response.error}`);
      }
    } catch (error) {
      console.error('💥 Demo failed:', error);
    }

    console.log('\n' + '='.repeat(50) + '\n');
  }

  /**
   * Demo 2: Batch webhook processing
   */
  static async batchWebhookDemo(): Promise<void> {
    console.log('📦 Demo 2: Batch Webhook Processing');
    console.log('===================================\n');

    const mockReceiver = WebhookTester.createMockReceiver(3001);
    
    try {
      // Start mock server
      await mockReceiver.start();
      
      // Setup client
      const config = WebhookTester.createTestConfig({
        endpoint: 'http://localhost:3001/webhook',
        timeout: 2000,
        retries: 2,
      });
      
      const api = new WebhookAPI(config);
      
      // Generate sample events
      const events = WebhookTester.generateSampleEvents(5);
      
      console.log(`📤 Sending ${events.length} webhook events...`);
      events.forEach((event, index) => {
        console.log(`   ${index + 1}. ${event.type} (${event.id})`);
      });
      
      // Send concurrently
      console.log('\n🔄 Processing webhooks concurrently...');
      const results = await WebhookTester.sendBatch(api, events, { concurrent: true });
      
      // Analyze results
      const analysis = WebhookTester.analyzeResults(results);
      
      console.log('\n📊 Results:');
      console.log(`   Total: ${analysis.total}`);
      console.log(`   Successful: ${analysis.successful}`);
      console.log(`   Failed: ${analysis.failed}`);
      console.log(`   Success Rate: ${analysis.successRate.toFixed(1)}%`);
      console.log(`   Avg Response Time: ${analysis.averageResponseTime}ms`);
      
      // Check received events
      const receivedEvents = mockReceiver.getReceivedEvents();
      console.log(`\n📨 Mock server received ${receivedEvents.length} events:`);
      receivedEvents.forEach((event, index) => {
        console.log(`   ${index + 1}. ${event.type} at ${event.timestamp}`);
      });
      
    } finally {
      mockReceiver.stop();
    }

    console.log('\n' + '='.repeat(50) + '\n');
  }

  /**
   * Demo 3: Error handling and retries
   */
  static async errorHandlingDemo(): Promise<void> {
    console.log('⚠️  Demo 3: Error Handling & Retries');
    console.log('====================================\n');

    // Test with invalid endpoint
    const config = WebhookTester.createTestConfig({
      endpoint: 'http://invalid-domain-12345.com/webhook',
      timeout: 1000,
      retries: 2,
    });
    
    const api = new WebhookAPI(config);
    
    const testEvent = WebhookEventFactory.createUserEvent({
      userId: 'user_test',
      email: 'test@example.com',
      username: 'error_test_user',
      plan: 'free',
    });

    console.log('📤 Sending webhook to invalid endpoint...');
    console.log('Endpoint:', config.endpoint);
    console.log('Retries configured:', config.retries);

    const startTime = Date.now();
    
    try {
      const response = await api.sendEvent(testEvent);
      const totalTime = Date.now() - startTime;
      
      console.log('\n📋 Response received:');
      console.log(`   Success: ${response.success}`);
      console.log(`   Status Code: ${response.statusCode}`);
      console.log(`   Error: ${response.error}`);
      console.log(`   Total Time: ${totalTime}ms`);
      console.log(`   Response Time: ${response.responseTime}ms`);
      
    } catch (error) {
      console.error('💥 Unexpected error:', error);
    }

    console.log('\n' + '='.repeat(50) + '\n');
  }

  /**
   * Demo 4: Signature verification
   */
  static signatureVerificationDemo(): void {
    console.log('🔐 Demo 4: Signature Verification');
    console.log('==================================\n');

    const secret = 'my_webhook_secret_key';
    const payload = JSON.stringify({
      id: 'evt_test_123',
      type: 'test.event',
      data: { message: 'Hello, webhook!' }
    });

    // Generate valid signature
    const api = new WebhookAPI({
      endpoint: 'http://test.com',
      secret,
      timeout: 1000,
      retries: 1,
    });
    
    const validSignature = (api as any).generateSignature(payload);
    
    console.log('🔧 Test Setup:');
    console.log('Secret:', secret);
    console.log('Payload:', payload);
    console.log('Generated Signature:', validSignature);
    
    console.log('\n🧪 Verification Tests:');
    
    // Test 1: Valid signature
    const isValid = WebhookAPI.verifySignature(payload, validSignature, secret);
    console.log(`1. Valid signature: ${isValid ? '✅ PASS' : '❌ FAIL'}`);
    
    // Test 2: Invalid signature
    const invalidSig = 'invalid_signature_123';
    const isInvalid = WebhookAPI.verifySignature(payload, invalidSig, secret);
    console.log(`2. Invalid signature: ${!isInvalid ? '✅ PASS' : '❌ FAIL'}`);
    
    // Test 3: Wrong secret
    const wrongSecret = 'wrong_secret';
    const wrongSecretTest = WebhookAPI.verifySignature(payload, validSignature, wrongSecret);
    console.log(`3. Wrong secret: ${!wrongSecretTest ? '✅ PASS' : '❌ FAIL'}`);
    
    // Test 4: Modified payload
    const modifiedPayload = payload.replace('Hello', 'Hi');
    const modifiedTest = WebhookAPI.verifySignature(modifiedPayload, validSignature, secret);
    console.log(`4. Modified payload: ${!modifiedTest ? '✅ PASS' : '❌ FAIL'}`);

    console.log('\n' + '='.repeat(50) + '\n');
  }

  /**
   * Demo 5: Performance testing
   */
  static async performanceDemo(): Promise<void> {
    console.log('⚡ Demo 5: Performance Testing');
    console.log('==============================\n');

    const mockReceiver = WebhookTester.createMockReceiver(3002);
    
    try {
      await mockReceiver.start();
      
      const config = WebhookTester.createTestConfig({
        endpoint: 'http://localhost:3002/webhook',
        timeout: 5000,
        retries: 1,
      });
      
      const api = new WebhookAPI(config);
      
      // Performance scenarios
      const scenarios = [
        { name: 'Light Load', count: 10, concurrent: false },
        { name: 'Medium Load', count: 50, concurrent: true },
        { name: 'Heavy Load', count: 100, concurrent: true },
      ];
      
      for (const scenario of scenarios) {
        console.log(`🧪 ${scenario.name}: ${scenario.count} events, ${scenario.concurrent ? 'concurrent' : 'sequential'}`);
        
        const events = WebhookTester.generateSampleEvents(scenario.count);
        const startTime = Date.now();
        
        const results = await WebhookTester.sendBatch(api, events, { 
          concurrent: scenario.concurrent 
        });
        
        const totalTime = Date.now() - startTime;
        const analysis = WebhookTester.analyzeResults(results);
        
        console.log(`   ✅ Success: ${analysis.successful}/${analysis.total}`);
        console.log(`   ⏱️  Total Time: ${totalTime}ms`);
        console.log(`   📊 Throughput: ${(analysis.total / totalTime * 1000).toFixed(2)} req/sec`);
        console.log(`   📈 Avg Response: ${analysis.averageResponseTime}ms\n`);
      }
      
    } finally {
      mockReceiver.stop();
    }

    console.log('='.repeat(50) + '\n');
  }

  /**
   * Run all demos
   */
  static async runAllDemos(): Promise<void> {
    console.log('🎬 Running All Webhook Demos');
    console.log('============================\n');

    try {
      await this.basicWebhookDemo();
      await this.batchWebhookDemo();
      await this.errorHandlingDemo();
      this.signatureVerificationDemo();
      await this.performanceDemo();
      
      console.log('🎉 All demos completed successfully!');
      
    } catch (error) {
      console.error('💥 Demo suite failed:', error);
    }
  }
}

// ===== REAL-WORLD SCENARIOS =====

export class WebhookScenarios {
  
  /**
   * Scenario: Dream analysis workflow
   */
  static async dreamAnalysisWorkflow(): Promise<void> {
    console.log('🌙 Scenario: Dream Analysis Workflow');
    console.log('====================================\n');

    const mockReceiver = WebhookTester.createMockReceiver(3003);
    
    try {
      await mockReceiver.start();
      
      const config = WebhookTester.createTestConfig({
        endpoint: 'http://localhost:3003/webhook',
      });
      
      const api = new WebhookAPI(config);
      
      // Step 1: User submits a dream
      console.log('1. 👤 User submits dream...');
      const dreamCreated = WebhookEventFactory.createDreamEvent('dream.created', {
        dreamId: 'dream_workflow_123',
        userId: 'user_workflow_456',
        title: 'Mysterious Forest Dream',
        content: 'I found myself walking through a dark forest with glowing trees...',
        mood: 'mysterious',
        symbols: ['forest', 'darkness', 'light', 'journey'],
      });
      
      await api.sendEvent(dreamCreated);
      await this.delay(500);
      
      // Step 2: AI analyzes the dream
      console.log('2. 🤖 AI analyzes dream...');
      const dreamAnalyzed = WebhookEventFactory.createDreamEvent('dream.analyzed', {
        dreamId: 'dream_workflow_123',
        userId: 'user_workflow_456',
        title: 'Mysterious Forest Dream',
        content: 'I found myself walking through a dark forest with glowing trees...',
        analysis: 'This dream suggests a journey of self-discovery. The dark forest represents unknown challenges, while the glowing trees symbolize guidance and hope.',
        mood: 'mysterious',
        symbols: ['forest', 'darkness', 'light', 'journey'],
      });
      
      await api.sendEvent(dreamAnalyzed);
      await this.delay(300);
      
      // Step 3: Send notification to user
      console.log('3. 📧 Sending notification...');
      const notification = WebhookEventFactory.createNotificationEvent({
        userId: 'user_workflow_456',
        type: 'email',
        template: 'dream_analysis_complete',
        status: 'sent',
      });
      
      await api.sendEvent(notification);
      
      const receivedEvents = mockReceiver.getReceivedEvents();
      console.log(`\n✅ Workflow completed! Processed ${receivedEvents.length} events:`);
      receivedEvents.forEach((event, index) => {
        console.log(`   ${index + 1}. ${event.type}`);
      });
      
    } finally {
      mockReceiver.stop();
    }
  }

  /**
   * Scenario: User subscription upgrade
   */
  static async subscriptionUpgradeWorkflow(): Promise<void> {
    console.log('\n💳 Scenario: Subscription Upgrade Workflow');
    console.log('==========================================\n');

    const mockReceiver = WebhookTester.createMockReceiver(3004);
    
    try {
      await mockReceiver.start();
      
      const config = WebhookTester.createTestConfig({
        endpoint: 'http://localhost:3004/webhook',
      });
      
      const api = new WebhookAPI(config);
      
      // Step 1: Payment completed
      console.log('1. 💰 Payment processed...');
      const payment = WebhookEventFactory.createPaymentEvent({
        userId: 'user_upgrade_789',
        amount: 19.99,
        currency: 'USD',
        plan: 'Premium Monthly',
        transactionId: 'txn_upgrade_' + Date.now(),
      });
      
      await api.sendEvent(payment);
      await this.delay(200);
      
      // Step 2: Welcome notification
      console.log('2. 🎉 Sending welcome notification...');
      const welcomeNotification = WebhookEventFactory.createNotificationEvent({
        userId: 'user_upgrade_789',
        type: 'email',
        template: 'premium_welcome',
        status: 'sent',
      });
      
      await api.sendEvent(welcomeNotification);
      
      const receivedEvents = mockReceiver.getReceivedEvents();
      console.log(`\n✅ Upgrade workflow completed! Processed ${receivedEvents.length} events.`);
      
    } finally {
      mockReceiver.stop();
    }
  }

  private static delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// ===== MAIN RUNNER =====

export class WebhookTestSuite {
  
  static async runBasicTests(): Promise<void> {
    console.log('🧪 Running Basic Webhook Tests\n');
    
    await WebhookDemos.basicWebhookDemo();
    await WebhookDemos.batchWebhookDemo();
    WebhookDemos.signatureVerificationDemo();
  }
  
  static async runAdvancedTests(): Promise<void> {
    console.log('🔬 Running Advanced Webhook Tests\n');
    
    await WebhookDemos.errorHandlingDemo();
    await WebhookDemos.performanceDemo();
  }
  
  static async runScenarios(): Promise<void> {
    console.log('🎭 Running Real-World Scenarios\n');
    
    await WebhookScenarios.dreamAnalysisWorkflow();
    await WebhookScenarios.subscriptionUpgradeWorkflow();
  }
  
  static async runFullSuite(): Promise<void> {
    console.log('🚀 Running Full Webhook Test Suite');
    console.log('===================================\n');
    
    await this.runBasicTests();
    await this.runAdvancedTests();
    await this.runScenarios();
    
    console.log('\n🎉 Full test suite completed!');
  }
}

// Auto-run if called directly
if (require.main === module) {
  WebhookTestSuite.runFullSuite().catch(console.error);
} 