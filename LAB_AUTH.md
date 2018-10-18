Adding User Management and Auth
===

## Description

For this assignment you'll add user-management, authentication, and authorization to ripe-banana.

## Details 

The `Reviewer` model **is** the "signed up" user. Add your user management features
to this model. This means you should solicit a company name in addition to adding email and hash. (You can
instead choose to create a 1:1 separate model for User vs Reviewer if you wish). 

**Signup and and Signin now supercede (replace) existing Reviewer change routes (POST, PUT, DELETE)**. 

You'll need to provide:

* Auth routes for: `signin` and `signup` and `verify` for user management. The first
two return a JWT token on success.
* JWT token service for signin, signup, wrapped in auth middleware
* Additions to `Reviewer`:
  * `email` (`String`), `hash` (`String`) and `roles` (`[String]`)
  * `generateHash` and `comparePassword` instance methods
* Middleware function that "protects" certain routes (see below)
* Middleware function that "authorizes" for certain routes (see below)

Here are the security requirements for ripe banana:

* Any of the /GET routes are public and do not require authentication
* A user/reviewer must have a valid token to post a review
* Any of the routes that modify studio, film, or actor data require a user to be authenticated
**and** they must have a role of `admin`.
* Posting a review **must** be restricted to being owned by logged in user

## Testing

* Update Reviewer model unit tests
* Write one signup and one signin E2E/API tests for user management (you don't need to test all failure cases - mostly for time constraints).
* Update other E2E tests to use a token for protected routes so they continue to work. **You'll need to "sign up" at start of
test in order to access resource** as this will break tests that previously worked without a token.

## Rubric:

* User Model: 4pts
* Sign in/up routes: 4pts
* Apply Auth Middleware: 6pts
* Project Organization and Testing: 6pts

