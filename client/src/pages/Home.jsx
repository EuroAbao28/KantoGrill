import React, { useEffect, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { CATEGORY_ITEMS } from "../constants/homeNav";
import classNames from "classnames";
import { HiXCircle } from "react-icons/hi";
import { useOrderContext } from "../context/OrderContextProvider";
import { useUserContext } from "../context/UserContextProvider";
import useNewTransaction from "../hooks/transactions/useNewTransactions";
import toast from "react-hot-toast";

function Home() {
  const { pathname } = useLocation();

  const { order, setOrder } = useOrderContext();
  const { user, setUser } = useUserContext();

  const { newTransactionFunction, isNewTransactionLoading } =
    useNewTransaction();

  const [amountPaid, setAmountPaid] = useState("");
  const [change, setChange] = useState(0);

  const handleDecreaseQuantity = (item, index) => {
    // if last quantity, then remove it
    if (order.orderedItems[index].quantity === 1) {
      console.log("alisin na");

      const updatedOrder = { ...order };

      //
      updatedOrder.orderedItems = updatedOrder.orderedItems.filter(
        (orderedItem) => orderedItem.productId !== item.productId
      );

      updatedOrder.totalPrice = updatedOrder.orderedItems.reduce(
        (sum, orderedItems) => sum + orderedItems.price * orderedItems.quantity,
        0
      );

      setOrder(updatedOrder);
    } else {
      const updatedOrder = { ...order };

      updatedOrder.orderedItems[index].quantity -= 1;

      // itirate all the item and sum all the total price by price x quantity
      updatedOrder.totalPrice = updatedOrder.orderedItems.reduce(
        (sum, orderedItems) => sum + orderedItems.price * orderedItems.quantity,
        0
      );

      setOrder(updatedOrder);
    }
  };

  const handleClearAll = () => {
    setOrder({
      orderedItems: [],
      totalPrice: 0,
    });

    setAmountPaid("");
    setChange(0);
  };

  const handlePay = async () => {
    const transactionDetails = { ...order };

    transactionDetails.user = user._id;
    transactionDetails.amountPaid = amountPaid;
    transactionDetails.change = change;

    try {
      const response = await newTransactionFunction(transactionDetails);

      console.log(transactionDetails);
      toast.success(response.data.message);
    } catch (error) {
      console.log(transactionDetails);
      toast.error(error);
      console.log(error);
    }
  };

  useEffect(() => {
    setChange(amountPaid - order.totalPrice);
  }, [amountPaid, order]);

  useEffect(() => {
    if (order.orderedItems.length === 0) return setAmountPaid("");
  }, [order]);

  useEffect(() => {
    console.log(order);
  }, [order]);

  return (
    <div className="flex flex-1 gap-4 p-4">
      <div className="flex flex-col flex-1 gap-4">
        <div className="flex gap-2 p-3 bg-white rounded shadow-sm">
          {CATEGORY_ITEMS.map((item) => (
            <Link
              key={item.label}
              to={item.path}
              className={classNames(
                pathname.split("/")[2] === item.path
                  ? "bg-orange-50 text-orange-500 outline outline-2 outline-orange-500"
                  : "hover:bg-slate-50",
                "text-sm   px-2 py-1 rounded"
              )}>
              <p className="text-nowrap">{item.label}</p>
            </Link>
          ))}
        </div>
        <Outlet />
      </div>
      <div className="w-[25rem] bg-white rounded p-4 shadow-sm flex flex-col">
        {/* header */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-300">
          <h1 className="text-lg font-semibold">Current Order</h1>
          <button
            onClick={handleClearAll}
            className="px-2 py-1 text-xs font-semibold text-red-400 rounded bg-red-50 outline outline-1 outline-red-400">
            CLEAR
          </button>
        </div>
        {/* order list */}
        <div className="relative flex-1 p-2 mt-2 overflow-y-auto">
          <div className="absolute left-0 right-0 flex flex-col">
            {order.orderedItems.map((item, index) => (
              <div
                key={item.productId}
                className="flex items-center w-full gap-2 px-3 py-2 odd:bg-slate-100">
                <p className="mr-2 text-xs font-bold ">{index + 1}</p>
                <p className="flex-1 text-sm line-clamp-1 hover:line-clamp-none">
                  {item.name}
                </p>
                <p className="text-xs font-light ">Qty</p>
                <input
                  type="number"
                  value={item.quantity}
                  disabled
                  className="w-8 py-1 text-xs text-center rounded-sm outline outline-1 outline-gray-400 hide-number-buttons"
                />
                <p className="w-12 font-semibold text-center ">₱{item.price}</p>

                <button
                  onClick={() => handleDecreaseQuantity(item, index)}
                  className="p-1 transition-all rounded-full text-slate-600 hover:bg-gray-200">
                  <HiXCircle />
                </button>
              </div>
            ))}
            {/* <div className="flex items-center w-full gap-2 px-3 py-2 odd:bg-slate-100">
              <p className="mr-2 text-xs font-bold ">1</p>
              <p className="flex-1 text-sm line-clamp-1 hover:line-clamp-none">
                Product Name
              </p>
              <p className="text-xs font-light ">Qty</p>
              <input
                type="number"
                className="w-8 py-1 text-xs text-center rounded-sm outline outline-1 outline-gray-400 hide-number-buttons"
              />
              <p className="w-12 font-semibold text-center ">₱120</p>

              <button className="p-1 transition-all rounded-full text-slate-600 hover:bg-gray-200">
                <HiXCircle />
              </button>
            </div> */}
          </div>
        </div>
        {/* bottom */}
        <div className="flex flex-col gap-2 pt-3 ">
          <div className="flex justify-between ">
            <p>Total</p>
            <p className="w-40 text-center border-b border-gray-400 hide-number-buttons focus:outline-none">
              {order.totalPrice > 0 && order.totalPrice?.toLocaleString()}
            </p>
          </div>
          <div className="flex justify-between">
            <p>Amount Paid</p>
            <input
              type="number"
              value={amountPaid}
              onChange={(e) => setAmountPaid(e.target.value)}
              className="w-40 text-center border-b border-gray-400 hide-number-buttons focus:outline-none"
            />
          </div>
          <div className="flex justify-between">
            <p>Change</p>
            <p className="w-40 text-center border-b border-gray-400 hide-number-buttons focus:outline-none">
              {amountPaid >= order.totalPrice ? change?.toFixed(2) : "0.00"}
            </p>
          </div>
          <div className="flex gap-2 mt-2">
            <button
              onClick={handlePay}
              className="flex-1 p-2 font-semibold text-white transition-all bg-orange-500 rounded-sm shadow active:scale-x-95">
              Pay
            </button>
            <button className="flex-1 p-2 font-semibold text-white transition-all bg-green-500 rounded-sm shadow active:scale-95">
              Print
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
