Feature: Login functionality

    @C2331 @successful
    Scenario: Successful login
        Given I am on the login page
        When I enter valid credentials
        Then I should see that the user is logged in

    @C2332 @invalid
    Scenario: Login with invalid password
        Given I am on the login page
        When I enter invalid credentials
        Then I should see an error message