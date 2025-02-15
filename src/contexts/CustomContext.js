import { createContext, useContext } from "react";

const CustomContext = createContext();

export const useCustom = () => useContext(CustomContext);

const formatCurrency = (price) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(price);
};

export const CustomProvider = ({ children }) => {
  return (
    <CustomContext.Provider value={{ formatCurrency }}>
      {children}
    </CustomContext.Provider>
  );
};
