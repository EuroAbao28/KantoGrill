import axios from "axios";
import { useState } from "react";
import { userRoute } from "../../utils/APIRoutes";

const useCreateUser = () => {
  const [isCreateUserLoading, setIsCreateUserLoading] = useState(false);

  const createUserFunction = async (userData) => {
    setIsCreateUserLoading(true);

    try {
      const userToken = localStorage.getItem("userToken");

      const formData = new FormData();

      formData.append("firstname", userData.firstname);
      formData.append("lastname", userData.lastname);
      formData.append("username", userData.username);
      formData.append("adminType", userData.adminType);
      formData.append("password", userData.password);
      formData.append("confirmPassword", userData.confirmPassword);
      formData.append("userImage", userData.userImage);

      const response = await axios.post(userRoute, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${userToken}`,
        },
      });

      setIsCreateUserLoading(false);
      return response.data.message;
    } catch (error) {
      setIsCreateUserLoading(false);
      throw error.response.data.message;
    }
  };

  return {
    createUserFunction,
    isCreateUserLoading,
    setIsCreateUserLoading,
  };
};

export default useCreateUser;
