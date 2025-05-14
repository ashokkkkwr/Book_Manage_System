import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import Login from "./Components/Login";
import Register from "./Components/UserRegister";
import UserAuthGuard from "./guards/UserAuthGuard";
import Home from "./pages/LandingPage";
import AdminLogin from "./Components/AdminLogin";
import AdminRegister from "./Components/AdminRegister";
import AdminAuthGuard from "./guards/AdminAuthGuard";
import AdminHome from "./pages/AdminHome/AdminHome";
import BookList from "./pages/Books";
import AuthorList from "./pages/Author";
import UserBook from "./pages/UserBook";
import Cart from "./pages/Cart";
import MyOrders from "./pages/MyOrders";
import AllOrders from "./pages/Allorders";
import AdminGenres from "./pages/Genre";
import AdminPublishers from "./pages/Publisher";
import { BookDetails } from "./Components/BookDetails";
import Announcement from "./pages/Announcement";
import UserAnnouncement from "./pages/UserAnnouncement";
import Bookmarks from "./pages/Bookmark";
import NotificationListener from "./Components/NotificaitonDropdown";

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
        { path: "announcement", element: <UserAnnouncement /> },
        { path: "bookmark", element: <Bookmarks /> },
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
        { path: "announcement", element: <Announcement /> },
      ]
    }
  ]);

  return (
    <>
        <NotificationListener />

      <RouterProvider router={router} />
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}
