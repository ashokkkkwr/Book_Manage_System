import React, { useState, useEffect } from 'react';
import axiosInstance from '../service/axiosInstance';

interface Author {
  firstName: string;
  lastName: string;
  biography: string;
}

interface AuthorFormProps {
  author?: Author;
  onSubmit: () => void;
  onCancel: () => void;
}

const AuthorForm: React.FC<AuthorFormProps> = ({ author, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<Author>({
    firstName: '',
    lastName: '',
    biography: '',
  });

  useEffect(() => {
    if (author) setFormData(author);
  }, [author]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    const response = await axiosInstance.post("/Author/create", formData) 
    console.log("🚀 ~ handleSubmit ~ response:", response)
    onSubmit()
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="label">First Name</label>
        <input className="input" name="firstName" value={formData.firstName} onChange={handleChange} required />
      </div>

      <div>
        <label className="label">Last Name</label>
        <input className="input" name="lastName" value={formData.lastName} onChange={handleChange} required />
      </div>

      <div>
        <label className="label">Biography</label>
        <textarea className="input" name="biography" value={formData.biography} onChange={handleChange} rows={5} />
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <button type="button" onClick={onCancel} className="btn btn-outline">Cancel</button>
        <button type="submit" className="btn btn-primary">{author ? 'Update' : 'Add'} Author</button>
      </div>
    </form>
  );
};

export default AuthorForm;
