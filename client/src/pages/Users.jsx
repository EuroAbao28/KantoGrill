import classNames from "classnames";
import React, { Fragment, useEffect, useState } from "react";
import { HiOutlineFilter, HiOutlineSearch, HiPlus } from "react-icons/hi";
import { useUserContext } from "../context/UserContextProvider";
import useGetAllUsers from "../hooks/users/userGetAllUsers";
import { Dialog, Transition } from "@headlessui/react";
import useCreateUser from "../hooks/users/userCreateUser";
import useUpdateUser from "../hooks/users/useUpdateUser";
import toast from "react-hot-toast";
import useDeleteUser from "../hooks/users/useDeleteUser";

function Users() {
  const { user } = useUserContext();

  const { getAllUsersFunction, usersData, isGetAllUsersLoading } =
    useGetAllUsers();
  const { createUserFunction, isCreateUserLoading } = useCreateUser();
  const { updateUserFunction, isUpdateUserLoading } = useUpdateUser();
  const { deleteUserFunction, isDeleteUserLoading } = useDeleteUser();

  // modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchUser, setSearchUser] = useState("");

  // selected user
  const [selectedUser, setSelectedUser] = useState({});

  const [formUser, setFormUser] = useState({
    firstname: "",
    lastname: "",
    username: "",
    adminType: "",
    password: "",
    confirmPassword: "",
    userImage: null,
    userImageURL: null,
  });

  const [updateForm, setUpdateForm] = useState({
    firstname: "",
    lastname: "",
    username: "",
    adminType: "",
    password: "",
    confirmPassword: "",
    userImage: null,
    userImageURL: null,
  });

  // get all users data
  useEffect(() => {
    getAllUsersFunction(searchUser);
  }, [searchUser]);

  // handle search
  const handleSearch = (e) => {
    e.preventDefault();

    setSearchUser(e.target.value);
  };

  // for input field
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormUser((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // for update input field
  const handleChangeUpdate = (e) => {
    const { name, value } = e.target;

    setUpdateForm((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // for file input field
  const handleChangeFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormUser((prevState) => ({
        ...prevState,
        userImage: file,
        userImageURL: URL.createObjectURL(file),
      }));
    } else {
      setFormUser((prevState) => ({
        ...prevState,
        userImage: null,
        userImageURL: null,
      }));
    }
  };

  // for update file field
  const handleChangeFileUpdate = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log(file);
      setUpdateForm((prevState) => ({
        ...prevState,
        userImage: file,
        userImageURL: URL.createObjectURL(file),
      }));
    } else {
      console.log("wala");
      setUpdateForm((prevState) => ({
        ...prevState,
        userImage: null,
        userImageURL: selectedUser._id,
      }));
    }
  };

  // closing and reseting modal
  const toggleCreateModal = () => {
    setIsCreateModalOpen(!isCreateModalOpen);

    // clear data
    setFormUser({
      firstname: "",
      lastname: "",
      username: "",
      adminType: "",
      password: "",
      confirmPassword: "",
      userImage: null,
      userImageURL: null,
    });
  };

  const toggleEditModal = (userData) => {
    // if open, close and clear it
    if (isEditModalOpen) {
      setIsEditModalOpen(false);

      setUpdateForm({
        firstname: "",
        lastname: "",
        username: "",
        adminType: "",
        password: "",
        confirmPassword: "",
        userImage: null,
        userImageURL: null,
      });

      setSelectedUser({});

      return;
    }

    setIsEditModalOpen(true);
    console.log(userData);

    // pass the user data
    setUpdateForm({
      firstname: userData.firstname,
      lastname: userData.lastname,
      username: userData.username,
      adminType: userData.adminType,
      password: "",
      confirmPassword: "",
      userImage: null,
      userImageURL: userData.imageUrl,
    });

    // set the original imageURl
    setSelectedUser(userData);
  };

  const toggleDeleteModal = (userData) => {
    if (isDeleteModalOpen) {
      setIsDeleteModalOpen(false);

      // empty the selectedUser
      setSelectedUser({});
      return;
    }

    setIsDeleteModalOpen(true);

    setSelectedUser(userData);
  };

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  // creating new user
  const handleCreate = async (e) => {
    e.preventDefault();

    try {
      const response = await createUserFunction(formUser);

      toast.success(response);

      getAllUsersFunction();
      setIsCreateModalOpen(false);
    } catch (error) {
      console.log(error);
      toast.error(error);
    }
  };

  // updating user
  const handleUpdate = async (e) => {
    e.preventDefault();
    console.log(selectedUser._id, updateForm);

    try {
      const response = await updateUserFunction(selectedUser._id, updateForm);

      toast.success(response.data.message);
      console.log(response.data);

      getAllUsersFunction();
      setIsEditModalOpen(false);

      // empty the selectedUser
      setSelectedUser({});
    } catch (error) {
      toast.error(error);
      console.log(error);
    }
  };

  // delete user
  const handleDelete = async (e) => {
    e.preventDefault();

    try {
      const response = await deleteUserFunction(selectedUser._id);

      toast.success(response);

      getAllUsersFunction();
      setIsDeleteModalOpen(false);

      // empty the selectedUser
      setSelectedUser({});
    } catch (error) {
      toast.error(error);
      console.log(error);
    }
  };

  return (
    <>
      <div className="flex flex-1 gap-4 p-4">
        <div className="flex flex-col flex-1 gap-2 p-4 bg-white">
          {/* header */}
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-xl font-bold">Users</h1>
            <form className="flex items-center w-[20rem] gap-2 p-2 text-sm bg-white rounded outline outline-1 outline-gray-300 mr-auto">
              <HiOutlineSearch />
              <input
                className="w-full bg-white focus:outline-none"
                type="text"
                placeholder="Search an user"
                value={searchUser}
                onChange={(e) => setSearchUser(e.target.value)}
              />
            </form>

            <button
              onClick={toggleCreateModal}
              disabled={user?.adminType !== "super_admin"}
              className="flex items-center gap-1 p-2 text-sm text-white transition-all bg-green-500 rounded shadow-sm cursor-pointer active:scale-95">
              <HiPlus />
              Create
            </button>
          </div>

          {/* filter div */}
          <div className="relative">
            <div
              className={classNames(
                isFilterOpen ? " py-4 h-auto" : "h-0",
                "bg-white flex flex-col gap-2 overflow-hidden px-4 shadow right-0  top-0 absolute z-10 transition-all rounded"
              )}>
              <h1>Filter Options</h1>
              <form className="flex gap-4 text-xs">
                <div className="flex flex-col gap-1">
                  <label htmlFor="category">Category</label>
                  <select
                    name="category"
                    id="category"
                    className="p-1 rounded-sm outline outline-1 outline-gray-300">
                    <option value="">All</option>
                    <option value="appetizer">Appetizer</option>
                    <option value="soup">Soup</option>
                    <option value="main_course">Main Course</option>
                    <option value="dessert">Dessert</option>
                    <option value="drinks">Drinks</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="status">Status</label>
                  <select
                    name="status"
                    id="status"
                    className="p-1 rounded-sm outline outline-1 outline-gray-300">
                    <option value="">All</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="sortBy">Sort by</label>
                  <select
                    name="sortBy"
                    id="sortBy"
                    className="p-1 rounded-sm outline outline-1 outline-gray-300">
                    <option value="createdAt">Date</option>
                    <option value="sales">Sales</option>
                    <option value="price">Price</option>
                    <option value="stocks">Stocks</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="sortOrder">Sort Order</label>
                  <select
                    name="sortOrder"
                    id="sortOrder"
                    className="p-1 rounded-sm outline outline-1 outline-gray-300">
                    <option value="descending">Descending</option>
                    <option value="ascending">Ascending</option>
                  </select>
                </div>
              </form>
            </div>
          </div>

          {/* table */}
          <div className="relative flex-1 overflow-x-auto ">
            {isGetAllUsersLoading ? (
              <div className="flex items-center justify-center h-full gap-3 ">
                <span className=" loading loading-spinner"></span>
                <p className="text-lg">Loading...</p>
              </div>
            ) : (
              <div className="absolute w-full ">
                <table className="relative w-full">
                  <thead className="sticky top-0 text-sm bg-white ">
                    <tr className="text-left">
                      <th></th>
                      <th>Image</th>
                      <th>Username</th>
                      <th>Firstname</th>
                      <th>Lastname</th>
                      <th>Admin type</th>
                      <th>Date added</th>
                      <th>Created by</th>
                      <th className="text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usersData.map((userDetail, index) => (
                      <tr
                        key={index}
                        className="text-sm border-t border-gray-300 cursor-pointer hover:bg-gray-100">
                        <td className="px-4 text-xs font-bold">{index + 1}</td>
                        <td className="py-2">
                          <img
                            className="object-cover w-12 aspect-square"
                            src={userDetail.imageUrl}
                            alt="image"
                          />
                        </td>
                        <td>{userDetail.username}</td>
                        <td>{userDetail.firstname}</td>
                        <td>{userDetail.lastname}</td>
                        <td className="capitalize">
                          {userDetail.adminType.replace(/_/g, " ")}
                        </td>
                        <td>
                          {new Date(userDetail.createdAt).toLocaleDateString()}
                        </td>
                        <td>{userDetail.createdBy}</td>
                        <td>
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => toggleEditModal(userDetail)}
                              disabled={user?.adminType !== "super_admin"}
                              className="flex-1 px-2 py-1 text-green-500 transition-all bg-green-100 rounded hover:bg-green-500 hover:text-white">
                              Edit
                            </button>
                            <button
                              onClick={() => toggleDeleteModal(userDetail)}
                              disabled={user?.adminType !== "super_admin"}
                              className="flex-1 px-2 py-1 text-red-500 transition-all bg-red-100 rounded hover:bg-red-500 hover:text-white">
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* create modal */}
      <Transition appear show={isCreateModalOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => {
            return;
          }}>
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
            <div className="flex items-center justify-center min-h-full p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95">
                <Dialog.Panel className="w-[50rem] p-6 text-left align-middle transition-all transform bg-white rounded shadow-xl">
                  <Dialog.Title
                    as="h3"
                    className="text-2xl font-medium leading-6 text-center text-gray-900">
                    Create New User
                  </Dialog.Title>
                  <form className="grid gap-4 mt-8" onSubmit={handleCreate}>
                    <div className="flex gap-4">
                      <div className="w-2/5 aspect-square">
                        <div className="w-full h-full overflow-hidden rounded ">
                          {formUser.userImageURL === null ? (
                            <div
                              data-theme="light"
                              className="w-full h-full skeleton bg-slate-50"></div>
                          ) : (
                            <img
                              className="object-cover w-full h-full "
                              src={formUser.userImageURL}
                              alt="Product"
                            />
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col flex-1 gap-2">
                        <div className="flex gap-4">
                          <InputField
                            label={"Firstname"}
                            id={"firstname"}
                            name={"firstname"}
                            type={"text"}
                            value={formUser.firstname}
                            onChange={handleChange}
                          />
                          <InputField
                            label={"Lastname"}
                            id={"lastname"}
                            name={"lastname"}
                            type={"text"}
                            value={formUser.lastname}
                            onChange={handleChange}
                          />
                        </div>

                        <div className="flex gap-4">
                          <InputField
                            label={"Username"}
                            id={"username"}
                            name={"username"}
                            type={"text"}
                            value={formUser.username}
                            onChange={handleChange}
                          />
                          <div className="flex flex-col flex-1 gap-2">
                            <label
                              className="text-base text-slate-600"
                              htmlFor="adminType">
                              Admin Type
                            </label>
                            <select
                              className="px-3 py-2 text-base bg-white rounded outline outline-1 outline-gray-300 text-slate-600"
                              id="adminType"
                              onChange={handleChange}
                              name="adminType"
                              value={formUser.adminType}>
                              <option value="" disabled>
                                Select
                              </option>
                              <option value="cashier">Cashier</option>
                              <option value="admin">Admin</option>
                              <option value="super_admin">Super Admin</option>
                            </select>
                          </div>
                        </div>

                        <div className="flex gap-4">
                          <InputField
                            label={"Password"}
                            id={"password"}
                            name={"password"}
                            type={"password"}
                            value={formUser.password}
                            onChange={handleChange}
                          />
                          <InputField
                            label={"Confirm Password"}
                            id={"confirmPassword"}
                            name={"confirmPassword"}
                            type={"password"}
                            value={formUser.confirmPassword}
                            onChange={handleChange}
                          />
                        </div>

                        <InputField
                          label={"User Image"}
                          type={"file"}
                          name={"userImage"}
                          accept="image/*"
                          onChange={handleChangeFile}
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-4">
                      <button
                        className="px-8 py-2 mt-4 text-base transition-all bg-white rounded shadow-sm cursor-pointer w-fit text-slate-600 active:scale-95 outline outline-1 outline-gray-300 "
                        type="button"
                        onClick={toggleCreateModal}>
                        Cancel
                      </button>
                      <button
                        className="flex items-center justify-center gap-2 px-8 py-2 mt-4 text-base text-white transition-all bg-green-500 rounded shadow-sm cursor-pointer w-fit active:scale-95"
                        type="submit"
                        disabled={isCreateUserLoading}>
                        {isCreateUserLoading ? (
                          <>
                            <span className="loading loading-spinner loading-sm"></span>
                            Creating
                          </>
                        ) : (
                          "Create"
                        )}
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* edit modal */}
      <Transition appear show={isEditModalOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => {
            return;
          }}>
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
            <div className="flex items-center justify-center min-h-full p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95">
                <Dialog.Panel className="w-[50rem] p-6 text-left align-middle transition-all transform bg-white rounded shadow-xl">
                  <Dialog.Title
                    as="h3"
                    className="text-2xl font-medium leading-6 text-center text-gray-900">
                    Edit User
                  </Dialog.Title>
                  <form className="grid gap-4 mt-8" onSubmit={handleUpdate}>
                    <div className="flex gap-4">
                      <div className="w-2/5 aspect-square">
                        <div className="w-full h-full overflow-hidden rounded ">
                          <img
                            className="object-cover w-full h-full "
                            src={updateForm.userImageURL}
                            alt="User Image"
                          />
                        </div>
                      </div>
                      <div className="flex flex-col flex-1 gap-2">
                        <div className="flex gap-4">
                          <InputField
                            label={"Firstname"}
                            id={"firstname"}
                            name={"firstname"}
                            type={"text"}
                            value={updateForm.firstname}
                            onChange={handleChangeUpdate}
                          />
                          <InputField
                            label={"Lastname"}
                            id={"lastname"}
                            name={"lastname"}
                            type={"text"}
                            value={updateForm.lastname}
                            onChange={handleChangeUpdate}
                          />
                        </div>

                        <div className="flex gap-4">
                          <InputField
                            label={"Username"}
                            id={"username"}
                            name={"username"}
                            type={"text"}
                            value={updateForm.username}
                            onChange={handleChangeUpdate}
                          />
                          <div className="flex flex-col flex-1 gap-2">
                            <label
                              className="text-base text-slate-600"
                              htmlFor="adminType">
                              Admin Type
                            </label>
                            <select
                              className="px-3 py-2 text-base bg-white rounded outline outline-1 outline-gray-300 text-slate-600"
                              id="adminType"
                              onChange={handleChangeUpdate}
                              name="adminType"
                              defaultValue={updateForm.adminType}>
                              <option value="cashier">Cashier</option>
                              <option value="admin">Admin</option>
                              <option value="super_admin">Super Admin</option>
                            </select>
                          </div>
                        </div>

                        <div className="flex gap-4">
                          <InputField
                            label={"Password"}
                            id={"password"}
                            name={"password"}
                            type={"password"}
                            value={updateForm.password}
                            onChange={handleChangeUpdate}
                          />
                          <InputField
                            label={"Confirm Password"}
                            id={"confirmPassword"}
                            name={"confirmPassword"}
                            type={"password"}
                            value={updateForm.confirmPassword}
                            onChange={handleChangeUpdate}
                          />
                        </div>

                        <InputField
                          label={"User Image"}
                          type={"file"}
                          name={"userImage"}
                          accept="image/*"
                          onChange={handleChangeFileUpdate}
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-4">
                      <button
                        className="px-8 py-2 mt-4 text-base transition-all bg-white rounded shadow-sm cursor-pointer w-fit text-slate-600 active:scale-95 outline outline-1 outline-gray-300 "
                        type="button"
                        onClick={toggleEditModal}>
                        Cancel
                      </button>
                      <button
                        className="flex items-center justify-center gap-2 px-8 py-2 mt-4 text-base text-white transition-all bg-green-500 rounded shadow-sm cursor-pointer w-fit active:scale-95"
                        type="submit"
                        disabled={isUpdateUserLoading}>
                        {isUpdateUserLoading ? (
                          <>
                            <span className="loading loading-spinner loading-sm"></span>
                            Saving
                          </>
                        ) : (
                          "Save"
                        )}
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* edit modal */}
      <Transition appear show={isDeleteModalOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => {
            return;
          }}>
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
            <div className="flex items-center justify-center min-h-full p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95">
                <Dialog.Panel className="p-6 text-left align-middle transition-all transform bg-white rounded shadow-xl ">
                  <Dialog.Title
                    as="h3"
                    className="mb-6 text-2xl font-medium leading-6 text-center text-gray-900">
                    Delete this User?
                  </Dialog.Title>
                  <div>
                    <div className="flex gap-4 text-gray-900">
                      <img
                        className="object-cover w-24 rounded-sm aspect-square"
                        src={selectedUser.imageUrl}
                        alt="userImage"
                      />
                      <div>
                        <div>
                          <p>
                            <span className="font-semibold ">Fullname: </span>
                            {selectedUser.firstname} {selectedUser.lastname}
                          </p>

                          <p className="capitalize">
                            <span className="font-semibold ">Admin Type: </span>
                            {selectedUser.adminType}
                          </p>
                        </div>
                        <div className="flex justify-end gap-4">
                          <button
                            className="px-8 py-2 mt-4 text-base transition-all bg-white rounded shadow-sm cursor-pointer w-fit text-slate-600 active:scale-95 outline outline-1 outline-gray-300 "
                            type="button"
                            onClick={toggleDeleteModal}>
                            Cancel
                          </button>
                          <button
                            className="flex items-center justify-center gap-2 px-8 py-2 mt-4 text-base text-white transition-all bg-red-500 rounded shadow-sm cursor-pointer w-fit active:scale-95"
                            type="button"
                            onClick={handleDelete}>
                            {isDeleteUserLoading ? (
                              <>
                                <span className="loading loading-spinner loading-sm"></span>
                                Deleting
                              </>
                            ) : (
                              "Delete"
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
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

const InputField = ({ label, name, type, id, value, onChange }) => {
  return (
    <div className="flex flex-col flex-1 gap-2">
      <label htmlFor={id} className="text-base text-slate-600">
        {label}
      </label>
      <input
        className="w-full px-3 py-2 text-base bg-white rounded outline outline-1 outline-gray-300 text-slate-600"
        type={type}
        name={name}
        id={id}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default Users;
