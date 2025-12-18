Feature: Data Validation and Error Handling

  Background:
    Given the API base URL is "https://jsonplaceholder.typicode.com"

  @validation @smoke
  Scenario: Validate email format in user response
    When I send a GET request to "/users/1"
    Then the response status code should be 200
    And the response should have property "email"
    And the response property "email" should be a string

  @validation
  Scenario: Validate nested object structure
    When I send a GET request to "/users/1"
    Then the response status code should be 200
    And the response should have property "address"
    And the response property "address" should have property "street"
    And the response property "address" should have property "city"
    And the response property "address" should have property "zipcode"

  @validation @dataTypes
  Scenario: Validate all data types in post response
    When I send a GET request to "/posts/1"
    Then the response status code should be 200
    And the response property "id" should be a number
    And the response property "title" should be a string
    And the response property "body" should be a string
    And the response property "userId" should be a number

  @pagination
  Scenario: Validate pagination limits
    When I send a GET request to "/posts?_limit=3"
    Then the response status code should be 200
    And the response should be a JSON array
    And the response array should have at most 3 items

  @errorHandling
  Scenario: Handle non-existent resource gracefully
    When I send a GET request to "/posts/999999"
    Then the response status code should be 404

  @errorHandling  
  Scenario: Handle non-existent user gracefully
    When I send a GET request to "/users/999999"
    Then the response status code should be 404
