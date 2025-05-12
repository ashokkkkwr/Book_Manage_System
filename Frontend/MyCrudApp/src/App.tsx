import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import Login from "./components/Login";
import Register from "./components/UserRegister";
import UserAuthGuard from "./guards/UserAuthGuard";
import Home from "./pages/LandingPage";
import AdminLogin from "./components/AdminLogin";
import AdminRegister from "./components/AdminRegister";
import AdminAuthGuard from "./guards/AdminAuthGuard";
import AdminHome from "./pages/AdminHome";
import BookList from "./pages/Books";
import AuthorList from "./pages/Author";
import UserBook from "./pages/UserBook";
import Cart from "./pages/Cart";
import MyOrders from "./pages/MyOrders";
import AllOrders from "./pages/Allorders";
import AdminGenres from "./pages/Genre";
import AdminPublishers from "./pages/Publisher";
import { BookDetails } from "./components/BookDetails";

export default function App() {
  const router = createBrowserRouter([
    { path: "/login", element: <Login /> },
    { path: "/adminLogin", element: <AdminLogin /> },
    { path: "/register", element: <Register /> },
    { path: "/adminRegister", element: <AdminRegister /> },
    {
      path: "/user/",
      element: <UserAuthGuard />,
      children: [
        { path: "", element: <Home /> },
        { path: "books", element: <UserBook /> },
        { path: "cart", element: <Cart /> },
        { path: "order", element: <MyOrders /> },
        { path: "book-details", element: <BookDetails /> },
      ]
    },
    {
      path: "/admin/",
      element: <AdminAuthGuard />,
      children: [
        { path: "", element: <AdminHome /> },
        { path: "books", element: <BookList /> },
        { path: "authors", element: <AuthorList /> },
        { path: "orders", element: <AllOrders /> },
        { path: "genre", element: <AdminGenres /> },
        { path: "publisher", element: <AdminPublishers /> },
      ]
    }
  ]);

  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}
