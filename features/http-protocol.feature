Feature: HTTP Protocol and Header Validation

  Background:
    Given the API base URL is "https://jsonplaceholder.typicode.com"

  @protocol @smoke
  Scenario: Validate successful response status codes
    When I send a GET request to "/posts/1"
    Then the response status code should be 200
    When I send a POST request to "/posts" with the data:
      | title  | Test Post |
      | body   | Content   |
      | userId | 1         |
    Then the response status code should be 201

  @protocol @headers
  Scenario: Validate Content-Type header
    When I send a GET request to "/posts/1"
    Then the response status code should be 200
    And the response header "content-type" should contain "application/json"

  @protocol @headers
  Scenario: Validate response headers presence
    When I send a GET request to "/posts/1"
    Then the response status code should be 200
    And the response should have header "content-type"
    And the response should have header "cache-control"

  @protocol @errorHandling
  Scenario: Validate 404 error for non-existent resource
    When I send a GET request to "/posts/999999"
    Then the response status code should be 404

  @protocol @errorHandling
  Scenario: Validate 404 for invalid endpoint
    When I send a GET request to "/invalid-endpoint"
    Then the response status code should be 404

  @protocol @errorContract
  Scenario: Validate error response structure
    When I send a GET request to "/posts/999999"
    Then the response status code should be 404
    And the response should be valid JSON

  @protocol @statusCodes
  Scenario Outline: Validate various HTTP status codes
    When I send a GET request to "<endpoint>"
    Then the response status code should be <expectedStatus>
    
  Examples:
    | endpoint       | expectedStatus |
    | /posts/1       | 200            |
    | /users/1       | 200            |
    | /posts/999999  | 404            |
    | /users/999999  | 404            |
