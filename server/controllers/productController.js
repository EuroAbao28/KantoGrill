const cloudinary = require("../utils/cloudinary");
const productModel = require("../models/productModel");

const addNewItem = async (req, res) => {
  try {
    const { name, price, stocks, category, status } = req.body;
    const { firstname, lastname } = req.user;

    if (!name || !price || !stocks || !category || !status || !req.file)
      return res.status(400).json({ message: "All fields are required" });

    // check if the item name is already in exist
    const isItemNameExist = await productModel.find({ name });

    // since find by name ang gamit natin, mag rereturn sya ng empty array
    // which is true padin sya kahit empty, so dapat greater to 0 sya
    // para magtutrue lang kapag may kamatch at hindi empty array
    if (isItemNameExist && isItemNameExist.length > 0)
      return res
        .status(400)
        .json({ message: "Item name already exist", isItemNameExist });

    // upload image to Cloudinary
    const cloudinaryResponse = await cloudinary.uploader.upload(req.file.path, {
      folder: "Kanto_Grill/Product_Images",
    });

    // check if the cloudinary upload is success
    if (!cloudinaryResponse.public_id)
      return res.status(500).json({ mesage: "Cloudinary upload failed" });

    // if success
    const newProduct = {
      name,
      price,
      stocks,
      category,
      status,
      imageUrl: "",
      imagePublicId: "",
      addedBy: `${firstname} ${lastname}`,
    };

    // save the url in the imageUrl field
    newProduct.imageUrl = cloudinaryResponse.secure_url;
    newProduct.imagePublicId = cloudinaryResponse.public_id;

    // save in the db
    const response = await productModel.create(newProduct);

    res.status(201).json({
      message: "New product added",
      response,
    });
  } catch (error) {
    console.log(error);
    return res.json(error);
  }
};

const updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, stocks, category, status } = req.body;

    console.log("BODY", req.body);

    let updatedImageUrl = "";

    const isProductExist = await productModel.findById(id);

    if (!isProductExist)
      return res.status(404).json({ message: "Product not found" });

    // if the user uploaded an image, update the image in cloudinary
    if (req.file) {
      const clouudinaryResponse = await cloudinary.uploader.upload(
        req.file.path,
        { public_id: isProductExist.imagePublicId }
      );

      // pass the updated iamge url in the let variable
      updatedImageUrl = clouudinaryResponse.secure_url;
    }

    // update the value base on which is true
    isProductExist.name = name || isProductExist.name;
    isProductExist.price = price || isProductExist.price;
    isProductExist.stocks = stocks || isProductExist.stocks;
    isProductExist.category = category || isProductExist.category;
    isProductExist.status = status || isProductExist.status;
    isProductExist.imageUrl = updatedImageUrl || isProductExist.imageUrl;

    // save the updated value
    const updatedProduct = await isProductExist.save();

    console.log("RESPONSE", updatedProduct);

    return res.status(201).json({
      message: "Updated successfully",
      updatedProduct,
    });
  } catch (error) {
    console.log(error);
    return res.json(error);
  }
};

const deleteItem = async (req, res) => {
  try {
    const { id } = req.params;

    const isProductExist = await productModel.findById(id);

    if (!isProductExist)
      return res.status(404).json({ message: "Product not found" });

    // delete the product in mongodb
    await productModel.findByIdAndDelete(id);

    // delete the image in cloudinary
    await cloudinary.uploader.destroy(isProductExist.imagePublicId);

    return res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const getAllItem = async (req, res) => {
  try {
    console.log("QUERY", req.query);

    const { category, status, sortBy, sortOrder } = req.query;

    let filter = {};

    if (category !== "") {
      filter.category = category;
    }

    if (status !== "") {
      filter.status = status;
    }

    const response = await productModel
      .find(filter)
      .sort({ [sortBy]: sortOrder === "descending" ? -1 : 1 });

    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const searchItem = async (req, res) => {
  try {
    const { searchInput } = req.query;

    if (!searchInput) return res.json({ message: "No search Input" });

    const response = await productModel.find({
      name: { $regex: searchInput, $options: "i" },
    });

    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { addNewItem, updateItem, deleteItem, getAllItem, searchItem };
