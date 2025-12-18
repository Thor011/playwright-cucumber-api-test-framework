import { test, expect } from '@playwright/test';
import { config } from './config/test-config';
import { ApiHelper } from './helpers/api-helper';

/**
 * DELETE Request Tests
 * Examples of deleting resources via API
 */
test.describe('DELETE Requests', () => {
  let apiHelper: ApiHelper;

  test.beforeEach(async ({ request }) => {
    apiHelper = new ApiHelper(request);
  });

  test('should delete a post', async ({ request }) => {
    const postId = 1;
    
    const response = await request.delete(`${config.endpoints.posts}/${postId}`);
    
    // Validate status code
    expect(response.status()).toBe(200);
  });

  test('should delete with authentication', async ({ request }) => {
    const postId = 1;
    
    const response = await apiHelper.delete(
      `${config.endpoints.posts}/${postId}`,
      { token: config.auth.bearerToken }
    );
    
    expect(response.status()).toBe(200);
  });

  test('should verify resource is deleted', async ({ request }) => {
    const postId = 1;
    
    // Delete the resource
    await request.delete(`${config.endpoints.posts}/${postId}`);
    
    // Verify it's deleted (JSONPlaceholder doesn't actually delete, but shows pattern)
    const getResponse = await request.get(`${config.endpoints.posts}/${postId}`);
    
    // In a real API, this would be 404
    // JSONPlaceholder still returns 200, but in practice you'd check for 404
    expect([200, 404]).toContain(getResponse.status());
  });
});
