Feature: Idempotency and API Stability

  Background:
    Given the API base URL is "https://jsonplaceholder.typicode.com"

  @idempotency @get
  Scenario: Validate GET is idempotent
    When I send a GET request to "/posts/1"
    Then the response status code should be 200
    And I store the entire response as "firstResponse"
    When I send a GET request to "/posts/1"
    Then the response status code should be 200
    And the response should match stored "firstResponse"

  @idempotency @consistency
  Scenario: Validate repeated calls return consistent results
    When I send a GET request to "/posts/1"
    And I send a GET request to "/posts/1"
    And I send a GET request to "/posts/1"
    Then the response status code should be 200
    And the response field "id" should be of type "number"
    And the response field "title" should be of type "string"

  @idempotency @noSideEffects
  Scenario: Validate GET has no side effects
    When I send a GET request to "/posts/1"
    Then the response status code should be 200
    And I store the response field "title" as "originalTitle"
    When I send a GET request to "/posts/1"
    Then the response status code should be 200
    And the response field "title" should equal stored value "originalTitle"

  @stability @multipleRequests
  Scenario: Validate stable response across multiple rapid requests
    When I send 5 GET requests to "/posts/1"
    Then all responses should have status code 200
    And all responses should have consistent data structure

  @stability @collectionStability
  Scenario: Validate collection endpoint stability
    When I send a GET request to "/posts?_limit=10"
    Then the response status code should be 200
    And I store the response array length as "firstCount"
    When I send a GET request to "/posts?_limit=10"
    Then the response status code should be 200
    And the response array length should equal stored value "firstCount"
