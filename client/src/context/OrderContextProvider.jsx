import { createContext, useContext, useState } from "react";

const OrderContext = createContext();

export const useOrderContext = () => useContext(OrderContext);

export const OrderProvider = ({ children }) => {
  const [order, setOrder] = useState({
    orderedItems: [
      // {
      //   _id:  "10",
      //   name: "dish1",
      //   price: 100,
      //   quantity: 1,
      // },
      // {
      //   _id: "11",
      //   name: "dish2",
      //   price: 40,
      //   quantity: 1,
      // },
    ],
    totalPrice: 0,
    user: "",
  });

  return (
    <OrderContext.Provider value={{ order, setOrder }}>
      {children}
    </OrderContext.Provider>
  );
};
