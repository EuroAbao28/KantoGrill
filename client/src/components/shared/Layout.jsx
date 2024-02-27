import React, { useEffect } from "react";
import Header from "./Header";
import SideNav from "./SideNav";
import { Outlet, useNavigate } from "react-router-dom";
import { useUserContext } from "../../context/UserContextProvider";
import axios from "axios";
import toast from "react-hot-toast";

function Layout() {
  const navigate = useNavigate();
  const { setUser } = useUserContext();

  // create a loading screen like Autheticating...
  // pagtapos ng login
  // conditional rendiring

  useEffect(() => {
    const check = async () => {
      try {
        const userToken = localStorage.getItem("userToken");

        const response = await axios.get(
          "http://localhost:5000/api/admin/checkUser",
          {
            headers: { Authorization: `Bearer ${userToken}` },
          }
        );

        setUser(response.data.userData);
      } catch (error) {
        console.log(error);
        navigate("/login");
        toast.error(error.response.data.message);
      }
    };
    check();
  }, []);
  return (
    <div
      data-theme="light"
      className="flex flex-col w-screen h-screen text-slate-600 bg-slate-100">
      <Header />
      <div className="flex flex-1">
        <SideNav />
        <Outlet />
      </div>
    </div>
  );
}

export default Layout;
