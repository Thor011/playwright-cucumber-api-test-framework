Feature: API Testing with JSONPlaceholder

  Background:
    Given the API base URL is "https://jsonplaceholder.typicode.com"

  Scenario: Get all posts
    When I send a GET request to "/posts"
    Then the response status code should be 200
    And the response should be a JSON array
    And the response array should contain at least 1 item
    And each item should have property "id"
    And each item should have property "title"

  Scenario: Get a single post by ID
    When I send a GET request to "/posts/1"
    Then the response status code should be 200
    And the response should have property "id" with value 1
    And the response should have property "title"
    And the response should have property "body"
    And the response should have property "userId"

  Scenario: Get non-existent post returns 404
    When I send a GET request to "/posts/99999"
    Then the response status code should be 404

  Scenario: Create a new post
    Given I have the following post data:
      | title  | Test Post Title              |
      | body   | This is a test post content  |
      | userId | 1                            |
    When I send a POST request to "/posts" with the data
    Then the response status code should be 201
    And the response should have property "id"

  Scenario: Update an existing post
    Given I have the following update data:
      | id     | 1                      |
      | title  | Updated Post Title     |
      | body   | Updated post content   |
      | userId | 1                      |
    When I send a PUT request to "/posts/1" with the data
    Then the response status code should be 200
    And the response should have property "id" with value 1
    And the response should have property "title" with value "Updated Post Title"

  Scenario: Delete a post
    When I send a DELETE request to "/posts/1"
    Then the response status code should be 200

  Scenario: Validate user data structure
    When I send a GET request to "/users/1"
    Then the response status code should be 200
    And the response should have property "id"
    And the response should have property "name"
    And the response should have property "email"
    And the response should have property "address"
    And the response property "address" should have property "street"
    And the response property "address" should have property "city"

  Scenario: Validate response contains correct data types
    When I send a GET request to "/posts/1"
    Then the response status code should be 200
    And the response property "id" should be a number
    And the response property "title" should be a string
    And the response property "body" should be a string
    And the response property "userId" should be a number

  Scenario: Validate pagination with query parameters
    When I send a GET request to "/posts?_limit=5"
    Then the response status code should be 200
    And the response should be a JSON array
    And the response array should have at most 5 items
