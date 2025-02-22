// AuthWrapper.jsx
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setupAuthListener } from "../reducers/AuthReducer";

export const AuthWrapper = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = dispatch(setupAuthListener());
    return () => unsubscribe();
  }, [dispatch]);

  return children;
};
