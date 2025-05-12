import React, { useEffect, useState } from 'react';
import axiosInstance from '../service/axiosInstance';
import AuthorForm from '../components/AuthorForm';
import { Plus } from 'lucide-react';

interface Author {
    authorId: string;
    firstName: string;
    lastName: string;
    biography: string;
}

const AuthorList: React.FC = () => {
    const [authors, setAuthors] = useState<Author[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [selectedAuthor, setSelectedAuthor] = useState<Author | undefined>(undefined);

    const fetchAuthors = async () => {
        try {
            const res = await axiosInstance.get('/Author/getAllAuthors');
            setAuthors(res.data);
        } catch (err) {
            console.error('Failed to fetch authors:', err);
        }
    };

    const handleDelete = async (authorId: string) => {
        try {
            await axiosInstance.delete(`/Author/deleteAuthor/${authorId}`);
            fetchAuthors();
        } catch (err) {
            console.error('Failed to delete author:', err);
            alert("Failed to delete the author.");
        }
    };

    const handleAddClick = () => {
        setSelectedAuthor(undefined);
        setShowForm(true);
    };

    const handleFormClose = () => {
        setShowForm(false);
        setSelectedAuthor(undefined);
        fetchAuthors();
    };

    useEffect(() => {
        fetchAuthors();
    }, []);

    return (
        <div className="p-6 bg-gray-50 dark:bg-gray-900 h-screen">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Authors</h2>
                <button
                    onClick={handleAddClick}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    <Plus size={18} /> Create Author
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {authors.map(author => (
                    <div key={author.authorId} className="p-4 border rounded shadow">
                        <h3 className="text-lg font-bold">{author.firstName} {author.lastName}</h3>
                        <p className="text-sm text-gray-700 mb-2">{author.biography}</p>
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => {
                                    setSelectedAuthor(author);
                                    setShowForm(true);
                                }}
                                className=" btn btn-primary">
                                Edit
                            </button>
                            <button
                                onClick={() => {
                                    if (confirm("Are you sure you want to delete this author?")) {
                                        handleDelete(author.authorId);
                                    }
                                }}
                                className="btn btn-outline">
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {showForm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className=" p-6 bg-gray-50 dark:bg-gray-900 rounded shadow-lg w-full max-w-3xl">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold">
                                {selectedAuthor ? 'Edit Author' : 'Add Author'}
                            </h2>
                            <button
                                onClick={handleFormClose}
                                className="text-gray-500 hover:text-gray-800"
                            >
                                ✕
                            </button>
                        </div>
                        <AuthorForm
                            author={selectedAuthor}
                            onSubmit={handleFormClose}
                            onCancel={handleFormClose}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default AuthorList;
