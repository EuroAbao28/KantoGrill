import { useState } from "react";
import axios from "axios";
import { productRoute } from "../utils/APIRoutes";

const useDeleteProduct = () => {
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  const deleteProductFunction = async (productId) => {
    setIsDeleteLoading(true);

    try {
      // Make your API call to delete the product
      const userToken = localStorage.getItem("userToken");
      const response = await axios.delete(`${productRoute}/${productId}`, {
        headers: { Authorization: `Bearer ${userToken}` },
      });

      setIsDeleteLoading(false);
      return response.data.message;
    } catch (error) {
      setIsDeleteLoading(false);
      setDeleteError(error.response.data.message);
      throw error.response.data.message;
    }
  };

  return { deleteProductFunction, isDeleteLoading, deleteError };
};

export default useDeleteProduct;
