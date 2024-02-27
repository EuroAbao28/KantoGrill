import axios from "axios";
import { productRoute } from "../utils/APIRoutes";
import toast from "react-hot-toast";
import { useState } from "react";

const useCreateProduct = () => {
  const [isCreateLoading, setIsCreateLoading] = useState(false);
  const [createError, setCreateError] = useState(null);

  const createProductFunction = async (productData) => {
    setIsCreateLoading(true);

    try {
      const userToken = localStorage.getItem("userToken");

      const formData = new FormData();

      formData.append("name", productData.name);
      formData.append("price", productData.price);
      formData.append("stocks", productData.stocks);
      formData.append("category", productData.category);
      formData.append("status", productData.status);
      formData.append("productImage", productData.productImage);

      const response = await axios.post(productRoute, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${userToken}`,
        },
      });

      setIsCreateLoading(false);
      return response.data.message;
    } catch (error) {
      setIsCreateLoading(false);
      setCreateError(error.response.data.message);
      throw error.response.data.message;
    }
  };

  return {
    createProductFunction,
    setIsCreateLoading,
    isCreateLoading,
    createError,
  };
};

export default useCreateProduct;
