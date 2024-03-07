import axios from "axios";
import { useState } from "react";
import { transactionRoute } from "../../utils/APIRoutes";

const useNewTransaction = () => {
  const [isNewTransactionLoading, setIsNewTransactionLoading] = useState(false);

  const newTransactionFunction = async (transactionDetails) => {
    setIsNewTransactionLoading(true);

    try {
      const userToken = localStorage.getItem("userToken");

      const response = await axios.post(transactionRoute, transactionDetails, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });

      setIsNewTransactionLoading(false);
      return response;
    } catch (error) {
      setIsNewTransactionLoading(false);
      throw error.response.data.message;
    }
  };

  return { newTransactionFunction, isNewTransactionLoading };
};

export default useNewTransaction;
