import { test, expect } from '@playwright/test';

/**
 * Authentication Examples
 * Demonstrates different authentication patterns
 * Note: These are skipped by default as they use placeholder URLs
 * Remove .skip to test with your actual API endpoints
 */
test.describe.skip('Authentication Examples', () => {
  
  test('Bearer Token Authentication', async ({ request }) => {
    const token = 'your-jwt-token-here';
    
    const response = await request.get('https://api.example.com/protected', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    // Replace with your API endpoint
    // expect(response.status()).toBe(200);
  });

  test('API Key in Header', async ({ request }) => {
    const apiKey = 'your-api-key-here';
    
    const response = await request.get('https://api.example.com/data', {
      headers: {
        'X-API-Key': apiKey,
      },
    });
    
    // Replace with your API endpoint
    // expect(response.status()).toBe(200);
  });

  test('API Key in Query Parameter', async ({ request }) => {
    const apiKey = 'your-api-key-here';
    
    const response = await request.get(`https://api.example.com/data?api_key=${apiKey}`);
    
    // Replace with your API endpoint
    // expect(response.status()).toBe(200);
  });

  test('Basic Authentication', async ({ request }) => {
    const username = 'user';
    const password = 'pass';
    const credentials = Buffer.from(`${username}:${password}`).toString('base64');
    
    const response = await request.get('https://api.example.com/protected', {
      headers: {
        'Authorization': `Basic ${credentials}`,
      },
    });
    
    // Replace with your API endpoint
    // expect(response.status()).toBe(200);
  });

  test('OAuth 2.0 Token Flow (example)', async ({ request }) => {
    // Step 1: Get access token
    const tokenResponse = await request.post('https://oauth.example.com/token', {
      data: {
        grant_type: 'client_credentials',
        client_id: 'your-client-id',
        client_secret: 'your-client-secret',
      },
    });
    
    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;
    
    // Step 2: Use access token
    const apiResponse = await request.get('https://api.example.com/data', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    
    // Replace with your API endpoints
    // expect(apiResponse.status()).toBe(200);
  });

  test.skip('Custom Header Authentication', async ({ request }) => {
    const response = await request.get('https://api.example.com/data', {
      headers: {
        'X-Custom-Auth': 'custom-auth-value',
        'X-Request-ID': 'unique-request-id',
      },
    });
    
    // Replace with your API endpoint
    expect(response.status()).toBe(200);
  });
});
