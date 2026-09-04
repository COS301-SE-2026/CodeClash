# Purpose and Scope

## Purpose 
This policy serves to define the standards, procedures and responsibilities associated with software testing within CodeClash. 

CodeClash follows agile testing where every component will be testing once its been developed

### Unit Tests
    Black and White box testing will be used to test the functionality of components and ensure every path of computation produces the expected outcome.

    Use case based testing will be used to ensure the system provides functionality aligned with the client use cases.

### Integration Tests
    Sandwich Strategy will be used to test component integration 
    Tests will begin at the connection points between the frontend and backend layers, mocking components going outwards

    from there components dependent on the previously tested components will then be tested

### Regression Tests
    Unit and integration tests will be run in the pipeline on every PR into dev and main 

### System Tests
    Playwright will be used to run end-to-end testing in the local docker environment

## Scope
### Frontend 
    - Contexts and hooks : Tests check that required variables are being provided properly
    - Services : Tests that services provide the required functionality
    - View Models : Tests that data that should be sent the the views is as expected
    - Views : Tests interactive element (click, navigation)

### Backend 
    - Uses case : Tests that use cases accomplish the required tasks and returns the expected values
    - Controllers: Tests that requests are handled as expected
    - Repositories: Tests that data is fectched from the database correctly and returned as expected
    - socket handlers: Tests that event are routed properly and returns are formatted as expected
    - Server: Tests that the entry point orchestrates the app and its activities correctly

# Quality Objective

### Coverage 
    Core game logic needs to be tested with at least 90% coverage, core features include:
        - submission validation
        - matchmaking
        - game creation
        - game resolution 
    
    Secondary features need to be tested with at least 80% coverage, secondary features include:
        - navigation
        - ui interactions 
    

### Definition of Done
    Features are considered 'Done' once all tests for that feature have passed 

### Priority Order 
    - Backend-Frontend connection 
    - Backend functionality 
    - Frontend Providers 
    - Frontend View Models
    - Frontend Views  

# Testing Standards
### Naming Conventions 
    - Describe blocks: <Feature / Component > - <Functional Requirement it addresses>
    - it blocks: <Use Case>

## Mocking Conventions 

External dependencies are mocked in unit tests
- redis (ioredis-mock)
- database accesses (mock repositories)

Integration and system tests use real connection through the Docker containers to validate behaviour
    

## File Structure 
All tests will be in a dedicated __test__ dir for frontend and backend

within that directory tests are categories into folders based on the test type 
    - Unit
    - Integration
    - Regression
    - System 

Each of these is furthur subdivided into functional requirements that they address if applicable 

# Roles and Responsibilities 
 Each team member is responsible for writing tests for code that they have written 
 Two other team members must review and approve test coverage before merges 

# Compliance Requirements
All testing in the pipeline must pass before PRs can be merged 
All tests must be passing locally before a PR is opened into dev or main

# Risk Management

## Coverage Shortfall
    If testing for a feature cannot reach target coverage by the deadline, this must be documented with reason so it can be planned into the next sprint and prioritised 

## Failing Tests
    tests that fail continuously or intermittently are treated as a defect in the code or the test.
    Thesee tests are not to be deleted and must be addressed and updated accordingly 

## Timeline
    Testing is prioritised as outlined in the [Quality objective](#quality-objective) section
    Given the fixed deadlines of the project, lower-priority areas may be submitted with lower coverage, should time run out.

