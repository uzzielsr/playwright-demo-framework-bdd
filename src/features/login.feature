Feature: Login functionality

    @successful
    Scenario: Successful login
        Given I am on the login page
        When I enter valid credentials
        Then I should see that the user is logged in

    @invalid
    Scenario: Login with invalid password
        Given I am on the login page
        When I enter invalid credentials
        Then I should see an error message