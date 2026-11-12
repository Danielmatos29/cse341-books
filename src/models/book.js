import { getDb } from "../db/connect.js"

const getBookById = async (bookId) => {
    try{
        const database = await getDb()
        const collection = database.collection('books')
        const book = collection.findOne({_id: bookId})
        return book
    }
    catch(error){
        console.error("Failed to retrieve book by id", error)
        return null
    }
}

const createBook = async (book) => {
    const database = await getDb();
    const collection = database.collection('books');
    const newBook = collection.insertOne(book);

    return newBook;
}

const updateBook = async (id, book) => {
    const database = await getDb();
    const collection = database.collection('books');
    const updatedBook = collection.updateOne({_id: id}, {$set: book});

    return updatedBook;
}

const deleteBook = async (id) => {
    const database = await getDb();
    const collection = database.collection('books')
    const result = collection.deleteOne({_id: id})

    return result
}
export { getBookById, createBook, updateBook, deleteBook }