import axios from "axios";
import React, { useState } from "react";

const Login = () => {
  // State variables for userName, password, and error messages
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    setError(""); // Clear any existing errors

    try {
      // Send POST request to the login API
      const response = await axios.post("http://localhost:5226/api/auth/login", {
        userName,
        password,
      });

      // Handle successful login
      console.log("Login successful:", response.data);
      // You can store tokens or redirect the user here
    } catch (err) {
      // Handle errors
      if (err.response) {
        // Server responded with a status other than 2xx
        setError(err.response.data.message || "Login failed");
      } else if (err.request) {
        // Request was made but no response received
        setError("No response from server");
      } else {
        // Something else caused the error
        setError("An error occurred during login");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 text-center">Login</h2>

        {/* Display error message if any */}
        {error && (
          <div className="mt-4 text-red-600 text-sm text-center">
            {error}
          </div>
        )}

        <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="userName" className="block text-sm font-medium text-gray-600">
              userName
            </label>
            <input
              type="userName"
              id="userName"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="john@example.com"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-600">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="********"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
          >
            Login
          </button>
          <p className="text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <a href="/" className="text-blue-500 hover:underline">
              Register
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
