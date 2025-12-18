/**
 * API Test Configuration
 * Contains base URLs, endpoints, and test data
 */

export const config = {
  // Base URLs for different environments
  baseURL: 'https://jsonplaceholder.typicode.com',
  
  // API Endpoints
  endpoints: {
    posts: '/posts',
    users: '/users',
    comments: '/comments',
    albums: '/albums',
  },
  
  // Test data
  testData: {
    newPost: {
      title: 'Test Post Title',
      body: 'This is a test post body content',
      userId: 1,
    },
    updatedPost: {
      id: 1,
      title: 'Updated Test Post',
      body: 'Updated post body content',
      userId: 1,
    },
  },
  
  // Authentication (examples for your actual API)
  auth: {
    bearerToken: 'your-bearer-token-here',
    apiKey: 'your-api-key-here',
  },
};
