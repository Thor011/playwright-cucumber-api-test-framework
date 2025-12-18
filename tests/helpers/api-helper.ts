import { APIRequestContext, expect } from '@playwright/test';

/**
 * Helper class for common API test operations
 */
export class ApiHelper {
  constructor(private request: APIRequestContext) {}

  /**
   * Validates that response has expected status code
   */
  async validateStatusCode(response: any, expectedStatus: number) {
    expect(response.status()).toBe(expectedStatus);
  }

  /**
   * Validates response headers contain expected values
   */
  async validateHeaders(response: any, expectedHeaders: Record<string, string>) {
    const headers = response.headers();
    for (const [key, value] of Object.entries(expectedHeaders)) {
      expect(headers[key.toLowerCase()]).toContain(value);
    }
  }

  /**
   * Validates response body matches expected schema
   */
  async validateJsonSchema(data: any, requiredFields: string[]) {
    for (const field of requiredFields) {
      expect(data).toHaveProperty(field);
    }
  }

  /**
   * Makes a GET request with optional auth
   */
  async get(url: string, options?: { token?: string; apiKey?: string }) {
    const headers: Record<string, string> = {};
    
    if (options?.token) {
      headers['Authorization'] = `Bearer ${options.token}`;
    }
    
    if (options?.apiKey) {
      headers['X-API-Key'] = options.apiKey;
    }

    return await this.request.get(url, { headers });
  }

  /**
   * Makes a POST request with optional auth
   */
  async post(url: string, data: any, options?: { token?: string; apiKey?: string }) {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (options?.token) {
      headers['Authorization'] = `Bearer ${options.token}`;
    }
    
    if (options?.apiKey) {
      headers['X-API-Key'] = options.apiKey;
    }

    return await this.request.post(url, { 
      data,
      headers 
    });
  }

  /**
   * Makes a PUT request with optional auth
   */
  async put(url: string, data: any, options?: { token?: string; apiKey?: string }) {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (options?.token) {
      headers['Authorization'] = `Bearer ${options.token}`;
    }
    
    if (options?.apiKey) {
      headers['X-API-Key'] = options.apiKey;
    }

    return await this.request.put(url, { 
      data,
      headers 
    });
  }

  /**
   * Makes a DELETE request with optional auth
   */
  async delete(url: string, options?: { token?: string; apiKey?: string }) {
    const headers: Record<string, string> = {};
    
    if (options?.token) {
      headers['Authorization'] = `Bearer ${options.token}`;
    }
    
    if (options?.apiKey) {
      headers['X-API-Key'] = options.apiKey;
    }

    return await this.request.delete(url, { headers });
  }
}
