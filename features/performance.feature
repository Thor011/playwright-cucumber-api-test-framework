Feature: Performance and Reliability

  Background:
    Given the API base URL is "https://jsonplaceholder.typicode.com"

  @performance @responseTime
  Scenario: Validate response time is acceptable
    When I send a GET request to "/posts/1"
    Then the response status code should be 200
    And the response time should be less than 2000 ms

  @performance @collection
  Scenario: Validate collection endpoint response time
    When I send a GET request to "/posts?_limit=50"
    Then the response status code should be 200
    And the response time should be less than 3000 ms

  @performance @payloadSize
  Scenario: Validate reasonable payload size for single resource
    When I send a GET request to "/posts/1"
    Then the response status code should be 200
    And the response payload size should be less than 10 KB

  @performance @collectionSize
  Scenario: Validate collection respects size limits
    When I send a GET request to "/posts?_limit=100"
    Then the response status code should be 200
    And the response array should have at most 100 items

  @reliability @consistency
  Scenario: Validate consistent response structure over time
    When I send a GET request to "/posts/1"
    Then the response status code should be 200
    And the response should have required fields:
      | id     |
      | title  |
      | body   |
      | userId |

  @reliability @errorHandling
  Scenario: Validate graceful error handling
    When I send a GET request to "/posts/invalid-id"
    Then the response status code should be 404
    And the response should be valid JSON

  @performance @baseline
  Scenario: Establish performance baseline
    When I send a GET request to "/posts/1"
    Then the response status code should be 200
    And I measure the response time as "baseline"
    When I send a GET request to "/posts/1"
    Then the response time should be within 200% of "baseline"
