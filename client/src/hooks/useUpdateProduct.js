import axios from "axios";
import { useState } from "react";
import { productRoute } from "../utils/APIRoutes";

const useUpdateProduct = () => {
  const [isUpdateLoading, setIsUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState(null);

  const updateProductFunction = async (productId, updatedData) => {
    setIsUpdateLoading(true);

    try {
      const userToken = localStorage.getItem("userToken");

      const formData = new FormData();

      formData.append("name", updatedData.name);
      formData.append("price", updatedData.price);
      formData.append("stocks", updatedData.stocks);
      formData.append("category", updatedData.category);
      formData.append("status", updatedData.status);
      formData.append("productImage", updatedData.productImage);

      const response = await axios.patch(
        `${productRoute}/${productId}`,
        formData,
        { headers: { Authorization: `Bearer ${userToken}` } }
      );

      setIsUpdateLoading(false);
      return response;
    } catch (error) {
      setIsUpdateLoading(false);
      setUpdateError(error.response.data.mesage);
      throw error.response.data.message;
    }
  };

  return { updateProductFunction, isUpdateLoading, updateError };
};

export default useUpdateProduct;
