import axios from "axios";
import { useState } from "react";
import { userRoute } from "../../utils/APIRoutes";

const useDeleteUser = () => {
  const [isDeleteUserLoading, setIsDeleteUserLoading] = useState(false);

  const deleteUserFunction = async (userId) => {
    setIsDeleteUserLoading(true);

    try {
      const userToken = localStorage.getItem("userToken");
      const response = await axios.delete(`${userRoute}/${userId}`, {
        headers: { Authorization: `Bearer ${userToken}` },
      });

      setIsDeleteUserLoading(false);
      return response.data.message;
    } catch (error) {
      setIsDeleteUserLoading(false);
      throw error.response.data.message;
    }
  };

  return { deleteUserFunction, isDeleteUserLoading };
};

export default useDeleteUser;
