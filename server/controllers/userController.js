const userModel = require("../models/userModel");
const { generateToken } = require("../utils/authUtils");
const cloudinary = require("../utils/cloudinary");
const upload = require("../middleware/multer");
const { hashPassword, comparePassword } = require("../utils/passwordUtils");

const createNewUser = async (req, res) => {
  try {
    const { username, firstname, middlename, lastname, password, adminType } =
      req.body;

    if (
      !username ||
      !firstname ||
      !lastname ||
      !password ||
      !adminType ||
      !req.file
    )
      return res.status(400).json({ message: "All fields are required" });

    // check if the username already exist
    const isUsernameExist = await userModel.findOne({ username });

    // check if the user data already exist
    const isUserExist = await userModel.findOne({
      firstname,
      middlename,
      lastname,
    });

    if (isUsernameExist)
      return res.status(400).json({ message: "Username already exist" });

    if (isUserExist)
      return res.status(400).json({ message: "User data already exist" });

    // updload the image cloudinary
    const cloudinaryResponse = await cloudinary.uploader.upload(req.file.path, {
      folder: "Kanto_Grill/Admin_Images",
    });

    if (!cloudinaryResponse.public_id)
      return res.status(500).json({ message: "Uploading image failed" });

    // if image upload is success then proceed

    // hash the password
    const hashedPassword = await hashPassword(password, 10);

    // create new user
    await userModel.create({
      username,
      firstname,
      middlename,
      lastname,
      password: hashedPassword,
      adminType,
      imageUrl: cloudinaryResponse.secure_url,
      public_id: cloudinaryResponse.public_id,
    });

    return res.status(201).json({ message: "New user created" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};

const editUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstname, middlename, lastname, password, profilePic } = req.body;

    let hashedPassword;

    const user = await userModel.findById(id);

    if (!user) return res.status(404).json({ mesage: "User not found" });

    if (password) hashedPassword = await hashPassword(password, 10);

    // update if may laman ang specific field galing sa req.body
    // if firstname is true, then yan ilalagay
    // pag wala naman edi false, so iaasign nya nalang yung existing na laman nya
    user.firstname = firstname || user.firstname;
    user.middlename = middlename || user.middlename;
    user.lastname = lastname || user.lastname;
    user.password = hashedPassword || user.password;
    user.profilePic = profilePic || user.profilePic;

    // save the updated user
    await user.save();

    return res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const isUserExist = await userModel.findById(id);

    if (!isUserExist)
      return res.status(404).json({ message: "User not found" });

    // delete the user in mongodb
    await userModel.findByIdAndDelete(id);

    // delete the image in cloudinary
    await cloudinary.uploader.destroy(isUserExist.public_id);

    return res.status(200).json({ message: "User deleted succesfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error", error });
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
    const allUsers = await userModel.find();
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
  editUser,
  deleteUser,
  login,
  getAllUser,
  checkUser,
};
