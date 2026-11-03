import { getAllBooks } from '../models/books.js'

const getBooksHandler = async (req, res) => {
    try {
        const books = await getAllBooks()
        return res.status(200).json(books)
    }
    catch(error) {
        console.error("GET /books failed", error)
        return res.status(500).json({message : "Failed to retrieve books"})
    }
}

export { getBooksHandler }