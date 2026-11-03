import express from "express"
import { getBooksHandler } from "./controller/books.js"
import { getBookByIdHandler } from "./controller/book.js"

const router = express.Router()

router.get('/books', getBooksHandler)
router.get(`/books/:id`, getBookByIdHandler)
export default router