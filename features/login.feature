# Feature files describe behavior in Gherkin, independently from browser code.
Feature: Login functionality
  As a SauceDemo user
  I want to sign in
  So that I can view the inventory

  @smoke
  Scenario: Successful login with valid credentials
    Given I navigate to the login page
    When I enter valid username and password
    And I click the login button
    Then I should be successfully logged in

  @regression
  Scenario: Login with invalid credentials
    Given I navigate to the login page
    When I enter invalid username and password
    And I click the login button
    Then I should see a login error message
