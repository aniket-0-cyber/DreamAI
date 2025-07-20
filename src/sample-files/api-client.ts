/**
 * API client for dream management operations
 */

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  statusCode?: number;
}

export interface DreamData {
  id?: string;
  title: string;
  content: string;
  date: string;
  lucid: boolean;
  emotions: string[];
  clarity: number;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface SearchParams extends PaginationParams {
  query?: string;
  lucidOnly?: boolean;
  minClarity?: number;
  startDate?: string;
  endDate?: string;
}

export class ApiClient {
  private baseUrl: string;
  private apiKey?: string;

  constructor(baseUrl: string = '/api', apiKey?: string) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
    this.apiKey = apiKey;
  }

  /**
   * Generic HTTP request method
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(this.apiKey && { 'Authorization': `Bearer ${this.apiKey}` }),
      ...options.headers,
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || `HTTP ${response.status}`,
          statusCode: response.status,
        };
      }

      return {
        success: true,
        data,
        statusCode: response.status,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
        statusCode: 0,
      };
    }
  }

  /**
   * GET request
   */
  private get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  /**
   * POST request
   */
  private post<T>(endpoint: string, body: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  /**
   * PUT request
   */
  private put<T>(endpoint: string, body: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  /**
   * DELETE request
   */
  private delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  // Dream API methods

  /**
   * Get all dreams with optional pagination and search
   */
  async getDreams(params: SearchParams = {}): Promise<ApiResponse<DreamData[]>> {
    const queryParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });

    const endpoint = `/dreams${queryParams.toString() ? `?${queryParams}` : ''}`;
    return this.get<DreamData[]>(endpoint);
  }

  /**
   * Get a specific dream by ID
   */
  async getDreamById(id: string): Promise<ApiResponse<DreamData>> {
    return this.get<DreamData>(`/dreams/${id}`);
  }

  /**
   * Create a new dream
   */
  async createDream(dreamData: Omit<DreamData, 'id'>): Promise<ApiResponse<DreamData>> {
    return this.post<DreamData>('/dreams', dreamData);
  }

  /**
   * Update an existing dream
   */
  async updateDream(id: string, dreamData: Partial<DreamData>): Promise<ApiResponse<DreamData>> {
    return this.put<DreamData>(`/dreams/${id}`, dreamData);
  }

  /**
   * Delete a dream
   */
  async deleteDream(id: string): Promise<ApiResponse<void>> {
    return this.delete<void>(`/dreams/${id}`);
  }

  /**
   * Analyze a dream (AI analysis)
   */
  async analyzeDream(id: string): Promise<ApiResponse<any>> {
    return this.post<any>(`/dreams/${id}/analyze`, {});
  }

  /**
   * Get dream statistics
   */
  async getDreamStats(): Promise<ApiResponse<any>> {
    return this.get<any>('/dreams/stats');
  }

  /**
   * Search dreams with advanced filters
   */
  async searchDreams(searchTerm: string, filters: SearchParams = {}): Promise<ApiResponse<DreamData[]>> {
    return this.getDreams({ ...filters, query: searchTerm });
  }

  /**
   * Export dreams data
   */
  async exportDreams(format: 'json' | 'csv' = 'json'): Promise<ApiResponse<string>> {
    return this.get<string>(`/dreams/export?format=${format}`);
  }

  /**
   * Import dreams data
   */
  async importDreams(data: DreamData[]): Promise<ApiResponse<{ imported: number; errors: string[] }>> {
    return this.post<{ imported: number; errors: string[] }>('/dreams/import', { dreams: data });
  }
}

/**
 * Error handling utility
 */
export class ApiError extends Error {
  public statusCode: number;
  public response?: any;

  constructor(message: string, statusCode: number = 0, response?: any) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.response = response;
  }
}

/**
 * Response type guards
 */
export function isSuccessResponse<T>(response: ApiResponse<T>): response is ApiResponse<T> & { success: true; data: T } {
  return response.success && response.data !== undefined;
}

export function isErrorResponse<T>(response: ApiResponse<T>): response is ApiResponse<T> & { success: false; error: string } {
  return !response.success && response.error !== undefined;
}

/**
 * Retry wrapper for API calls
 */
export async function withRetry<T>(
  operation: () => Promise<ApiResponse<T>>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<ApiResponse<T>> {
  let lastError: ApiResponse<T>;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const result = await operation();
      
      if (result.success || (result.statusCode && result.statusCode < 500)) {
        return result;
      }
      
      lastError = result;
    } catch (error) {
      lastError = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        statusCode: 0,
      };
    }

    if (attempt < maxRetries) {
      await new Promise(resolve => setTimeout(resolve, delay * attempt));
    }
  }

  return lastError!;
}

/**
 * Create a configured API client instance
 */
export function createApiClient(config: { baseUrl?: string; apiKey?: string } = {}): ApiClient {
  return new ApiClient(config.baseUrl, config.apiKey);
}

// Default export for convenience
export default ApiClient; 