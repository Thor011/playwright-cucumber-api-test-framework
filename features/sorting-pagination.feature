Feature: Ordering, Sorting and Pagination

  Background:
    Given the API base URL is "https://jsonplaceholder.typicode.com"

  @sorting @defaultOrder
  Scenario: Validate default sorting order
    When I send a GET request to "/posts?_limit=10"
    Then the response status code should be 200
    And the response should be an array
    And the response array should be sorted by "id" in "ascending" order

  @sorting @customOrder
  Scenario: Validate custom sorting parameter
    When I send a GET request to "/posts?_sort=id&_order=desc&_limit=5"
    Then the response status code should be 200
    And the response should be an array
    And the response array should have at most 5 items

  @sorting @stability
  Scenario: Validate stable ordering across pages
    When I send a GET request to "/posts?_page=1&_limit=5"
    Then the response status code should be 200
    And I store the last array item field "id" as "lastIdPage1"
    When I send a GET request to "/posts?_page=2&_limit=5"
    Then the response status code should be 200
    And the first array item field "id" should be greater than stored value "lastIdPage1"

  @pagination @boundaries
  Scenario: Validate page boundary - page 1
    When I send a GET request to "/posts?_page=1&_limit=10"
    Then the response status code should be 200
    And the response should be an array
    And the response array should have at most 10 items

  @pagination @emptyPage
  Scenario: Validate empty page returns empty array
    When I send a GET request to "/posts?_page=1000&_limit=10"
    Then the response status code should be 200
    And the response should be an array
    And the response array should be empty

  @pagination @limitBoundary
  Scenario: Validate page size limit
    When I send a GET request to "/posts?_limit=5"
    Then the response status code should be 200
    And the response should be an array
    And the response array should have at most 5 items

  @pagination @consistency
  Scenario: Validate pagination does not skip or duplicate items
    When I send a GET request to "/posts?_page=1&_limit=5"
    Then the response status code should be 200
    And I store all array item field "id" values as "page1Ids"
    When I send a GET request to "/posts?_page=2&_limit=5"
    Then the response status code should be 200
    And the array should not contain any stored "page1Ids" values

  @pagination @metadata
  Scenario: Validate pagination structure is consistent
    When I send a GET request to "/posts?_page=1&_limit=10"
    Then the response status code should be 200
    And the response should be an array
    And each array item should have field "id" of type "number"
