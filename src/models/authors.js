import { ObjectId } from 'mongodb';
import { getDb } from '../db/connect.js'

const getAllAuthors = async () => {
    const db = await getDb();
    const collection = db.collection('authors');
    const authors = collection.find().toArray();

    return authors;
};

const getAuthorById = async (id) => {
    const db = await getDb();
    const collection = db.collection('authors');
    const author = collection.findOne({ _id: id });

    return author;
};

const createAuthor = async (author) => {
    const db = await getDb();
    const collection = db.collection('authors');
    const result = await collection.insertOne(author);

    return result;
};

const updateAuthor = async (id, author) => {
    const db = await getDb();
    const collection = db.collection('authors');
    const result = await collection.updateOne({ _id: id }, { $set: author });

    return result;
};

const deleteAuthor = async (id) => {
    const db = await getDb();
    const collection = db.collection('authors');
    const result = await collection.deleteOne({ _id: id });

    return result;
};

const authorHasBooks = async (id) => {
    const db = await getDb();
    const collection = db.collection('books');
    const books = await collection.find({ authorId: id }).toArray();

    return books.length > 0;
};

export { getAllAuthors, getAuthorById, createAuthor, updateAuthor, deleteAuthor, authorHasBooks };
