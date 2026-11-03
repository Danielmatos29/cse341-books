import { getBookById } from "../models/book.js";

const getBookByIdHandler = async (req, res) => {
  const requestedId = req.params.id;

    try {
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

export { getBookByIdHandler }