// API Integration Examples for DreamAI Application
// This file demonstrates API calls and external service integrations

import { 
  Dream, 
  DreamInterpretation, 
  ApiResponse, 
  DreamAnalysisRequest,
  DreamVisualizationData,
  UserProfile,
  InterpretationStyle
} from './dream-types';

// Base API configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://api.dreamai.com';
const API_KEY = process.env.REACT_APP_API_KEY || 'demo-key';

// API Error class
export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

// Base fetch wrapper with error handling
async function apiRequest<T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new ApiError(response.status, data.error || 'API request failed');
    }

    return {
      success: true,
      data: data,
      timestamp: new Date(),
    };
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      timestamp: new Date(),
    };
  }
}

// Dream Analysis API
export class DreamAnalysisAPI {
  /**
   * Analyzes a dream and returns interpretation
   */
  static async analyzeDream(request: DreamAnalysisRequest): Promise<ApiResponse<DreamInterpretation>> {
    return apiRequest<DreamInterpretation>('/analyze/dream', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  /**
   * Gets dream interpretation by ID
   */
  static async getInterpretation(interpretationId: string): Promise<ApiResponse<DreamInterpretation>> {
    return apiRequest<DreamInterpretation>(`/interpretations/${interpretationId}`);
  }

  /**
   * Updates interpretation with user feedback
   */
  static async updateInterpretation(
    interpretationId: string, 
    feedback: { helpful: boolean; notes?: string }
  ): Promise<ApiResponse<void>> {
    return apiRequest<void>(`/interpretations/${interpretationId}/feedback`, {
      method: 'PATCH',
      body: JSON.stringify(feedback),
    });
  }

  /**
   * Generates dream visualization
   */
  static async generateVisualization(dreamId: string): Promise<ApiResponse<DreamVisualizationData>> {
    return apiRequest<DreamVisualizationData>(`/dreams/${dreamId}/visualize`, {
      method: 'POST',
    });
  }

  /**
   * Gets interpretation history for a user
   */
  static async getInterpretationHistory(
    userId: string, 
    page: number = 1, 
    limit: number = 10
  ): Promise<ApiResponse<{ interpretations: DreamInterpretation[]; total: number }>> {
    return apiRequest<{ interpretations: DreamInterpretation[]; total: number }>(
      `/users/${userId}/interpretations?page=${page}&limit=${limit}`
    );
  }

  /**
   * Gets trending dream symbols
   */
  static async getTrendingSymbols(): Promise<ApiResponse<Array<{ symbol: string; frequency: number }>>> {
    return apiRequest<Array<{ symbol: string; frequency: number }>>('/symbols/trending');
  }
}

// Dream Management API
export class DreamAPI {
  /**
   * Creates a new dream entry
   */
  static async createDream(dream: Omit<Dream, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Dream>> {
    return apiRequest<Dream>('/dreams', {
      method: 'POST',
      body: JSON.stringify(dream),
    });
  }

  /**
   * Gets dreams for a user
   */
  static async getUserDreams(
    userId: string, 
    page: number = 1, 
    limit: number = 10
  ): Promise<ApiResponse<{ dreams: Dream[]; total: number }>> {
    return apiRequest<{ dreams: Dream[]; total: number }>(
      `/users/${userId}/dreams?page=${page}&limit=${limit}`
    );
  }

  /**
   * Updates an existing dream
   */
  static async updateDream(dreamId: string, updates: Partial<Dream>): Promise<ApiResponse<Dream>> {
    return apiRequest<Dream>(`/dreams/${dreamId}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  /**
   * Deletes a dream
   */
  static async deleteDream(dreamId: string): Promise<ApiResponse<void>> {
    return apiRequest<void>(`/dreams/${dreamId}`, {
      method: 'DELETE',
    });
  }

  /**
   * Gets public dreams with filters
   */
  static async getPublicDreams(filters: {
    tags?: string[];
    emotions?: string[];
    symbols?: string[];
    dateFrom?: Date;
    dateTo?: Date;
    page?: number;
    limit?: number;
  } = {}): Promise<ApiResponse<{ dreams: Dream[]; total: number }>> {
    const params = new URLSearchParams();
    
    if (filters.tags) params.append('tags', filters.tags.join(','));
    if (filters.emotions) params.append('emotions', filters.emotions.join(','));
    if (filters.symbols) params.append('symbols', filters.symbols.join(','));
    if (filters.dateFrom) params.append('dateFrom', filters.dateFrom.toISOString());
    if (filters.dateTo) params.append('dateTo', filters.dateTo.toISOString());
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());

    return apiRequest<{ dreams: Dream[]; total: number }>(
      `/dreams/public?${params.toString()}`
    );
  }

  /**
   * Searches dreams by text
   */
  static async searchDreams(
    query: string, 
    userId?: string
  ): Promise<ApiResponse<{ dreams: Dream[]; total: number }>> {
    const params = new URLSearchParams({ q: query });
    if (userId) params.append('userId', userId);

    return apiRequest<{ dreams: Dream[]; total: number }>(
      `/dreams/search?${params.toString()}`
    );
  }
}

// User Profile API
export class UserAPI {
  /**
   * Gets user profile
   */
  static async getProfile(userId: string): Promise<ApiResponse<UserProfile>> {
    return apiRequest<UserProfile>(`/users/${userId}/profile`);
  }

  /**
   * Updates user profile
   */
  static async updateProfile(userId: string, updates: Partial<UserProfile>): Promise<ApiResponse<UserProfile>> {
    return apiRequest<UserProfile>(`/users/${userId}/profile`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  /**
   * Gets user dream statistics
   */
  static async getDreamStatistics(userId: string): Promise<ApiResponse<{
    totalDreams: number;
    lucidDreams: number;
    averageEmotionalIntensity: number;
    mostCommonSymbols: Array<{ symbol: string; count: number }>;
    emotionalTrends: Array<{ emotion: string; count: number }>;
    monthlyActivity: Array<{ month: string; count: number }>;
  }>> {
    return apiRequest(`/users/${userId}/statistics`);
  }

  /**
   * Updates user preferences
   */
  static async updatePreferences(
    userId: string, 
    preferences: Partial<UserProfile['preferences']>
  ): Promise<ApiResponse<UserProfile['preferences']>> {
    return apiRequest<UserProfile['preferences']>(`/users/${userId}/preferences`, {
      method: 'PATCH',
      body: JSON.stringify(preferences),
    });
  }
}

// Email Notification API (for the landing page form)
export class NotificationAPI {
  /**
   * Subscribes user to early access notifications
   */
  static async subscribeToEarlyAccess(email: string): Promise<ApiResponse<void>> {
    return apiRequest<void>('/notifications/early-access', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  /**
   * Sends dream interpretation via email
   */
  static async emailInterpretation(
    email: string, 
    interpretationId: string
  ): Promise<ApiResponse<void>> {
    return apiRequest<void>('/notifications/email-interpretation', {
      method: 'POST',
      body: JSON.stringify({ email, interpretationId }),
    });
  }

  /**
   * Updates notification preferences
   */
  static async updateNotificationPreferences(
    userId: string,
    preferences: {
      dreamReminders: boolean;
      weeklyInsights: boolean;
      communityUpdates: boolean;
      interpretationComplete: boolean;
    }
  ): Promise<ApiResponse<void>> {
    return apiRequest<void>(`/notifications/preferences/${userId}`, {
      method: 'PATCH',
      body: JSON.stringify(preferences),
    });
  }
}

// AI Image Generation API (for dream visualizations)
export class ImageGenerationAPI {
  /**
   * Generates an image from a dream description
   */
  static async generateDreamImage(
    dreamDescription: string,
    style: 'realistic' | 'artistic' | 'surreal' | 'abstract' = 'surreal'
  ): Promise<ApiResponse<{ imageUrl: string; prompt: string }>> {
    return apiRequest<{ imageUrl: string; prompt: string }>('/ai/generate-image', {
      method: 'POST',
      body: JSON.stringify({
        description: dreamDescription,
        style,
        size: '1024x1024',
        quality: 'high'
      }),
    });
  }

  /**
   * Gets image generation history
   */
  static async getGenerationHistory(userId: string): Promise<ApiResponse<Array<{
    id: string;
    dreamId: string;
    imageUrl: string;
    prompt: string;
    style: string;
    createdAt: Date;
  }>>> {
    return apiRequest(`/users/${userId}/generated-images`);
  }

  /**
   * Regenerates an image with different parameters
   */
  static async regenerateImage(
    dreamId: string,
    style: string
  ): Promise<ApiResponse<{ imageUrl: string; prompt: string }>> {
    return apiRequest<{ imageUrl: string; prompt: string }>(`/dreams/${dreamId}/regenerate-image`, {
      method: 'POST',
      body: JSON.stringify({ style }),
    });
  }
}

// Community API (for sharing dreams and interpretations)
export class CommunityAPI {
  /**
   * Gets community feed of public dreams
   */
  static async getCommunityFeed(
    page: number = 1,
    limit: number = 10
  ): Promise<ApiResponse<{ dreams: Dream[]; total: number }>> {
    return apiRequest<{ dreams: Dream[]; total: number }>(
      `/community/feed?page=${page}&limit=${limit}`
    );
  }

  /**
   * Likes a public dream
   */
  static async likeDream(dreamId: string, userId: string): Promise<ApiResponse<void>> {
    return apiRequest<void>(`/community/dreams/${dreamId}/like`, {
      method: 'POST',
      body: JSON.stringify({ userId }),
    });
  }

  /**
   * Comments on a public dream
   */
  static async commentOnDream(
    dreamId: string, 
    userId: string, 
    comment: string
  ): Promise<ApiResponse<{ id: string; comment: string; userId: string; createdAt: Date }>> {
    return apiRequest(`/community/dreams/${dreamId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ userId, comment }),
    });
  }

  /**
   * Reports inappropriate content
   */
  static async reportContent(
    contentId: string,
    contentType: 'dream' | 'comment',
    reason: string
  ): Promise<ApiResponse<void>> {
    return apiRequest<void>('/community/report', {
      method: 'POST',
      body: JSON.stringify({ contentId, contentType, reason }),
    });
  }

  /**
   * Gets trending dreams
   */
  static async getTrendingDreams(): Promise<ApiResponse<Dream[]>> {
    return apiRequest<Dream[]>('/community/trending');
  }
}

// Utility functions for common API operations
export class APIUtils {
  /**
   * Handles file upload (for dream images/recordings)
   */
  static async uploadFile(file: File, dreamId: string): Promise<ApiResponse<{ fileUrl: string }>> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('dreamId', dreamId);

    return fetch(`${API_BASE_URL}/uploads`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: formData,
    }).then(async response => {
      const data = await response.json();
      if (!response.ok) {
        throw new ApiError(response.status, data.error || 'Upload failed');
      }
      return {
        success: true,
        data: data,
        timestamp: new Date(),
      };
    }).catch(error => ({
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed',
      timestamp: new Date(),
    }));
  }

  /**
   * Batch processes multiple dreams for analysis
   */
  static async batchAnalyzeDreams(
    dreams: Array<{ id: string; description: string }>,
    analysisType: InterpretationStyle
  ): Promise<ApiResponse<Array<{ dreamId: string; interpretation: DreamInterpretation }>>> {
    return apiRequest(`/analyze/batch`, {
      method: 'POST',
      body: JSON.stringify({
        dreams,
        analysisType,
      }),
    });
  }

  /**
   * Health check for API availability
   */
  static async healthCheck(): Promise<ApiResponse<{ status: string; version: string }>> {
    return apiRequest<{ status: string; version: string }>('/health');
  }

  /**
   * Gets API usage statistics for a user
   */
  static async getUsageStats(userId: string): Promise<ApiResponse<{
    apiCallsThisMonth: number;
    analysesRemaining: number;
    subscriptionTier: string;
    lastActivity: Date;
  }>> {
    return apiRequest(`/users/${userId}/usage`);
  }
}

// Error handling utility
export function handleApiError(error: unknown): string {
  if (error instanceof ApiError) {
    switch (error.status) {
      case 401:
        return 'Please log in to continue';
      case 403:
        return 'You don\'t have permission to perform this action';
      case 404:
        return 'The requested item was not found';
      case 429:
        return 'You\'ve made too many requests. Please try again later';
      case 500:
        return 'Server error. Please try again later';
      default:
        return error.message || 'An unexpected error occurred';
    }
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return 'An unknown error occurred';
}

// Example usage with React hooks
export function useApiCall<T>(apiCall: () => Promise<ApiResponse<T>>) {
  const [data, setData] = React.useState<T | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const execute = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiCall();
      if (response.success && response.data) {
        setData(response.data);
      } else {
        setError(response.error || 'Request failed');
      }
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  }, [apiCall]);

  return { data, loading, error, execute };
}

// Import React for the hook
import React from 'react'; 