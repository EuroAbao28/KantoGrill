import axios from "axios";
import { useState } from "react";
import { userRoute } from "../../utils/APIRoutes";

const useGetAllUsers = () => {
  const [usersData, setUsersData] = useState([]);
  const [isGetAllUsersLoading, setIsGetAllUsersLoading] = useState(false);

  const getAllUsersFunction = async (search) => {
    setIsGetAllUsersLoading(true);

    try {
      const userToken = localStorage.getItem("userToken");

      const response = await axios.get(userRoute, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
        params: { search: search },
      });

      setUsersData(response.data);
      setIsGetAllUsersLoading(false);
    } catch (error) {
      setIsGetAllUsersLoading(false);
      throw error.response.data.message;
    }
  };

  return { getAllUsersFunction, usersData, isGetAllUsersLoading };
};

export default useGetAllUsers;
