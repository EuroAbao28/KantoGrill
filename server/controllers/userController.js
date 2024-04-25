const userModel = require("../models/userModel");
const { generateToken } = require("../utils/authUtils");
const cloudinary = require("../utils/cloudinary");
const upload = require("../middleware/multer");
const { hashPassword, comparePassword } = require("../utils/passwordUtils");

const createNewUser = async (req, res) => {
  try {
    const {
      firstname,
      lastname,
      username,
      adminType,
      password,
      confirmPassword,
    } = req.body;

    const { firstname: userFirstname, lastname: userLastname } = req.user;

    if (
      !firstname ||
      !lastname ||
      !username ||
      !adminType ||
      !password ||
      !confirmPassword ||
      !req.file
    )
      return res.status(400).json({ message: "All fields are required" });

    // check if the firstname and lastname is already exist
    const isUserExist = await userModel.find({ username });

    if (isUserExist && isUserExist.length > 0)
      return res.status(400).json({
        message: "Username already exist",
        isUserExist,
      });

    // check if the password and confirmPassword are not matched
    if (password !== confirmPassword)
      return res.status(400).json({
        message: "Passwords do not match",
      });

    // hash the password
    const hashedPassword = await hashPassword(password, 10);

    // upload image to Cloudinary
    const cloudinaryResponse = await cloudinary.uploader.upload(req.file.path, {
      folder: "Kanto_Grill/Admin_Images",
    });

    // check if the cloudinary upload is success
    if (!cloudinaryResponse.public_id)
      return res.status(500).json({
        message: "Cloudinary upload failed",
      });

    // if success, create a new user object
    const newUser = {
      createdBy: `${userFirstname} ${userLastname}`,
      firstname,
      lastname,
      username,
      adminType,
      password: hashedPassword,
      imageUrl: cloudinaryResponse.secure_url,
      imagePublicId: cloudinaryResponse.public_id,
    };

    // save the object in the db
    const response = await userModel.create(newUser);

    return res.status(201).json({ message: "New user added" });
  } catch (error) {
    console.log(error);
    return res.json(error);
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      firstname,
      lastname,
      username,
      adminType,
      password,
      confirmPassword,
    } = req.body;

    let updatedImageUrl = "";
    let updatedPassword = "";

    const isUserExist = await userModel.findById(id);

    if (!isUserExist)
      return res.status(404).json({ message: "User not found" });

    // if the user uploaded an image, update the image in cloudinary
    if (req.file) {
      const cloudinaryResponse = await cloudinary.uploader.upload(
        req.file.path,
        { public_id: isUserExist.imagePublicId }
      );

      // pass the updated image url in the let variable
      updatedImageUrl = cloudinaryResponse.secure_url;
    }

    // check if user entered a new password
    if (password && confirmPassword) {
      // check if the password are matched
      if (password !== confirmPassword) {
        return res.status(404).json({ message: "Passwords do not match" });
      }

      // hash and put the new password in the updatedPassword variable
      updatedPassword = await hashPassword(password, 10);
    }

    // update the value base on which is true
    if (firstname) isUserExist.firstname = firstname;
    if (lastname) isUserExist.lastname = lastname;
    if (username) isUserExist.username = username;
    if (adminType) isUserExist.adminType = adminType;
    if (updatedPassword) isUserExist.password = updatedPassword;
    if (updatedImageUrl) isUserExist.imageUrl = updatedImageUrl;

    // save the updated value
    const updatedUser = await isUserExist.save();

    return res.status(201).json({
      message: "Updated successfully",
      updatedUser,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const isUserExist = await userModel.findById(id);

    if (!isUserExist)
      return res.status(404).json({ message: "User not found" });

    // delete the product in mongodb
    await userModel.findByIdAndDelete(id);

    // delete the image in cloudinary
    await cloudinary.uploader.destroy(isUserExist.imagePublicId);

    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password)
      return res.status(400).json({ message: "All fields are required" });

    const isUserExist = await userModel.findOne({ username });

    if (
      isUserExist &&
      (await comparePassword(password, isUserExist.password))
    ) {
      return res.status(200).json({
        message: "Login successfully",
        token: generateToken(isUserExist),
      });
    } else {
      return res.status(400).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};

const getAllUser = async (req, res) => {
  try {
    let query = {};

    // Check if query parameter 'search' exists
    if (req.query.search) {
      // Create a regular expression to perform a case-insensitive search
      const searchRegex = new RegExp(req.query.search, "i");
      // Define the search criteria
      query = {
        $or: [
          { firstname: searchRegex },
          { lastname: searchRegex },
          { username: searchRegex },
        ],
      };
    }

    const allUsers = await userModel.find(query);
    return res.status(200).json(allUsers);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};

const checkUser = (req, res) => {
  const user = req.user;
  res.status(200).json({ message: "TAMA KA VALID USER KA", userData: user });
};

module.exports = {
  createNewUser,
  updateUser,
  deleteUser,
  login,
  getAllUser,
  checkUser,
};
