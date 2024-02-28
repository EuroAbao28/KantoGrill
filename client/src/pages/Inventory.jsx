import React, { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { HiOutlineSearch, HiOutlineFilter, HiPlus } from "react-icons/hi";
import axios from "axios";
import { productRoute } from "../utils/APIRoutes";
import toast from "react-hot-toast";
import useGetAllProducts from "../hooks/useGetAllProducts";
import sampleImage from "../images/dummy.jpg";
import className from "classnames";
import useDeleteProduct from "../hooks/useDeleteProduct";
import useCreateProduct from "../hooks/useCreateProduct";
import useUpdateProduct from "../hooks/useUpdateProduct";
import useSearchProduct from "../hooks/userSearchProduct";

function Inventory() {
  const [filterOptions, setFilterOptions] = useState({
    category: "",
    status: "",
    sortBy: "createdAt",
    sortOrder: "descending",
    searchInput: "",
  });

  const { getProductsFunction, productData, isGetLoading } =
    useGetAllProducts();
  const {
    createProductFunction,
    isCreateLoading,
    setIsCreateLoading,
    createError,
  } = useCreateProduct();
  const { deleteProductFunction, isDeleteLoading, deleteError } =
    useDeleteProduct();
  const { updateProductFunction, isUpdateLoading, updateError } =
    useUpdateProduct();

  // modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // for selecting product to the table
  const [selectedProduct, setSelectProduct] = useState({});

  // for search
  const [searchInput, setSearchInput] = useState("");

  const [formProduct, setFormProduct] = useState({
    name: "",
    price: "",
    stocks: "",
    category: "",
    status: "",
    productImage: null,
    productImageURL: null,
  });

  const [updateForm, setUpdateForm] = useState({
    name: "",
    price: "",
    stocks: "",
    category: "",
    status: "",
    productImage: null,
    productImageURL: null,
  });

  // get all products
  useEffect(() => {
    getProductsFunction(filterOptions);
  }, [filterOptions]);

  // for selecting product to the table
  const handleSelectProduct = (item, index) => {
    setSelectProduct(item);
    setUpdateForm({
      name: item.name,
      price: item.price,
      stocks: item.stocks,
      category: item.category,
      status: item.status,
      productImage: null,
      productImageURL: item.imageUrl,
    });
  };

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  // closing and reseting modal
  const toggleCreateModal = () => {
    setIsCreateModalOpen(!isCreateModalOpen);
    setIsCreateLoading(false);

    // clear data
    setFormProduct({
      name: "",
      price: "",
      stocks: "",
      category: "",
      status: "",
      productImage: null,
      productImageURL: null,
    });
  };

  const toggleEditModal = () => {
    setIsEditModalOpen(!isEditModalOpen);
  };

  const toggleDeleteMOdal = async () => {
    setIsDeleteModalOpen(!isDeleteModalOpen);
  };

  // for input field
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormProduct((prevState) => ({
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
      setFormProduct((prevState) => ({
        ...prevState,
        productImage: file,
        productImageURL: URL.createObjectURL(file),
      }));
    } else {
      setFormProduct((prevState) => ({
        ...prevState,
        productImage: null,
        productImageURL: null,
      }));
    }
  };

  // for update file input field
  const handleChangeFileUpdate = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUpdateForm((prevState) => ({
        ...prevState,
        productImage: file,
        productImageURL: URL.createObjectURL(file),
      }));
    } else {
      setUpdateForm((prevState) => ({
        ...prevState,
        productImage: null,
        productImageURL: selectedProduct.imageUrl,
      }));
    }
  };

  // creating new product
  const handleCreate = async (e) => {
    e.preventDefault();

    try {
      const response = await createProductFunction(formProduct);

      // refresh the table
      getProductsFunction(filterOptions);

      setIsCreateModalOpen(false);
      toast.success(response);
    } catch (error) {
      toast.error(error);
      console.log(error);
    }
  };

  // update product
  const handleUpdate = async (e) => {
    e.preventDefault();

    console.log(updateForm);
    try {
      const response = await updateProductFunction(
        selectedProduct._id,
        updateForm
      );

      setSelectProduct(response.data.updatedProduct);
      setIsEditModalOpen(false);

      // refresh the table
      getProductsFunction(filterOptions);

      toast.success(response.data.message);
    } catch (error) {
      toast.error(error);
      console.log(error);
    }
  };

  // delete product
  const handleDelete = async () => {
    try {
      const response = await deleteProductFunction(selectedProduct._id);

      // clear data
      setSelectProduct({});
      setSelectedIndex("");

      // refresh the table
      getProductsFunction(filterOptions);

      setIsDeleteModalOpen(false);
      toast.success(response);
    } catch (error) {
      toast.error(error);
      console.log(error);
    }
  };

  // search product
  const handleSearch = (e) => {
    e.preventDefault();
    setFilterOptions((prevState) => ({
      ...prevState,
      searchInput: searchInput,
    }));
  };

  // clear the searchInput in filter if the search input is empty
  useEffect(() => {
    if (searchInput === "") {
      setFilterOptions((prevState) => ({ ...prevState, searchInput: "" }));
    }
  }, [searchInput]);

  // filter change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;

    setFilterOptions((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <>
      <div className="flex flex-1 gap-4 p-4 ">
        <div className="flex flex-col flex-1 gap-2 p-4 bg-white ">
          {/* header */}
          <div className="flex items-center justify-between gap-4">
            <form
              onSubmit={handleSearch}
              className="flex items-center w-[20rem] gap-2 p-2 text-sm bg-white rounded outline outline-1 outline-gray-300 mr-auto">
              <HiOutlineSearch />
              <input
                className="w-full bg-white focus:outline-none"
                type="text"
                placeholder="Search an item"
                value={searchInput}
                name="searchInput"
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </form>

            <div
              onClick={toggleFilter}
              className="flex items-center gap-1 p-2 text-sm transition-all rounded shadow-sm cursor-pointer outline outline-1 outline-gray-300 active:scale-95">
              <HiOutlineFilter />
              Filter
            </div>
            <div
              className="flex items-center gap-1 p-2 text-sm text-white transition-all bg-green-500 rounded shadow-sm cursor-pointer active:scale-95"
              onClick={toggleCreateModal}>
              <HiPlus />
              Create
            </div>
          </div>

          {/* filter div */}
          <div className="relative">
            <div
              className={className(
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
                    value={filterOptions.category}
                    onChange={handleFilterChange}
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
                    value={filterOptions.status}
                    onChange={handleFilterChange}
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
                    value={filterOptions.sortBy}
                    onChange={handleFilterChange}
                    className="p-1 rounded-sm outline outline-1 outline-gray-300">
                    <option value="createdAt">Date</option>
                    <option value="price">Price</option>
                    <option value="stocks">Stocks</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="sortOrder">Sort Order</label>
                  <select
                    name="sortOrder"
                    id="sortOrder"
                    value={filterOptions.sortOrder}
                    onChange={handleFilterChange}
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
            {isGetLoading ? (
              <div className="flex items-center justify-center h-full gap-3 ">
                <span className=" loading loading-spinner"></span>
                <p className="text-lg">Loading...</p>
              </div>
            ) : (
              <div className="absolute w-full ">
                <table className="relative w-full">
                  <thead className="sticky top-0 text-sm bg-white ">
                    <tr className="text-left ">
                      <th></th>
                      <th className="py-2 ">Name</th>
                      <th>Price</th>
                      <th>Stocks</th>
                      <th>Status</th>
                      <th>Date added</th>
                    </tr>
                  </thead>
                  <tbody className="">
                    {productData?.map((item, index) => (
                      <tr
                        onClick={() => handleSelectProduct(item, index)}
                        key={item._id}
                        className={className(
                          selectedProduct._id === item._id
                            ? "bg-gray-100 hover:bg-gray-100"
                            : "hover:bg-gray-50",
                          "text-sm border-t border-gray-300 cursor-pointer hover:bg-slate-50"
                        )}>
                        <td className="px-4 text-xs font-bold">{index + 1}</td>
                        <td className="py-2 ">{item.name}</td>
                        <td className="whitespace-nowrap">
                          ₱ {item.price?.toFixed(2)}
                        </td>

                        <td>{item.stocks}</td>
                        <td>
                          <p
                            className={className(
                              item.status === "active"
                                ? "bg-green-100 text-green-600"
                                : "bg-red-100 text-red-600",
                              "w-fit text-center px-2 py-1 rounded-sm text-xs capitalize"
                            )}>
                            {item.status}
                          </p>
                        </td>
                        <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
        <div className="w-[25rem] bg-white rounded-sm p-4 flex flex-col">
          {selectedProduct.name ? (
            <>
              <div className="h-64 overflow-hidden rounded">
                <img
                  className="object-cover w-full h-full"
                  src={selectedProduct.imageUrl}
                  alt=""
                />
              </div>
              <h1 className="mt-4 text-xl font-semibold">
                {selectedProduct.name}
              </h1>
              <div className="flex items-center mt-4">
                <p className="w-1/3 text-sm font-semibold">Price</p>
                <p>₱ {selectedProduct.price}.00</p>
              </div>
              <div className="flex mt-2">
                <p className="w-1/3 text-sm font-semibold">Stocks</p>
                <p>{selectedProduct.stocks}</p>
              </div>
              <div className="flex mt-2">
                <p className="w-1/3 text-sm font-semibold">Status</p>
                <p className="capitalize">{selectedProduct.status}</p>
              </div>
              <div className="flex mt-2">
                <p className="w-1/3 text-sm font-semibold">Category</p>
                <p className="capitalize">
                  {selectedProduct.category.replace(/_/g, " ")}
                </p>
              </div>
              <div className="flex mt-2">
                <p className="w-1/3 text-sm font-semibold">Date Added</p>
                <p>{new Date(selectedProduct.createdAt).toLocaleString()}</p>
              </div>
              <div className="flex mt-2">
                <p className="w-1/3 text-sm font-semibold">Updated At</p>
                <p>{new Date(selectedProduct.updatedAt).toLocaleString()}</p>
              </div>
              <div className="flex mt-2">
                <p className="w-1/3 text-sm font-semibold">Added By</p>
                <p>{selectedProduct.addedBy}</p>
              </div>
              <div className="flex items-end flex-1 gap-4">
                <button
                  onClick={toggleEditModal}
                  className="flex-1 py-2 text-base transition-all bg-white rounded shadow-sm cursor-pointer active:scale-95 outline outline-1 outline-gray-300">
                  Edit
                </button>
                <button
                  onClick={toggleDeleteMOdal}
                  className="flex-1 py-2 text-base text-white transition-all bg-red-500 rounded-sm shadow-sm cursor-pointer active:scale-95 ">
                  Delete
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="h-64 rounded skeleton bg-slate-50"></div>
              <div className="h-8 mt-4 rounded skeleton bg-slate-50"></div>
              <div className="w-3/4 h-8 mt-4 rounded skeleton bg-slate-50"></div>
              <div className="h-8 mt-2 rounded skeleton bg-slate-50"></div>
              <div className="w-1/2 h-8 mt-2 rounded skeleton bg-slate-50"></div>
              <div className="w-3/4 h-8 mt-2 rounded skeleton bg-slate-50"></div>
              <div className="flex items-end flex-1 gap-4 ">
                <div className="flex-1 h-12 rounded skeleton bg-slate-50"></div>
                <div className="flex-1 h-12 rounded skeleton bg-slate-50"></div>
              </div>
            </>
          )}
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
                    Create New Product
                  </Dialog.Title>
                  <form className="grid gap-4 mt-8" onSubmit={handleCreate}>
                    <div className="flex gap-4">
                      <div className="w-2/5 aspect-square">
                        <div className="w-full h-full overflow-hidden rounded ">
                          {formProduct.productImageURL === null ? (
                            <div
                              data-theme="light"
                              className="w-full h-full skeleton bg-slate-50"></div>
                          ) : (
                            <img
                              className="object-cover w-full h-full "
                              src={formProduct.productImageURL}
                              alt="Product"
                            />
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col flex-1 gap-2">
                        <InputField
                          label={"Product name"}
                          id={"product_name"}
                          name={"name"}
                          type={"text"}
                          value={formProduct.name}
                          onChange={handleChange}
                        />
                        <div className="flex gap-4">
                          <InputField
                            label={"Price"}
                            id={"price"}
                            name={"price"}
                            type={"number"}
                            value={formProduct.price}
                            onChange={handleChange}
                          />
                          <InputField
                            label={"Stocks"}
                            id={"stocks"}
                            name={"stocks"}
                            type={"number"}
                            value={formProduct.stocks}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="flex gap-4">
                          <div className="flex flex-col flex-1 gap-2">
                            <label
                              className="text-base text-slate-600"
                              htmlFor="category">
                              Category
                            </label>
                            <select
                              className="px-3 py-2 text-base bg-white rounded outline outline-1 outline-gray-300 text-slate-600"
                              id="category"
                              onChange={handleChange}
                              name="category"
                              value={formProduct.category}>
                              <option value="" disabled>
                                Select
                              </option>
                              <option value="appetizer">Appetizer</option>
                              <option value="soup">Soup</option>
                              <option value="main_course">Main Course</option>
                              <option value="dessert">Dessert</option>
                              <option value="drinks">Drinks</option>
                            </select>
                          </div>
                          <div className="flex flex-col flex-1 gap-2">
                            <label
                              className="text-base text-slate-600"
                              htmlFor="status">
                              Status
                            </label>
                            <select
                              className="px-3 py-2 text-base bg-white rounded outline outline-1 outline-gray-300 text-slate-600"
                              id="status"
                              onChange={handleChange}
                              name="status"
                              value={formProduct.status}>
                              <option value="" disabled>
                                Select
                              </option>
                              <option value="active">Active</option>
                              <option value="inactive">Inactive</option>
                            </select>
                          </div>
                        </div>
                        <InputField
                          label={"Product Image"}
                          type={"file"}
                          name={"productImage"}
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
                        disabled={isCreateLoading}>
                        {isCreateLoading ? (
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
        <Dialog as="div" className="relative z-10" onClose={toggleEditModal}>
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
                    Update Product
                  </Dialog.Title>
                  <form className="flex flex-col mt-8 " onSubmit={handleCreate}>
                    <div className="flex gap-4">
                      <div className="w-2/5 aspect-square">
                        <div className="w-full h-full overflow-hidden rounded ">
                          {updateForm.productImageURL === null ? (
                            <div
                              data-theme="light"
                              className="w-full h-full skeleton bg-slate-50"></div>
                          ) : (
                            <img
                              className="object-cover w-full h-full "
                              src={updateForm.productImageURL}
                              alt="Product"
                            />
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col flex-1 gap-2">
                        <InputField
                          label={"Product name"}
                          id={"product_name"}
                          name={"name"}
                          type={"text"}
                          value={updateForm.name}
                          onChange={handleChangeUpdate}
                        />
                        <div className="flex gap-4">
                          <InputField
                            label={"Price"}
                            id={"price"}
                            name={"price"}
                            type={"number"}
                            value={updateForm.price}
                            onChange={handleChangeUpdate}
                          />
                          <InputField
                            label={"Stocks"}
                            id={"stocks"}
                            name={"stocks"}
                            type={"number"}
                            value={updateForm.stocks}
                            onChange={handleChangeUpdate}
                          />
                        </div>
                        <div className="flex gap-4">
                          <div className="flex flex-col flex-1 gap-2">
                            <label
                              className="text-base text-slate-600"
                              htmlFor="category">
                              Category
                            </label>
                            <select
                              className="px-3 py-2 text-base bg-white rounded outline outline-1 outline-gray-300 text-slate-600"
                              id="category"
                              onChange={handleChangeUpdate}
                              name="category"
                              defaultValue={updateForm.category}>
                              <option value="appetizer">Appetizer</option>
                              <option value="soup">Soup</option>
                              <option value="main_course">Main Course</option>
                              <option value="dessert">Dessert</option>
                              <option value="drinks">Drinks</option>
                            </select>
                          </div>
                          <div className="flex flex-col flex-1 gap-2">
                            <label
                              className="text-base text-slate-600"
                              htmlFor="status">
                              Status
                            </label>
                            <select
                              className="px-3 py-2 text-base bg-white rounded outline outline-1 outline-gray-300 text-slate-600"
                              id="status"
                              onChange={handleChangeUpdate}
                              name="status"
                              defaultValue={updateForm.status}>
                              <option value="active">Active</option>
                              <option value="inactive">Inactive</option>
                            </select>
                          </div>
                        </div>
                        <InputField
                          label={"Product Image"}
                          type={"file"}
                          name={"productImage"}
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
                        onClick={handleUpdate}

                        // disabled={isCreateLoading}
                      >
                        {isUpdateLoading ? (
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

      {/* delete modal */}
      <Transition appear show={isDeleteModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={toggleDeleteMOdal}>
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
                <Dialog.Panel className="p-4 text-left align-middle transition-all transform bg-white rounded shadow-xl ">
                  <Dialog.Title
                    as="h3"
                    className="text-2xl font-medium leading-6 text-gray-900">
                    Delete this product?
                  </Dialog.Title>
                  <div className="flex flex-col gap-2 mt-4 text-slate-600">
                    <div className="w-[20rem] overflow-hidden rounded">
                      <img
                        className="object-cover w-full"
                        src={selectedProduct.imageUrl}
                        alt=""
                      />
                    </div>
                    <p className="text-lg">{selectedProduct.name}</p>
                    <div className="flex flex-1 gap-4 mt-4">
                      <button
                        onClick={toggleDeleteMOdal}
                        className="flex-1 py-2 text-base transition-all bg-white rounded shadow-sm cursor-pointer active:scale-95 outline outline-1 outline-gray-300">
                        Cancel
                      </button>
                      <button
                        onClick={handleDelete}
                        disabled={isDeleteLoading}
                        className="flex items-center justify-center flex-1 gap-2 py-2 text-base text-white transition-all bg-red-500 rounded-sm shadow-sm cursor-pointer active:scale-95 ">
                        {isDeleteLoading ? (
                          <>
                            <span className="loading loading-spinner loading-sm"></span>
                            Deleting
                          </>
                        ) : (
                          "Confirm"
                        )}
                      </button>
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

export default Inventory;
