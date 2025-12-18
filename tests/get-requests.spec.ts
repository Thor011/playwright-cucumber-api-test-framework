import { test, expect } from '@playwright/test';
import { config } from './config/test-config';
import { ApiHelper } from './helpers/api-helper';

/**
 * GET Request Tests
 * Examples of fetching data from API endpoints
 */
test.describe('GET Requests', () => {
  let apiHelper: ApiHelper;

  test.beforeEach(async ({ request }) => {
    apiHelper = new ApiHelper(request);
  });

  test('should get all posts', async ({ request }) => {
    const response = await request.get(`${config.endpoints.posts}`);
    
    // Validate status code
    expect(response.status()).toBe(200);
    
    // Validate response body
    const posts = await response.json();
    expect(Array.isArray(posts)).toBeTruthy();
    expect(posts.length).toBeGreaterThan(0);
    
    // Validate first post structure
    expect(posts[0]).toHaveProperty('id');
    expect(posts[0]).toHaveProperty('title');
    expect(posts[0]).toHaveProperty('body');
    expect(posts[0]).toHaveProperty('userId');
  });

  test('should get single post by id', async ({ request }) => {
    const postId = 1;
    const response = await request.get(`${config.endpoints.posts}/${postId}`);
    
    expect(response.status()).toBe(200);
    
    const post = await response.json();
    expect(post.id).toBe(postId);
    expect(post).toHaveProperty('title');
    expect(post).toHaveProperty('body');
  });

  test('should get 404 for non-existent post', async ({ request }) => {
    const response = await request.get(`${config.endpoints.posts}/99999`);
    expect(response.status()).toBe(404);
  });

  test('should validate response headers', async ({ request }) => {
    const response = await request.get(`${config.endpoints.posts}/1`);
    
    // Validate content-type header
    const headers = response.headers();
    expect(headers['content-type']).toContain('application/json');
  });
});
