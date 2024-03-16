import axios from "axios";
import { useState } from "react";
import { transactionRoute } from "../../utils/APIRoutes";

const useGetAllTransactions = () => {
  const [isGetAllTransactionsLoading, setIsGetAllTransactionsLoading] =
    useState(false);

  const getAllTransactionsFunction = async () => {
    setIsGetAllTransactionsLoading(true);

    try {
      const userToken = localStorage.getItem("userToken");

      const response = await axios.get(transactionRoute, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });

      setIsGetAllTransactionsLoading(false);
      return response;
    } catch (error) {
      setIsGetAllTransactionsLoading(false);
      throw error.response.data.message;
    }
  };

  return { getAllTransactionsFunction, isGetAllTransactionsLoading };
};

export default useGetAllTransactions;
