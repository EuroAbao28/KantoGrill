import axios from "axios";
import { useState } from "react";
import { transactionRoute } from "../../utils/APIRoutes";

const useGetTransactionByMonth = () => {
  const [isGetTransactionByMonthLoading, setIsGetTransactionByMonthLoading] =
    useState(false);

  const getTransactionByMonthFunction = async () => {
    setIsGetTransactionByMonthLoading(true);

    try {
      const userToken = localStorage.getItem("userToken");

      const response = await axios.get(`${transactionRoute}/byMonth`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });

      setIsGetTransactionByMonthLoading(false);
      return response;
    } catch (error) {
      setIsGetTransactionByMonthLoading(false);
      throw error.response.data.message;
    }
  };

  return { getTransactionByMonthFunction, isGetTransactionByMonthLoading };
};

export default useGetTransactionByMonth;
