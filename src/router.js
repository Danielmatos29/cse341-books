import express from "express"
import { getBooksHandler } from "./controller/books.js"
import { getBookByIdHandler } from "./controller/book.js"
import {
    getAllAuthors,
    getAuthorByIdController,
    createAuthorController,
    updateAuthorController,
    deleteAuthorController
} from "./controller/authors.js"

const router = express.Router()

/**
 * @openapi
 * tags:
 *   - name: Books
 *     description: Operations related to books
 */

/**
 * @openapi
 * /books:
 *   get:
 *     summary: Get all books
 *     tags: [Books]
 *     responses:
 *       '200':
 *         description: A list of books
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *       '500':
 *         description: Internal server error
 */
router.get('/books', getBooksHandler)

/**
 * @openapi
 * /books/{id}:
 *   get:
 *     summary: Get a book by ID
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The book ID
 *     responses:
 *       '200':
 *         description: A single book
 *         content:
 *           application/json:
 *       '404':
 *         description: Book not found
 *       '500':
 *         description: Internal server error
 */
router.get(`/books/:id`, getBookByIdHandler)

/**
 * @openapi
 * /authors:
 *   get:
 *     summary: Get all authors
 *     tags:
 *       - Authors
 *     responses:
 *       200:
 *         description: A list of authors
 *       500:
 *         description: Unable to retrieve authors
 */
router.get('/authors', getAllAuthors)

/**
 * @openapi
 * /authors/{id}:
 *   get:
 *     summary: Get an author by ID
 *     tags:
 *       - Authors
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The author's custom ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The matching author
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - id
 *                 - name
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: a1
 *                 name:
 *                   type: string
 *                   example: Example Author
 *       404:
 *         description: Author not found
 *         content:
 *           application/json:
 *             example:
 *               error:
 *                 code: AUTHOR_NOT_FOUND
 *                 message: No author exists with id 'a1'.
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               error:
 *                 code: INTERNAL_SERVER_ERROR
 *                 message: An unexpected server error occurred.
 */
router.get('/authors/:id', getAuthorByIdController)

/**
 * @openapi
 * /authors:
 *   post:
 *     summary: Create an author
 *     tags:
 *       - Authors
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - name
 *             properties:
 *               _id:
 *                 type: string
 *                 description: Unique custom author ID
 *                 example: a2
 *               name:
 *                 type: string
 *                 description: Author's full name
 *                 example: Another Example Author
 *           example:
 *             id: a2
 *             name: Another Example Author
 *             birthYear: 2000
 *     responses:
 *       201:
 *         description: Author created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - id
 *                 - name
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: a2
 *                 name:
 *                   type: string
 *                   example: Another Example Author
 *                 birthYear:
 *                   type: Integer
 *                   example: 2000
 *       400:
 *         description: Missing or invalid required fields
 *         content:
 *           application/json:
 *             example:
 *               error:
 *                 code: INVALID_REQUEST
 *                 message: Missing required fields.
 *       409:
 *         description: An author with this ID already exists
 *         content:
 *           application/json:
 *             example:
 *               error:
 *                 code: AUTHOR_ALREADY_EXISTS
 *                 message: Author with id 'a2' already exists.
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               error:
 *                 code: INTERNAL_SERVER_ERROR
 *                 message: An unexpected server error occurred.
 */
router.post('/authors', createAuthorController)

/**
 * @openapi
 * /authors/{id}:
 *   put:
 *     summary: Update an author's name
 *     tags:
 *       - Authors
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The custom ID of the author to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - birthYear
 *             properties:
 *               name:
 *                 type: string
 *                 description: The author's updated full name
 *                 example: Updated Example Author
 *               birthYear:
 *                 type: integer
 *                 description: The author's updated birth year
 *                 example: 1970
 *           example:
 *             name: Updated Example Author
 *             birthYear: 1970
 *     responses:
 *       200:
 *         description: Author updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - id
 *                 - name
 *                 - birthYear
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: a1
 *                 name:
 *                   type: string
 *                   example: Updated Example Author
 *                 birthYear:
 *                   type: Integer
 *                   example: 2000
 *       400:
 *         description: Missing or invalid required fields
 *         content:
 *           application/json:
 *             example:
 *               error:
 *                 code: INVALID_REQUEST
 *                 message: Missing required fields.
 *       404:
 *         description: Author not found
 *         content:
 *           application/json:
 *             example:
 *               error:
 *                 code: AUTHOR_NOT_FOUND
 *                 message: No author exists with id 'a1'.
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               error:
 *                 code: INTERNAL_SERVER_ERROR
 *                 message: An unexpected server error occurred.
 */
router.put('/authors/:id', updateAuthorController)

/**
 * @openapi
 * /authors/{id}:
 *   delete:
 *     summary: Delete an author
 *     tags:
 *       - Authors
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The custom ID of the author to delete
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Author deleted; no response body
 *       404:
 *         description: Author not found
 *         content:
 *           application/json:
 *             example:
 *               error:
 *                 code: AUTHOR_NOT_FOUND
 *                 message: No author exists with id 'a1'.
 *       409:
 *         description: Author has books and cannot be deleted
 *         content:
 *           application/json:
 *             example:
 *               error:
 *                 code: AUTHOR_HAS_BOOKS
 *                 message: Author with id 'a1' has books and cannot be deleted.
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               error:
 *                 code: INTERNAL_SERVER_ERROR
 *                 message: An unexpected server error occurred.
 */
router.delete('/authors/:id', deleteAuthorController)

export default router