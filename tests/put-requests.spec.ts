import { test, expect } from '@playwright/test';
import { config } from './config/test-config';
import { ApiHelper } from './helpers/api-helper';

/**
 * PUT Request Tests
 * Examples of updating existing resources
 */
test.describe('PUT Requests', () => {
  let apiHelper: ApiHelper;

  test.beforeEach(async ({ request }) => {
    apiHelper = new ApiHelper(request);
  });

  test('should update an existing post', async ({ request }) => {
    const postId = 1;
    const updatedData = config.testData.updatedPost;
    
    const response = await request.put(`${config.endpoints.posts}/${postId}`, {
      data: updatedData,
    });
    
    // Validate status code
    expect(response.status()).toBe(200);
    
    // Validate response body
    const updatedPost = await response.json();
    expect(updatedPost.id).toBe(postId);
    expect(updatedPost.title).toBe(updatedData.title);
    expect(updatedPost.body).toBe(updatedData.body);
  });

  test('should update post with authentication', async ({ request }) => {
    const postId = 1;
    const updatedData = config.testData.updatedPost;
    
    const response = await apiHelper.put(
      `${config.endpoints.posts}/${postId}`,
      updatedData,
      { token: config.auth.bearerToken }
    );
    
    expect(response.status()).toBe(200);
  });

  test('should partially update a post (PATCH behavior)', async ({ request }) => {
    const postId = 1;
    const partialUpdate = {
      title: 'Only Update Title',
    };
    
    // Using PUT for partial update (or use PATCH method if supported)
    const response = await request.put(`${config.endpoints.posts}/${postId}`, {
      data: partialUpdate,
    });
    
    expect(response.status()).toBe(200);
    const updatedPost = await response.json();
    expect(updatedPost.title).toBe(partialUpdate.title);
  });
});
