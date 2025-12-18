Feature: Authentication Testing

  # Note: JSONPlaceholder doesn't enforce authentication, but these scenarios demonstrate
  # how to test authenticated endpoints. The requests include auth headers as examples.

  @auth
  Scenario: Bearer Token Authentication
    Given the API base URL is "https://jsonplaceholder.typicode.com"
    Given I have a bearer token "test-jwt-token-12345"
    When I send a GET request to "/posts/1" with bearer authentication
    Then the response status code should be 200
    And the response should have property "id"
    And the response should have property "title"

  @auth
  Scenario: API Key in Header Authentication
    Given the API base URL is "https://jsonplaceholder.typicode.com"
    Given I have an API key "test-api-key-67890"
    When I send a GET request to "/users/1" with API key in header
    Then the response status code should be 200
    And the response should have property "id"
    And the response should have property "name"

  @auth
  Scenario: Basic Authentication
    Given the API base URL is "https://jsonplaceholder.typicode.com"
    Given I have basic auth credentials "testuser" and "testpass"
    When I send a GET request to "/posts/1" with basic authentication
    Then the response status code should be 200
    And the response should have property "id"
    And the response should have property "title"

  @auth
  Scenario: Create resource with authentication
    Given the API base URL is "https://jsonplaceholder.typicode.com"
    Given I have a bearer token "test-jwt-token-12345"
    And I have the following post data:
      | title  | Authenticated Post    |
      | body   | Post with auth token  |
      | userId | 1                     |
    When I send a POST request to "/posts" with the data and bearer authentication
    Then the response status code should be 201
    And the response should have property "id"
