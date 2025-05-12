import React, { useState } from 'react';
import { BookOpen, UserPlus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom'; 
import axiosInstance from '../service/axiosInstance';

type RegisterForm = {
  userName: string;
  fullName: string;
  email: string;
  password: string;
};

type FormErrors = {
  userName?: string;
  fullName?: string;
  email?: string;
  password?: string;
};

const AdminRegister: React.FC = () => {
  const [form, setForm] = useState<RegisterForm>({
    userName: '',
    fullName: '',
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [generalError, setGeneralError] = useState<string | null>(null); 
const navigate = useNavigate()
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setFormErrors({ ...formErrors, [name]: undefined }); 
    setGeneralError(null); 
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFormErrors({});
    setGeneralError(null);

    try {
      const response = await axiosInstance.post('/Auth/registerStaff', form);
      console.log('Success:', response.data);
      navigate("/adminLogin")
    } catch (error: any) {
      const data = error.response?.data;

      if (typeof data?.message === 'string') {
        setGeneralError(data.message); 
      } else if (typeof data?.message === 'object') {
        setFormErrors(data.message); 
      } else {
        setGeneralError('Something went wrong!');
      }

      console.error('Error:', data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-100 to-white dark:from-gray-900 dark:to-gray-800 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div className="sm:mx-auto sm:w-full sm:max-w-md">
      <div className="flex justify-center">
        <BookOpen className="h-12 w-12 text-indigo-600 dark:text-indigo-400" />
      </div>
      <h2 className="mt-6 text-center text-3xl font-bold text-gray-900 dark:text-white">
        Create a new account
      </h2>
      <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
        Or{' '}
        <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
          sign in to your existing account
        </Link>
      </p>
    </div>

    <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10 scale-in">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username" className="label">
              Username
            </label>
            <input
              id="username"
              name="userName"
              type="text"
              autoComplete="userName"
              value={form.userName}
              onChange={handleChange}
              className={`input ${formErrors.userName ? 'border-red-500 dark:border-red-400' : ''}`}
            />
            {formErrors.userName && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.userName}</p>
            )}
          </div>

          <div>
            <label htmlFor="fullName" className="label">
              Full Name
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              autoComplete="name"
              value={form.fullName}
              onChange={handleChange}
              className={`input ${formErrors.fullName ? 'border-red-500 dark:border-red-400' : ''}`}
            />
            {formErrors.fullName && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.fullName}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="label">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={handleChange}
              className={`input ${formErrors.email ? 'border-red-500 dark:border-red-400' : ''}`}
            />
            {formErrors.email && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.email}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="label">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              value={form.password}
              onChange={handleChange}
              className={`input ${formErrors.password ? 'border-red-500 dark:border-red-400' : ''}`}
            />
            {formErrors.password && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.password}</p>
            )}
          </div>

         

          {generalError && (
            <div className="rounded-md bg-red-50 dark:bg-red-900/30 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800 dark:text-red-200">{generalError}</h3>
                </div>
              </div>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full flex justify-center items-center"
            >
              <UserPlus className="h-5 w-5 mr-2" />
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </div>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                Or
              </span>
            </div>
          </div>

          <div className="mt-6 flex justify-center gap-3">
          <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
          Register as User
        </Link>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
};

export default AdminRegister;
