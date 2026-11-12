import { getAllAuthors as getAllAuthorsFromDb, getAuthorById, createAuthor, updateAuthor, deleteAuthor, authorHasBooks } from '../models/authors.js';

const getAllAuthors  = async (req, res) => {
    try {
        const authors = await getAllAuthorsFromDb();
        return res.status(200).json(authors);
    } catch (error) {
        console.error("GET /authors failed", error);
        return res.status(500).json({ message: "Unable to retrieve authors" });
    }
};

const getAuthorByIdController = async (req, res) => {
    try {
        const author = await getAuthorById(req.params.id);
        if (!author) {
            return res.status(404).json({ error: { code: 'AUTHOR_NOT_FOUND', message: `No author exists with id '${req.params.id}'.` } });
        }
        return res.status(200).json(author);
    } catch (error) {
        return res.status(500).json({ error: { code: 'INTERNAL_SERVER_ERROR', message: 'An unexpected server error occurred.' } });
    }
};

const createAuthorController = async (req, res) => {
    try {
        const { _id, name, birthYear } = req.body;
        if (!_id || !name || birthYear === undefined) {
            return res.status(400).json({ error: { code: 'INVALID_REQUEST', message: 'Missing required fields.' } });
        }
        const existingAuthor = await getAuthorById(_id);
        if (existingAuthor) {
            return res.status(409).json({ error: { code: 'AUTHOR_ALREADY_EXISTS', message: `Author with id '${_id}' already exists.` } });
        }
        const newAuthor = await createAuthor({ _id, name, birthYear });
        return res.status(201).json(newAuthor);
    } catch (error) {
        return res.status(500).json({ error: { code: 'INTERNAL_SERVER_ERROR', message: 'An unexpected server error occurred.' } });
    }
};

const updateAuthorController = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, birthYear } = req.body;
        
        if (!name || !birthYear) {
            return res.status(400).json({ error: { code: 'INVALID_REQUEST', message: 'Missing required fields.' } });
        }
        const author = await getAuthorById(id);
        if (!author) {
            return res.status(404).json({ error: { code: 'AUTHOR_NOT_FOUND', message: `No author exists with id '${id}'.` } });
        }
        const updatedAuthor = await updateAuthor(id, { name, birthYear });
        return res.status(200).json(updatedAuthor);
    } catch (error) {
        return res.status(500).json({ error: { code: 'INTERNAL_SERVER_ERROR', message: 'An unexpected server error occurred.' } });
    }
};

const deleteAuthorController = async (req, res) => {
    try {
        const { id } = req.params;
        const author = await getAuthorById(id);
        if (!author) {
            return res.status(404).json({ error: { code: 'AUTHOR_NOT_FOUND', message: `No author exists with id '${id}'.` } });
        }
        if (await authorHasBooks(id)) {
            return res.status(409).json({ error: { code: 'AUTHOR_HAS_BOOKS', message: `Author with id '${id}' has books and cannot be deleted.` } });
        }
        await deleteAuthor(id);
        return res.status(204).send();
    } catch (error) {
        return res.status(500).json({ error: { code: 'INTERNAL_SERVER_ERROR', message: 'An unexpected server error occurred.' } });
    }
};

export { getAllAuthors, getAuthorByIdController, createAuthorController, updateAuthorController, deleteAuthorController }

