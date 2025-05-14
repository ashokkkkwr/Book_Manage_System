import React, { useEffect, useState } from 'react';
import axiosInstance from '../service/axiosInstance';
import { toast } from 'react-toastify';

interface Book {
  bookId: string;
  title: string;
  isbn: string;
  description: string;
  publicationDate: string;
  publisherName: string;
  genreName: string;
  language: string;
  authorFullName: string;
  format: string;
  price: number;
  stockCount: number;
  bookImagePath: string;
  publisher: Publisher;
  genre: Genre;
  author: Author;
}

interface Author{
  authorId:string;
  firstName:string;
  lastName:string;
}
interface Genre{
  genreId:string;
  name:string;
}
interface Publisher{
  publisherId:string;
  name:string;

}

interface EditBookFormProps {
  book: Book;
  onSuccess: () => void;
  onCancel: () => void;
}

const EditBookForm: React.FC<EditBookFormProps> = ({ book, onSuccess, onCancel }) => {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [publishers, setPublishers] = useState<Publisher[]>([]);

  const [formData, setFormData] = useState({
    ...book,
    bookImage: null as File | null,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    axiosInstance.get('/Author/getAllAuthors').then(res => setAuthors(res.data));
    axiosInstance.get('/Genre/getAllGenres').then(res => setGenres(res.data));
    axiosInstance.get('/Publisher/getAllPublishers').then(res => setPublishers(res.data));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, bookImage: e.target.files![0] }));
    }
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.isbn.trim()) newErrors.isbn = 'ISBN is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.publicationDate) newErrors.publicationDate = 'Publication Date is required';
    if (!formData.author.authorId) newErrors.authorId = 'Author is required';
    if (!formData.publisher.publisherId) newErrors.publisherId = 'Publisher is required';
    if (!formData.genre.genreId) newErrors.genreId = 'Genre is required';
    if (!formData.language.trim()) newErrors.language = 'Language is required';
    if (!formData.format.trim()) newErrors.format = 'Format is required';
    if (!formData.price) newErrors.price = 'Price is required';
    if (!formData.stockCount) newErrors.stockCount = 'Stock count is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const data = new FormData();
    data.append('bookId', formData.bookId);
    data.append('title', formData.title);
    data.append('isbn', formData.isbn);
    data.append('description', formData.description);
    data.append('publicationDate', formData.publicationDate);
    data.append('publisherId', formData.publisher.publisherId);
    data.append('authorId', formData.author.authorId);
    data.append('genreId', formData.genre.genreId);
    data.append('language', formData.language);
    data.append('format', formData.format);
    data.append('price', formData.price.toString());
    data.append('stockCount', formData.stockCount.toString());
    if(book.bookImagePath)
    data.append('bookImagePath', formData.bookImagePath);
    
    try {
      const res = await axiosInstance.patch(`/Book/updateBook/${book.bookId}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success(res.data.message)
      onSuccess();
    } catch (err) {
      console.error('Error updating book:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 dark:bg-gray-900 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="label">Title *</label>
          <input name="title" value={formData.title} onChange={handleChange} className="input" />
          {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
        </div>
        <div>
          <label className="label">ISBN *</label>
          <input name="isbn" value={formData.isbn} onChange={handleChange} className="input" />
          {errors.isbn && <p className="text-red-500 text-sm">{errors.isbn}</p>}
        </div>
      </div>

      <div>
        <label className="label">Description *</label>
        <textarea name="description" value={formData.description} onChange={handleChange} className="input" />
        {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="label">Author *</label>
          <select name="authorId" value={formData.author.authorId} onChange={handleChange} className="input">
            <option value="">Select author</option>
            {authors.map(author => (
              <option key={author.authorId} value={author.authorId}>
                {author.firstName} {author.lastName}
              </option>
            ))}
          </select>
          {errors.authorId && <p className="text-red-500 text-sm">{errors.authorId}</p>}
        </div>
        <div>
          <label className="label">Publisher *</label>
          <select name="publisherId" value={formData.publisher.publisherId} onChange={handleChange} className="input">
            <option value="">Select publisher</option>
            {publishers.map(p => (
              <option key={p.publisherId} value={p.publisherId}>{p.name}</option>
            ))}
          </select>
          {errors.publisherId && <p className="text-red-500 text-sm">{errors.publisherId}</p>}
        </div>
        <div>
          <label className="label">Genre *</label>
          <select name="genreId" value={formData.genre.genreId} onChange={handleChange} className="input">
            <option value="">Select genre</option>
            {genres.map(g => (
              <option key={g.genreId} value={g.genreId}>{g.name}</option>
            ))}
          </select>
          {errors.genreId && <p className="text-red-500 text-sm">{errors.genreId}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="label">Language *</label>
          <input name="language" value={formData.language} onChange={handleChange} className="input" />
          {errors.language && <p className="text-red-500 text-sm">{errors.language}</p>}
        </div>
        <div>
          <label className="label">Format *</label>
          <input name="format" value={formData.format} onChange={handleChange} className="input" />
          {errors.format && <p className="text-red-500 text-sm">{errors.format}</p>}
        </div>
        <div>
          <label className="label">Publication Date *</label>
          <input type="date" name="publicationDate" value={formData.publicationDate} onChange={handleChange} className="input" />
          {errors.publicationDate && <p className="text-red-500 text-sm">{errors.publicationDate}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="label">Price *</label>
          <input type="number" name="price" value={formData.price} onChange={handleChange} className="input" min="0" step="0.01" />
          {errors.price && <p className="text-red-500 text-sm">{errors.price}</p>}
        </div>
        <div>
          <label className="label">Stock Count *</label>
          <input type="number" name="stockCount" value={formData.stockCount} onChange={handleChange} className="input" min="0" />
          {errors.stockCount && <p className="text-red-500 text-sm">{errors.stockCount}</p>}
        </div>
      </div>

      <div>
        <label className="label">Book Cover Image</label>
        <input type="file" accept="image/*" onChange={handleFileChange} className="input" />
      </div>

      <div className="flex justify-end space-x-4 border-t pt-4">
        <button type="button" className="btn btn-outline" onClick={()=>onCancel()}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          Update Book
        </button>
      </div>
    </form>
  );
};

export default EditBookForm;
