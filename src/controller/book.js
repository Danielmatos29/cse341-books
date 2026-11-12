import { getBookById, createBook, updateBook, deleteBook } from "../models/book.js";

const getBookByIdHandler = async (req, res) => {
    try {
        const requestedId = req.params.id;
        const book = await getBookById(requestedId);
        if (!book) {
        return res.status(404).json({ message: "Book not found" });
        }

        return res.status(200).json(book);
    } 
    catch (error) {
        console.error("GET /books/:id failed", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

const createBookController = async (req, res) => {
    try{
        const { _id, title, authorId, publicationDate } = req.body

        if (!_id || !title || !authorId || !publicationDate) {
            return res.status(400).json({error: "INVALID_REQUEST", message: "Missing required fields"})
        }
        const existingBook = await getBookById(_id)
        if (existingBook){
            return res.status(409).json({error: "BOOK_ALREADY_EXISTS", message: `Book with id: ${_id} already exists`})
        }

        const newBook = await createBook({_id, title, authorId, publicationDate});
        return res.status(201).json(newBook)
    }
    catch (error){
        return res.status(500).json({ error: { code: 'INTERNAL_SERVER_ERROR', message: 'An unexpected server error occurred.' } });
    }
}

const updateBookController = async(req, res) => {
    try {
        const { id } = req.params
        const { title, authorId, publicationDate } = req.body
    
        if (!title || !authorId || !publicationDate){
            return res.status(400).json({error: "INVALID_REQUEST", message: "Missing required fields"})
        }
        const book = await getBookById(id)

        if (!book){
            return res.status(404).json({error: "BOOK_NOT_FOUND", message: `No book with the id: ${id} found`})
        }

        const result = await updateBook(id, { title, authorId, publicationDate})
        
        return res.status(200).json(result)
    }
    catch(error){
        return res.status(500).json({ error: { code: 'INTERNAL_SERVER_ERROR', message: 'An unexpected server error occurred.' } });
    }
}

const deleteBookController = async (req, res) => {
    try {
        const { id } = req.params
        const book = await getBookById(id)
        if (!book){
            return res.status(404).json({error: "BOOK_NOT_FOUND", message: `No book with the id: ${id} exists`})
        }

        const deletedBook = await deleteBook(id)
        return res.status(200).json(deletedBook)
    }
    catch(error){
        return res.status(500).json({ error: { code: 'INTERNAL_SERVER_ERROR', message: 'An unexpected server error occurred.' } });
    }
}

export { getBookByIdHandler, createBookController, updateBookController, deleteBookController }