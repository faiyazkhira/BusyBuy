import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

//This component is used to secure checkout and order related pages
const ProtectedRoute = ({ children }) => {
  const { currentUser } = useSelector((state) => state.authReducer);
  const location = useLocation();

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
};

export default ProtectedRoute;
