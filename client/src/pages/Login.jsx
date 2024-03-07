import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaFire } from "react-icons/fa";
import { loginRoute } from "../utils/APIRoutes";
import toast from "react-hot-toast";

function Login() {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post(loginRoute, form);

      localStorage.setItem("userToken", response.data.token);

      toast.success(response.data.message);
      setIsLoading(false);

      navigate("/home");
    } catch (error) {
      setIsLoading(false);
      toast.error(error.response.data.message);
      return;
    }
  };
  return (
    <div className="flex items-center justify-center w-screen h-screen bg-white">
      <div className="w-[20rem]">
        <form onSubmit={handleLogin} className="flex flex-col gap-6">
          <div className="flex items-center justify-center gap-1">
            <FaFire className="-mt-1 text-3xl text-orange-500" />
            <h1 className="text-3xl font-bold text-center text-orange-500">
              Kanto<span className="text-slate-600">Grill</span>
            </h1>
          </div>
          <input
            className="w-full p-2 text-base bg-white border rounded border-1 border-slate-400 text-slate-600 focus:outline-none"
            type="text"
            placeholder="Username"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
          />

          <input
            className="w-full p-2 text-base bg-white border rounded border-1 border-slate-400 text-slate-600 focus:outline-none"
            type="text"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <button
            type="submit"
            className="flex items-center justify-center gap-3 p-2 text-base text-white transition-transform bg-orange-500 rounded focus:outline-none active:scale-95">
            {isLoading ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Logging in
              </>
            ) : (
              "Login"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
