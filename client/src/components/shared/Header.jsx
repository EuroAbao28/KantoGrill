import React, { Fragment, useState } from "react";
import { FaFire } from "react-icons/fa";
import { RiLogoutCircleLine } from "react-icons/ri";
import { HiOutlineUserCircle, HiOutlineLogout } from "react-icons/hi";
import { useUserContext } from "../../context/UserContextProvider";
import { Dialog, Menu, Transition } from "@headlessui/react";
import classNames from "classnames";
import { useNavigate } from "react-router-dom";

function Header() {
  const { user } = useUserContext();
  const navigate = useNavigate();

  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const toggleLogoutModal = () => {
    setIsLogoutModalOpen(!isLogoutModalOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    navigate("/login");
  };

  return (
    <>
      <div className="flex items-center justify-between px-6 py-2 bg-white shadow-sm">
        <div className="flex items-center ">
          <FaFire className="text-orange-500" />
          <p className="text-xl font-bold text-orange-500">
            Kanto<span className="text-slate-600">Grill</span>
          </p>
        </div>

        <div className="dropdown dropdown-end">
          <div tabIndex="0" role="button" className="btn">
            <div className="flex items-center gap-3 cursor-pointer">
              <div className="flex flex-col">
                <p className="text-sm font-semibold">Orue Abao</p>
                <p className="-mt-1 text-xs text-gray-500">Super Admin</p>
              </div>
              <img
                className="object-cover rounded-full w-11"
                src={user ? user.imageUrl : ""}
                alt="image"
              />
            </div>
          </div>
          <ul
            tabIndex="0"
            className="dropdown-content z-[1] menu p-1   shadow bg-white rounded-sm w-52 mt-3">
            <li>
              <div className="flex items-center justify-between p-2 rounded-sm cursor-pointer hover:bg-slate-100">
                <p className="text-base">Profile</p>
                <HiOutlineUserCircle fontSize={21} />
              </div>
            </li>
            <li>
              <div
                className="flex items-center justify-between p-2 rounded-sm cursor-pointer hover:bg-slate-100"
                onClick={toggleLogoutModal}>
                <p className="text-base">Logout</p>
                <HiOutlineLogout fontSize={21} />
              </div>
            </li>
          </ul>
        </div>
      </div>

      {/* delete modal */}
      <Transition appear show={isLogoutModalOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setIsLogoutModalOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0">
            <div className="fixed inset-0 bg-black/25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex items-center justify-center min-h-full p-2 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95">
                <Dialog.Panel className="p-4 text-left align-middle transition-all transform bg-white rounded shadow-xl text-slate-600">
                  <h1 className="text-lg"> You want to logout?</h1>
                  <div className="flex justify-end gap-4">
                    <button
                      className="px-8 py-2 mt-4 text-base transition-all bg-white rounded shadow-sm cursor-pointer w-fit text-slate-600 active:scale-95 outline outline-1 outline-gray-300 "
                      type="button"
                      onClick={toggleLogoutModal}>
                      Cancel
                    </button>
                    <button
                      className="flex items-center justify-center gap-2 px-8 py-2 mt-4 text-base text-white transition-all bg-red-500 rounded shadow-sm cursor-pointer w-fit active:scale-95"
                      type="submit"
                      onClick={handleLogout}>
                      Logout
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}

export default Header;
