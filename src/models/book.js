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

export { getBookById }