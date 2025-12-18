import { test, expect } from '@playwright/test';
import { config } from './config/test-config';
import { ApiHelper } from './helpers/api-helper';

/**
 * Data Validation Tests
 * Examples of validating response data structure and content
 */
test.describe('Data Validation', () => {
  let apiHelper: ApiHelper;

  test.beforeEach(async ({ request }) => {
    apiHelper = new ApiHelper(request);
  });

  test('should validate post data types', async ({ request }) => {
    const response = await request.get(`${config.endpoints.posts}/1`);
    const post = await response.json();
    
    // Validate data types
    expect(typeof post.id).toBe('number');
    expect(typeof post.title).toBe('string');
    expect(typeof post.body).toBe('string');
    expect(typeof post.userId).toBe('number');
  });

  test('should validate user data schema', async ({ request }) => {
    const response = await request.get(`${config.endpoints.users}/1`);
    const user = await response.json();
    
    // Validate required fields exist
    const requiredFields = ['id', 'name', 'username', 'email', 'address', 'phone', 'website', 'company'];
    await apiHelper.validateJsonSchema(user, requiredFields);
    
    // Validate nested object structure
    expect(user.address).toHaveProperty('street');
    expect(user.address).toHaveProperty('city');
    expect(user.address).toHaveProperty('zipcode');
    expect(user.address.geo).toHaveProperty('lat');
    expect(user.address.geo).toHaveProperty('lng');
  });

  test('should validate email format', async ({ request }) => {
    const response = await request.get(`${config.endpoints.users}/1`);
    const user = await response.json();
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    expect(emailRegex.test(user.email)).toBeTruthy();
  });

  test('should validate array response', async ({ request }) => {
    const response = await request.get(`${config.endpoints.posts}`);
    const posts = await response.json();
    
    // Validate array properties
    expect(Array.isArray(posts)).toBeTruthy();
    expect(posts.length).toBeGreaterThan(0);
    
    // Validate each item in array has required fields
    posts.forEach((post: any) => {
      expect(post).toHaveProperty('id');
      expect(post).toHaveProperty('title');
      expect(post).toHaveProperty('body');
      expect(post).toHaveProperty('userId');
    });
  });

  test('should validate response time', async ({ request }) => {
    const startTime = Date.now();
    
    await request.get(`${config.endpoints.posts}/1`);
    
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    // Assert response time is under 2 seconds
    expect(responseTime).toBeLessThan(2000);
  });

  test('should validate pagination', async ({ request }) => {
    // Example with query parameters
    const response = await request.get(`${config.endpoints.posts}?_limit=5`);
    const posts = await response.json();
    
    expect(posts.length).toBeLessThanOrEqual(5);
  });
});
