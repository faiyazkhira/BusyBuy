import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Login from "./pages/Login";
import { AuthProvider } from "./contexts/AuthContext";
import SignUp from "./pages/SignUp";
import Navbar from "./components/Navbar";
import ProductDetail from "./pages/ProductDetail";
import { CartProvider } from "./contexts/CartContext";
import NotFound from "./pages/NotFound";
import ProductListing from "./pages/ProductListing";
import { CustomProvider } from "./contexts/CustomContext";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderHistory from "./pages/OrderHistory";
import ProtectedRoute from "./components/ProtectedRoute";
import { NotificationProvider } from "./contexts/NotificationContext";
import ForgotPassword from "./pages/ForgotPassword";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Navbar />,
      errorElement: <NotFound />,
      children: [
        {
          index: true,
          element: <Home />,
        },
        {
          path: "/products",
          children: [
            { index: true, element: <ProductListing /> },
            { path: ":productId", element: <ProductDetail /> },
          ],
        },
        {
          path: "/cart",
          element: <Cart />,
        },
        {
          path: "/checkout",
          element: (
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          ),
        },
        {
          path: "/orders",
          element: (
            <ProtectedRoute>
              <OrderHistory />
            </ProtectedRoute>
          ),
        },
      ],
    },

    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/signup",
      element: <SignUp />,
    },
    {
      path: "/forgot-password",
      element: <ForgotPassword />,
    },
  ]);

  return (
    <>
      <AuthProvider>
        <NotificationProvider>
          <CustomProvider>
            <CartProvider>
              <RouterProvider router={router} />
            </CartProvider>
          </CustomProvider>
        </NotificationProvider>
      </AuthProvider>
    </>
  );
}

export default App;
