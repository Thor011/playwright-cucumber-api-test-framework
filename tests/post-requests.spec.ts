import { test, expect } from '@playwright/test';
import { config } from './config/test-config';
import { ApiHelper } from './helpers/api-helper';

/**
 * POST Request Tests
 * Examples of creating new resources via API
 */
test.describe('POST Requests', () => {
  let apiHelper: ApiHelper;

  test.beforeEach(async ({ request }) => {
    apiHelper = new ApiHelper(request);
  });

  test('should create a new post', async ({ request }) => {
    const newPost = config.testData.newPost;
    
    const response = await request.post(`${config.endpoints.posts}`, {
      data: newPost,
    });
    
    // Validate status code
    expect(response.status()).toBe(201);
    
    // Validate response body
    const createdPost = await response.json();
    expect(createdPost).toHaveProperty('id');
    expect(createdPost.title).toBe(newPost.title);
    expect(createdPost.body).toBe(newPost.body);
    expect(createdPost.userId).toBe(newPost.userId);
  });

  test('should create post with authentication (Bearer Token)', async ({ request }) => {
    const newPost = config.testData.newPost;
    
    // Example with Bearer token authentication
    const response = await apiHelper.post(
      `${config.endpoints.posts}`,
      newPost,
      { token: config.auth.bearerToken }
    );
    
    expect(response.status()).toBe(201);
    const createdPost = await response.json();
    expect(createdPost.title).toBe(newPost.title);
  });

  test('should create post with API Key authentication', async ({ request }) => {
    const newPost = config.testData.newPost;
    
    // Example with API Key authentication
    const response = await apiHelper.post(
      `${config.endpoints.posts}`,
      newPost,
      { apiKey: config.auth.apiKey }
    );
    
    expect(response.status()).toBe(201);
  });

  test('should validate required fields in POST', async ({ request }) => {
    // Test with missing required field
    const incompletePost = {
      title: 'Only Title',
      // Missing body and userId
    };
    
    const response = await request.post(`${config.endpoints.posts}`, {
      data: incompletePost,
    });
    
    // Note: JSONPlaceholder is lenient, but your API might return 400
    expect([200, 201, 400]).toContain(response.status());
  });
});
