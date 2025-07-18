// Webhook payload interfaces
export interface WebhookPayload {
  id: string;
  event: string;
  timestamp: string;
  data: Record<string, any>;
  source: string;
  signature?: string;
}

export interface DreamWebhookPayload extends WebhookPayload {
  event: 'dream.created' | 'dream.interpreted' | 'dream.shared';
  data: {
    dreamId: string;
    userId: string;
    title: string;
    content: string;
    interpretation?: string;
    tags?: string[];
    isPublic?: boolean;
  };
}

export interface UserWebhookPayload extends WebhookPayload {
  event: 'user.created' | 'user.updated' | 'user.deleted';
  data: {
    userId: string;
    email: string;
    username: string;
    profile?: {
      firstName?: string;
      lastName?: string;
      avatar?: string;
    };
  };
}

// Webhook response types
export interface WebhookResponse {
  success: boolean;
  message?: string;
  timestamp: string;
  processingTime: number;
}

export interface WebhookError {
  error: string;
  code: number;
  details?: Record<string, any>;
  timestamp: string;
}

// Webhook configuration
export interface WebhookConfig {
  url: string;
  secret: string;
  events: string[];
  active: boolean;
  retryAttempts: number;
  timeout: number;
  headers?: Record<string, string>;
}

// Webhook delivery attempt
export interface WebhookDelivery {
  id: string;
  webhookId: string;
  payload: WebhookPayload;
  response?: WebhookResponse;
  error?: WebhookError;
  attempts: number;
  status: 'pending' | 'success' | 'failed' | 'retrying';
  createdAt: string;
  deliveredAt?: string;
} 