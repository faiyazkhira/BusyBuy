import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Navbar from "./components/Navbar";
import ProductDetail from "./pages/ProductDetail";
import NotFound from "./pages/NotFound";
import ProductListing from "./pages/ProductListing";
import { CustomProvider } from "./contexts/CustomContext";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderHistory from "./pages/OrderHistory";
import ProtectedRoute from "./components/ProtectedRoute";
import ForgotPassword from "./pages/ForgotPassword";
import { Analytics } from "@vercel/analytics/react";
import { Provider } from "react-redux";
import { store } from "./redux/reducers/store";
import { AuthWrapper } from "./redux/utils/AuthWrapper";
import Notification from "./components/Notification";

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
      <Provider store={store}>
        <AuthWrapper>
          <CustomProvider>
            <RouterProvider router={router} />
            <Notification />
            <Analytics />
          </CustomProvider>
        </AuthWrapper>
      </Provider>
    </>
  );
}

export default App;
