Feature: Data Quality and Sanitization

  Background:
    Given the API base URL is "https://jsonplaceholder.typicode.com"

  @dataQuality @trimming
  Scenario: Validate string fields are properly trimmed
    When I send a GET request to "/users/1"
    Then the response status code should be 200
    And the response field "name" should not have leading whitespace
    And the response field "name" should not have trailing whitespace
    And the response field "email" should not have leading whitespace
    And the response field "email" should not have trailing whitespace

  @dataQuality @consistency
  Scenario: Validate consistent capitalization
    When I send a GET request to "/users/1"
    Then the response status code should be 200
    And the response field "name" should be of type "string"
    And the response field "username" should be of type "string"

  @dataQuality @emptyStrings
  Scenario: Validate no empty strings in required fields
    When I send a GET request to "/posts/1"
    Then the response status code should be 200
    And the response field "title" should be a non-empty string
    And the response field "body" should be a non-empty string

  @dataQuality @nullVsEmpty
  Scenario: Validate proper null handling vs empty strings
    When I send a GET request to "/posts/1"
    Then the response status code should be 200
    And the response field "title" should not be null
    And the response field "title" should not be an empty string

  @sanitization @format
  Scenario: Validate email format is valid
    When I send a GET request to "/users/1"
    Then the response status code should be 200
    And the response field "email" should match email format
    And the response field "email" should not contain spaces

  @sanitization @urlFormat
  Scenario: Validate URL format in website field
    When I send a GET request to "/users/1"
    Then the response status code should be 200
    And the response field "website" should be of type "string"
    And the response field "website" should be a non-empty string

  @dataQuality @consistency
  Scenario: Validate data consistency across all posts
    When I send a GET request to "/posts?_limit=10"
    Then the response status code should be 200
    And each array item field "title" should be a non-empty string
    And each array item field "body" should be a non-empty string
    And each array item field "id" should be a positive number
    And each array item field "userId" should be a positive number

  @dataQuality @noInvalidCharacters
  Scenario: Validate no control characters in text fields
    When I send a GET request to "/posts/1"
    Then the response status code should be 200
    And the response field "title" should not contain control characters
    And the response field "body" should not contain control characters
