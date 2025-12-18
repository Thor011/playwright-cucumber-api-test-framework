Feature: ID and Identity Validation

  Background:
    Given the API base URL is "https://jsonplaceholder.typicode.com"

  @identity @idFormat
  Scenario: Validate ID is numeric and positive
    When I send a GET request to "/posts/1"
    Then the response status code should be 200
    And the response field "id" should be of type "number"
    And the response field "id" should be a positive number
    And the response field "userId" should be of type "number"
    And the response field "userId" should be a positive number

  @identity @uniqueness
  Scenario: Validate ID uniqueness in collection
    When I send a GET request to "/posts?_limit=20"
    Then the response status code should be 200
    And the response should be an array
    And each array item field "id" should be unique

  @identity @immutability
  Scenario: Validate ID immutability on update
    When I send a GET request to "/posts/1"
    Then the response status code should be 200
    And I store the response field "id" as "originalId"
    When I send a PUT request to "/posts/1" with the data:
      | id     | 1             |
      | title  | Updated Title |
      | body   | Updated Body  |
      | userId | 1             |
    Then the response status code should be 200
    And the response field "id" should equal stored value "originalId"

  @identity @foreignKey
  Scenario: Validate foreign key references exist
    When I send a GET request to "/posts/1"
    Then the response status code should be 200
    And I store the response field "userId" as "referencedUserId"
    When I send a GET request to "/users/{referencedUserId}"
    Then the response status code should be 200
    And the response field "id" should equal stored value "referencedUserId"

  @identity @consistency
  Scenario: Validate all posts reference valid users
    When I send a GET request to "/posts?_limit=5"
    Then the response status code should be 200
    And each array item should have valid foreign key "userId" in resource "/users"

  @identity @format
  Scenario: Validate ID format consistency across resources
    When I send a GET request to "/posts/1"
    Then the response status code should be 200
    And the response field "id" should be of type "number"
    When I send a GET request to "/users/1"
    Then the response status code should be 200
    And the response field "id" should be of type "number"
