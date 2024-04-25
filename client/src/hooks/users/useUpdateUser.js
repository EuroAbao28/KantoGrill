import axios from "axios";
import { useState } from "react";
import { userRoute } from "../../utils/APIRoutes";

const useUpdateUser = () => {
  const [isUpdateUserLoading, setIsUpdateUserLoading] = useState(false);

  const updateUserFunction = async (userId, updatedData) => {
    setIsUpdateUserLoading(true);

    try {
      const userToken = localStorage.getItem("userToken");

      const formData = new FormData();

      formData.append("firstname", updatedData.firstname);
      formData.append("lastname", updatedData.lastname);
      formData.append("username", updatedData.username);
      formData.append("adminType", updatedData.adminType);
      formData.append("password", updatedData.password);
      formData.append("confirmPassword", updatedData.confirmPassword);
      formData.append("userImage", updatedData.userImage);

      const response = await axios.patch(`${userRoute}/${userId}`, formData, {
        headers: { Authorization: `Bearer ${userToken}` },
      });

      setIsUpdateUserLoading(false);
      return response;
    } catch (error) {
      setIsUpdateUserLoading(false);
      throw error.response.data.message;
    }
  };

  return { updateUserFunction, isUpdateUserLoading, setIsUpdateUserLoading };
};

export default useUpdateUser;
