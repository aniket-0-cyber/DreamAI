import { 
  WebhookSimulator, 
  MockWebhookReceiver, 
  TestDataGenerator, 
  WebhookPayload 
} from './webhook-simulator';

// Scenario runner for webhook testing
export class WebhookScenarios {

  // Scenario 1: Dream submission and analysis flow
  static async dreamAnalysisFlow() {
    console.log('🌙 Scenario: Dream Analysis Flow');
    console.log('================================');

    const simulator = new WebhookSimulator();
    const receiver = new MockWebhookReceiver();

    // Generate test data
    const dreamData = TestDataGenerator.randomDream();
    const userData = TestDataGenerator.randomUser();

    console.log(`👤 User: ${userData.email}`);
    console.log(`💭 Dream: ${dreamData.content.substring(0, 50)}...`);

    // Step 1: User submits dream
    const dreamSubmission = simulator.dreamSubmitted(
      'dream_001', 
      userData.userId, 
      dreamData.content
    );

    console.log('\n1. 📝 Dream submitted');
    console.log(`   Event ID: ${dreamSubmission.id}`);
    console.log(`   Content length: ${dreamSubmission.data.metadata.length} chars`);

    const response1 = receiver.receive(dreamSubmission);
    console.log(`   Response: ${response1.status} - ${response1.body.received ? 'Received' : 'Failed'}`);

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 200));

    // Step 2: AI analyzes dream
    const dreamAnalysis = simulator.dreamAnalyzed(
      'dream_001',
      userData.userId,
      'This dream represents freedom and the desire to escape limitations.',
      dreamData.symbols
    );

    console.log('\n2. 🤖 Dream analyzed');
    console.log(`   Confidence: ${(dreamAnalysis.data.confidence * 100).toFixed(1)}%`);
    console.log(`   Symbols: ${dreamAnalysis.data.symbols.join(', ')}`);
    console.log(`   Processing time: ${dreamAnalysis.data.processingTime}ms`);

    const response2 = receiver.receive(dreamAnalysis);
    console.log(`   Response: ${response2.status} - Analysis processed`);

    console.log(`\n✅ Flow completed! Total events: ${receiver.getStats().total}`);
  }

  // Scenario 2: User onboarding journey
  static async userOnboardingJourney() {
    console.log('\n👤 Scenario: User Onboarding Journey');
    console.log('====================================');

    const simulator = new WebhookSimulator();
    const receiver = new MockWebhookReceiver();

    const userData = TestDataGenerator.randomUser();
    const subscription = TestDataGenerator.randomSubscription();

    console.log(`📧 New user: ${userData.email}`);

    // Step 1: User creates account
    const userCreation = simulator.userCreated(userData.userId, userData.email);
    
    console.log('\n1. 📝 Account created');
    console.log(`   User ID: ${userCreation.data.userId}`);
    console.log(`   Plan: ${userCreation.data.plan}`);
    console.log(`   Notifications: ${userCreation.data.profile.preferences.notifications ? 'Enabled' : 'Disabled'}`);

    receiver.receive(userCreation);

    await new Promise(resolve => setTimeout(resolve, 150));

    // Step 2: User upgrades subscription
    const subscriptionUpgrade = simulator.subscriptionActivated(
      userData.userId,
      subscription.name,
      subscription.amount
    );

    console.log('\n2. 💳 Subscription activated');
    console.log(`   Plan: ${subscriptionUpgrade.data.plan}`);
    console.log(`   Amount: $${subscriptionUpgrade.data.amount}`);
    console.log(`   Billing: ${subscriptionUpgrade.data.billingCycle}`);
    console.log(`   Next billing: ${new Date(subscriptionUpgrade.data.nextBilling).toLocaleDateString()}`);

    receiver.receive(subscriptionUpgrade);

    const stats = receiver.getStats();
    console.log(`\n✅ Onboarding completed! Events processed: ${stats.total}`);
    console.log(`   By type: ${JSON.stringify(stats.byEvent, null, 2)}`);
  }

  // Scenario 3: AI processing workflow
  static async aiProcessingWorkflow() {
    console.log('\n🤖 Scenario: AI Processing Workflow');
    console.log('===================================');

    const simulator = new WebhookSimulator();
    const receiver = new MockWebhookReceiver();

    const taskId = `task_${Date.now()}`;
    console.log(`🔄 Processing task: ${taskId}`);

    // Step 1: Processing started
    const started = simulator.aiProcessing(taskId, 'started');
    console.log('\n1. ▶️  Processing started');
    console.log(`   Estimated completion: ${new Date(started.data.estimatedCompletion).toLocaleTimeString()}`);
    receiver.receive(started);

    await new Promise(resolve => setTimeout(resolve, 100));

    // Step 2: Progress updates
    for (let i = 0; i < 3; i++) {
      const progress = simulator.aiProcessing(taskId, 'progress');
      console.log(`\n2.${i+1} 📊 Progress update: ${progress.data.progress}%`);
      receiver.receive(progress);
      await new Promise(resolve => setTimeout(resolve, 80));
    }

    // Step 3: Processing completed
    const completed = simulator.aiProcessing(taskId, 'completed');
    console.log('\n3. ✅ Processing completed');
    console.log(`   Final status: ${completed.data.status}`);
    receiver.receive(completed);

    console.log(`\n🎉 AI workflow finished! Total updates: ${receiver.getStats().total}`);
  }

  // Scenario 4: Batch webhook simulation
  static async batchWebhookSimulation() {
    console.log('\n📦 Scenario: Batch Webhook Simulation');
    console.log('=====================================');

    const simulator = new WebhookSimulator();
    const receiver = new MockWebhookReceiver();

    // Generate multiple webhooks
    const webhooks: WebhookPayload[] = [];

    // Add dream submissions
    for (let i = 0; i < 3; i++) {
      const dream = TestDataGenerator.randomDream();
      const user = TestDataGenerator.randomUser();
      webhooks.push(simulator.dreamSubmitted(`dream_${i}`, user.userId, dream.content));
    }

    // Add user registrations
    for (let i = 0; i < 2; i++) {
      const user = TestDataGenerator.randomUser();
      webhooks.push(simulator.userCreated(user.userId, user.email));
    }

    // Add subscription activations
    const sub = TestDataGenerator.randomSubscription();
    const user = TestDataGenerator.randomUser();
    webhooks.push(simulator.subscriptionActivated(user.userId, sub.name, sub.amount));

    console.log(`📤 Processing ${webhooks.length} webhooks...`);

    // Process all webhooks
    const startTime = Date.now();
    webhooks.forEach((webhook, index) => {
      const response = receiver.receive(webhook);
      console.log(`   ${index + 1}. ${webhook.event} - ${response.status === 200 ? '✅' : '❌'}`);
    });

    const processingTime = Date.now() - startTime;
    const stats = receiver.getStats();

    console.log(`\n📊 Batch Results:`);
    console.log(`   Total processed: ${stats.total}`);
    console.log(`   Processing time: ${processingTime}ms`);
    console.log(`   Events by type:`);
    Object.entries(stats.byEvent).forEach(([event, count]) => {
      console.log(`     - ${event}: ${count}`);
    });
  }

  // Scenario 5: Webhook validation and security
  static webhookValidationTest() {
    console.log('\n🔐 Scenario: Webhook Validation & Security');
    console.log('==========================================');

    const simulator = new WebhookSimulator('secure_secret_key_123');
    const dreamData = TestDataGenerator.randomDream();
    const userData = TestDataGenerator.randomUser();

    // Generate signed webhook
    const webhook = simulator.dreamSubmitted('dream_secure', userData.userId, dreamData.content);
    const payloadString = JSON.stringify(webhook);

    console.log('🔧 Security Test Setup:');
    console.log(`   Event: ${webhook.event}`);
    console.log(`   Signature: ${webhook.signature?.substring(0, 16)}...`);

    // Test 1: Valid signature
    const isValid = WebhookSimulator.verify(payloadString, webhook.signature!, 'secure_secret_key_123');
    console.log(`\n1. ✅ Valid signature test: ${isValid ? 'PASSED' : 'FAILED'}`);

    // Test 2: Invalid signature
    const isInvalid = WebhookSimulator.verify(payloadString, 'fake_signature', 'secure_secret_key_123');
    console.log(`2. ❌ Invalid signature test: ${!isInvalid ? 'PASSED' : 'FAILED'}`);

    // Test 3: Wrong secret
    const wrongSecret = WebhookSimulator.verify(payloadString, webhook.signature!, 'wrong_secret');
    console.log(`3. 🔑 Wrong secret test: ${!wrongSecret ? 'PASSED' : 'FAILED'}`);

    // Test 4: Timestamp validation (simulate old webhook)
    const oldWebhook = { ...webhook };
    oldWebhook.timestamp = new Date(Date.now() - 10 * 60 * 1000).toISOString(); // 10 minutes ago
    const timeDiff = Date.now() - new Date(oldWebhook.timestamp).getTime();
    const isExpired = timeDiff > 5 * 60 * 1000; // 5 minute threshold
    console.log(`4. ⏰ Timestamp validation: ${isExpired ? 'EXPIRED (correct)' : 'VALID'}`);

    console.log('\n🛡️  Security validation completed!');
  }

  // Run all scenarios
  static async runAll() {
    console.log('🚀 Running All Webhook Scenarios');
    console.log('=================================\n');

    try {
      await this.dreamAnalysisFlow();
      await this.userOnboardingJourney();
      await this.aiProcessingWorkflow();
      await this.batchWebhookSimulation();
      this.webhookValidationTest();
      
      console.log('\n🎉 All scenarios completed successfully!');
      
    } catch (error) {
      console.error('\n💥 Scenario failed:', error);
    }
  }
}

// Quick test utilities
export class QuickTests {
  
  static async performanceTest() {
    console.log('\n⚡ Quick Performance Test');
    console.log('=========================');

    const simulator = new WebhookSimulator();
    const receiver = new MockWebhookReceiver();

    const startTime = Date.now();
    const webhookCount = 100;

    // Generate and process webhooks rapidly
    for (let i = 0; i < webhookCount; i++) {
      const dream = TestDataGenerator.randomDream();
      const user = TestDataGenerator.randomUser();
      const webhook = simulator.dreamSubmitted(`perf_dream_${i}`, user.userId, dream.content);
      receiver.receive(webhook);
    }

    const processingTime = Date.now() - startTime;
    const rate = (webhookCount / processingTime * 1000).toFixed(0);

    console.log(`📊 Performance Results:`);
    console.log(`   Webhooks processed: ${webhookCount}`);
    console.log(`   Total time: ${processingTime}ms`);
    console.log(`   Processing rate: ${rate} webhooks/second`);
    console.log(`   Average per webhook: ${(processingTime / webhookCount).toFixed(2)}ms`);
  }

  static dataVariationTest() {
    console.log('\n🎲 Data Variation Test');
    console.log('======================');

    const simulator = new WebhookSimulator();

    console.log('🧪 Generating sample data variations:');

    // Test different dream types
    for (let i = 0; i < 3; i++) {
      const dream = TestDataGenerator.randomDream();
      const user = TestDataGenerator.randomUser();
      const webhook = simulator.dreamSubmitted(`var_dream_${i}`, user.userId, dream.content);
      
      console.log(`   Dream ${i + 1}: ${dream.symbols.join(', ')} (${webhook.data.metadata.length} chars)`);
    }

    // Test different subscription types
    for (let i = 0; i < 2; i++) {
      const sub = TestDataGenerator.randomSubscription();
      const user = TestDataGenerator.randomUser();
      const webhook = simulator.subscriptionActivated(user.userId, sub.name, sub.amount);
      
      console.log(`   Subscription ${i + 1}: ${sub.name} - $${sub.amount} (${webhook.data.billingCycle})`);
    }

    console.log('✅ Data variation test completed!');
  }

  static async runQuickTests() {
    console.log('\n🏃 Running Quick Tests');
    console.log('======================');

    await this.performanceTest();
    this.dataVariationTest();

    console.log('\n⚡ Quick tests completed!');
  }
}

// Auto-run scenarios if called directly
if (require.main === module) {
  (async () => {
    await WebhookScenarios.runAll();
    console.log('\n' + '='.repeat(50));
    await QuickTests.runQuickTests();
  })().catch(console.error);
} 