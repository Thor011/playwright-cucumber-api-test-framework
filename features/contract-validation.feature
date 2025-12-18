Feature: Contract and Schema Validation for External Data

  Background:
    Given the API base URL is "https://jsonplaceholder.typicode.com"

  @contract @smoke
  Scenario: Validate post response contract
    When I send a GET request to "/posts/1"
    Then the response status code should be 200
    And the response should have required fields:
      | id     |
      | title  |
      | body   |
      | userId |
    And the response field "id" should be of type "number"
    And the response field "title" should be of type "string"
    And the response field "body" should be of type "string"
    And the response field "userId" should be of type "number"

  @contract
  Scenario: Validate user response contract
    When I send a GET request to "/users/1"
    Then the response status code should be 200
    And the response should have required fields:
      | id       |
      | name     |
      | username |
      | email    |
      | address  |
      | phone    |
      | website  |
      | company  |
    And the response field "id" should be of type "number"
    And the response field "name" should be of type "string"
    And the response field "email" should be of type "string"

  @contract @nested
  Scenario: Validate nested object structure in user response
    When I send a GET request to "/users/1"
    Then the response status code should be 200
    And the response nested field "address.street" should exist
    And the response nested field "address.city" should exist
    And the response nested field "address.zipcode" should exist
    And the response nested field "address.geo.lat" should exist
    And the response nested field "address.geo.lng" should exist
    And the response nested field "company.name" should exist

  @contract @collection
  Scenario: Validate collection response structure
    When I send a GET request to "/posts"
    Then the response status code should be 200
    And the response should be an array
    And the response array should not be empty
    And each array item should have required fields:
      | id     |
      | title  |
      | body   |
      | userId |

  @schema @format
  Scenario: Validate email format in user data
    When I send a GET request to "/users/1"
    Then the response status code should be 200
    And the response field "email" should match email format
    And the response field "website" should be a non-empty string

  @schema @positive
  Scenario: Validate positive numeric values
    When I send a GET request to "/posts/1"
    Then the response status code should be 200
    And the response field "id" should be a positive number
    And the response field "userId" should be a positive number

  @schema @range
  Scenario: Validate data within expected ranges
    When I send a GET request to "/users"
    Then the response status code should be 200
    And the response array should contain at least 1 item
    And the response array should have at most 100 items

  @contract @nullable
  Scenario: Validate required vs optional fields
    When I send a GET request to "/posts/1"
    Then the response status code should be 200
    And the response field "id" should not be null
    And the response field "title" should not be null
    And the response field "body" should not be null

  @schema @string
  Scenario: Validate string field constraints
    When I send a GET request to "/posts/1"
    Then the response status code should be 200
    And the response field "title" should be a non-empty string
    And the response field "body" should be a non-empty string
    And the response field "title" should have length greater than 0

  @contract @consistency
  Scenario: Validate data consistency across related resources
    When I send a GET request to "/posts/1"
    Then the response status code should be 200
    And I store the response field "userId" as "storedUserId"
    When I send a GET request to "/users/{storedUserId}"
    Then the response status code should be 200
    And the response field "id" should equal stored value "storedUserId"

  @schema @collection
  Scenario: Validate paginated response structure
    When I send a GET request to "/posts?_page=1&_limit=10"
    Then the response status code should be 200
    And the response should be an array
    And the response array should have at most 10 items
    And each array item should have field "id" of type "number"

  @contract @critical
  Scenario: Validate all posts have valid user references
    When I send a GET request to "/posts?_limit=5"
    Then the response status code should be 200
    And each array item should have field "userId" of type "number"
    And each array item field "userId" should be a positive number

  @schema @edgeCases
  Scenario: Handle empty or missing optional fields gracefully
    When I send a GET request to "/posts/1"
    Then the response status code should be 200
    And the response should be valid JSON
    And the response should have at least 4 fields
