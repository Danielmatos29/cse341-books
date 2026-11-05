import express from "express"
import { getBooksHandler } from "./controller/books.js"
import { getBookByIdHandler } from "./controller/book.js"

const router = express.Router()

/**
 * @swagger
 * tags:
 *   - name: Books
 *     description: Operations related to books
 */

/**
 * @swagger
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
 * @swagger
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

export default router