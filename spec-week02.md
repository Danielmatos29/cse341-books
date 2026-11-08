# Books API Week 02 Spec - Version 1

## Feature 1: Book CRUD Operations and Author References

### Goal
Update the existing Week 01 book API so book documents include a reference to an author and the API supports all CRUD operations for books. Every book route must be documented and testable in Swagger.

### Data Model
Book documents will be stored in the `books` collection.

Required book fields:
- `id`: string, required, custom id such as `b1`
- `authorId`: string, required, references the `id` field of an author document
- `title`: string, required
- `publicationDate`: string, required

Books will continue to use custom string ids instead of MongoDB `_id` values for route parameters.

### Relationship to Authors
Each book will identify its author with an `authorId` field. The value of `authorId` must match the custom `id` value of an existing author document.

When creating or updating a book, the API should reject the request with a `400` status code if the submitted `authorId` does not match an existing author.

### Routes

#### GET /books
Purpose: Return all books.

Success:
- Status code: `200`
- Response body: an array of book objects

Errors:
- `500` if an unexpected server or database error occurs

#### GET /books/:id
Purpose: Return one book by its custom id.

Success:
- Status code: `200`
- Response body: the matching book object

Errors:
- `404` if no book exists with that id
- `500` if an unexpected server or database error occurs

#### POST /books
Purpose: Create a new book.

Request body:

    {
      "id": "b4",
      "authorId": "a1",
      "title": "Example Book Title",
      "publicationDate": "2026-01-15"
    }

Success:
- Status code: `201`
- Response body: the newly created book object

Errors:
- `400` if a required field is missing
- `400` if the `id` already exists
- `400` if the `authorId` does not match an existing author
- `500` if an unexpected server or database error occurs

#### PUT /books/:id
Purpose: Update an existing book.

Request body:

    {
      "authorId": "a2",
      "title": "Updated Book Title",
      "publicationDate": "2026-02-20"
    }

Success:
- Status code: `200`
- Response body: the updated book object

Errors:
- `400` if a required field is missing
- `400` if the `authorId` does not match an existing author
- `404` if no book exists with that id
- `500` if an unexpected server or database error occurs

#### DELETE /books/:id
Purpose: Delete an existing book.

Success:
- Status code: `204`
- Response body: none

Errors:
- `404` if no book exists with that id
- `500` if an unexpected server or database error occurs

### Swagger Documentation
Swagger must document every book route.

### Deployment Expectations
After implementation, the book routes must work locally and from the deployed Render application. The deployed Swagger page at `/api-docs` must allow someone to test every book route from the browser.

## Feature 2: Author CRUD Operations

### Goal
Add CRUD operations for authors. Every author route must be documented and testable in Swagger. Books continue to refer to authors using the author's custom `id` in the book's `authorId` field.

### Data Model
Author documents will be stored in the `authors` collection.

Required author fields:
- `id`: string, required, unique custom id such as `a1`
- `name`: string, required, author's full name

The `id` is the stable identifier used in route parameters and by books; it must not be changed by an update. Names must contain non-whitespace characters and be no longer than 200 characters. Trim leading and trailing whitespace before storing.

### Routes

#### GET /authors
Purpose: Return all authors.

Success:
- Status code: `200`
- Response body: an array of author objects, or an empty array if there are no authors

Example:

    [
      {
        "id": "a1",
        "name": "Example Author"
      }
    ]

Errors:
- `500` if an unexpected server or database error occurs

#### GET /authors/:id
Purpose: Return one author by their custom id.

Success:
- Status code: `200`
- Response body: the matching author object

Errors:
- `404` if no author exists with that id
- `500` if an unexpected server or database error occurs

#### POST /authors
Purpose: Create a new author.

Request body:

    {
      "id": "a2",
      "name": "Another Example Author"
    }

The body must be a JSON object containing exactly the required fields. The server validates and trims `name`; clients must send `Content-Type: application/json`.

Success:
- Status code: `201`
- Response body: the newly created author object, including its `id` and `name`

Errors:
- `400` if the body is malformed, a required field is missing, a field has the wrong type or an invalid value, or an unsupported field is supplied
- `409` if the `id` already exists
- `500` if an unexpected server or database error occurs; do not expose internal error details

#### PUT /authors/:id
Purpose: Replace an existing author's editable fields. The path `:id` identifies the author and is immutable; the request body must contain the complete set of editable fields.

Request body:

    {
      "name": "Updated Example Author"
    }

Success:
- Status code: `200`
- Response body: the updated author object, including its unchanged `id`

Errors:
- `400` if the body is malformed, `name` is missing or invalid, or an unsupported field (including `id`) is supplied
- `404` if no author exists with that id
- `500` if an unexpected server or database error occurs; do not expose internal error details

#### DELETE /authors/:id
Purpose: Delete an author who is not referenced by any books.

Success:
- Status code: `204`
- Response body: none

Errors:
- `404` if no author exists with that id
- `409` if one or more books have an `authorId` equal to the author's `id`; leave both the author and those books unchanged
- `500` if an unexpected server or database error occurs; do not expose internal error details

The check for references and deletion must preserve referential integrity, including when a book is being created concurrently. Use an atomic/transactional approach where supported or an equivalent strategy that prevents a successful deletion from leaving books with dangling `authorId` values.

### Error Response Format
For `400`, `404`, `409`, and `500` responses, return a JSON object in this form:

    {
      "error": {
        "code": "AUTHOR_NOT_FOUND",
        "message": "No author exists with id 'a9'."
      }
    }

Use a stable, machine-readable `code` and a brief `message`. Do not include stack traces, database details, or other internal information in client responses. For example, use `INVALID_AUTHOR`, `AUTHOR_ALREADY_EXISTS`, `AUTHOR_NOT_FOUND`, `AUTHOR_HAS_BOOKS`, and `INTERNAL_SERVER_ERROR` for the corresponding cases.

### Relationship to Books
When creating or updating a book, `authorId` must match an existing author's custom `id`; reject an unknown `authorId` with `400`. Deleting a referenced author is rejected as described above. These rules apply consistently to all book and author routes.

### Swagger Documentation
Swagger must document every author route, path parameter, request body, success response, and error response, including the JSON response schemas and examples.

### Deployment Expectations
After implementation, the author routes must work locally and from the deployed Render application. The deployed Swagger page at `/api-docs` must allow someone to test every author route from the browser.
