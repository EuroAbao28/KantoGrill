import React, { useEffect, useState } from "react";
import useGetAllProducts from "../../hooks/products/useGetAllProducts";
import { useOrderContext } from "../../context/OrderContextProvider";

function Appetizer() {
  const { order, setOrder } = useOrderContext();
  const { getProductsFunction, productData, isGetLoading } =
    useGetAllProducts();

  const filterOptions = {
    category: "appetizer",
    status: "active",
    sortBy: "createdAt",
    sortOrder: "descending",
  };

  // get appetizer products
  useEffect(() => {
    getProductsFunction(filterOptions);
  }, []);

  const handleAddtoCart = (item) => {
    const newEntry = {
      productId: item._id,
      name: item.name,
      price: item.price,
      quantity: 1,
    };

    // it return the index
    // it return -1 if false
    const existingItemIndex = order.orderedItems.findIndex(
      (currentOrder) => currentOrder.productId === item._id
    );

    // if wala pa
    if (existingItemIndex === -1) {
      console.log("wala pa");

      const updatedOrder = { ...order };

      updatedOrder.totalPrice = updatedOrder.totalPrice + newEntry.price;

      updatedOrder.orderedItems = [...updatedOrder.orderedItems, newEntry];

      setOrder(updatedOrder);

      return;
    } else {
      console.log("meron na");

      // stop if the stocks === order quantity
      if (item.stocks === order.orderedItems[existingItemIndex].quantity)
        return;

      const updatedOrder = { ...order };

      // add quantity to the index
      updatedOrder.orderedItems[existingItemIndex].quantity += 1;

      // itirate all the item and sum all the total price by price x quantity
      updatedOrder.totalPrice = updatedOrder.orderedItems.reduce(
        (sum, orderedItems) => sum + orderedItems.price * orderedItems.quantity,
        0
      );

      setOrder(updatedOrder);
    }
  };

  return (
    <>
      {isGetLoading ? (
        <div className="flex items-center justify-center h-full gap-3">
          <span className=" loading loading-spinner"></span>
          <p className="text-lg">Loading...</p>
        </div>
      ) : (
        <div className="relative flex-1 overflow-y-auto ">
          <div className="absolute grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {productData.map((item) => (
              <div
                onClick={() => handleAddtoCart(item)}
                key={item.name}
                className="relative flex flex-col transition-all bg-white rounded-lg shadow-sm cursor-pointer hover:-translate-y-1 ">
                <span className="absolute flex items-center justify-center px-2 font-bold text-white bg-green-500 rounded right-2 top-2 outline ">
                  ₱{item.price}
                </span>
                <div className="h-24 overflow-hidden rounded-t-lg">
                  <img
                    className="object-cover w-full h-full"
                    src={item.imageUrl}
                    alt="image"
                  />
                </div>
                <h1 className="p-4 text-sm font-medium truncate">
                  {item.name}
                </h1>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export default Appetizer;
