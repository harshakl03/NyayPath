const User = require("../Models/User");
const Booking = require("../Models/Booking");
const Case = require("../Models/Case");
const { v4: uuidv4 } = require("uuid");
const {
  createAuth,
  isExistingAuth,
  isLoggedIn,
  deleteAuthByLinkedId,
  isAdmin,
} = require("./authController");
const jwt = require("jsonwebtoken");
const ENV = require("../config/env");

const createUser = async (req, res) => {
  try {
    const { email, password, full_name, address, number, language_preference } =
      req.body;
    const exists = await isExistingAuth(email);
    if (exists)
      return res.status(401).json({ message: "Email already registered" });
    const _id = `USER-${uuidv4()}`;
    const newUser = new User({
      _id,
      full_name,
      number,
      email,
      address,
      language_preference,
      cases_involved: [],
      created_at: new Date(),
      updated_at: new Date(),
    });
    await newUser.save();
    const authResponse = await createAuth(email, password, _id, "User", 1);
    res.status(201).json({
      message: "User registered successfully",
      _id,
      auth_id: authResponse._id,
      role: authResponse.role,
      level: authResponse.level,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const findUsers = async (req, res) => {
  try {
    const token = req.cookies.auth_token;
    const status = await isAdmin(token);
    if (status != 3)
      return res.status(400).json({ message: "Unauthorized access" });
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const findUserById = async (req, res) => {
  try {
    const id = req.params.id;
    const token = req.cookies.auth_token;
    const status = await isLoggedIn(id, token);
    if (status == -1) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });
    }
    if (status == 0) {
      return res.status(403).json({ message: "You don't have access" });
    }
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteUserById = async (req, res) => {
  try {
    const id = req.params.id;
    const token = req.cookies.auth_token;
    const status = await isLoggedIn(id, token);
    if (status == -1) {
      return (
        res.status(401), json({ message: "Unauthorized: No token provided" })
      );
    }
    if (status == 0) {
      return res.status(403).json({ message: "You don't have access" });
    }
    const authDeleted = await deleteAuthByLinkedId(id);
    if (!authDeleted) {
      return res.status(404).json({ message: "Auth record not found" });
    }
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    if (status != "admin")
      res.clearCookie("auth_token", {
        httpOnly: true,
        secure: ENV.NODE_ENV === "production",
        sameSite: "strict",
      });
    res.status(200).json({ message: "User and Auth deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const bookCase = async (req, res) => {
  try {
    const booking_id = `BOOKING-${uuidv4()}`;
    const user_id = req.params.id;
    const { mode, case_type, language } = req.body;
    const token = req.cookies.auth_token;

    const isUser = await isLoggedIn(user_id, token);

    if (isUser != 1 || isUser == 0)
      return res
        .status(401)
        .json({ error: 401, message: "Unauthorized access" });

    const newBooking = new Booking({
      _id: booking_id,
      created_by: user_id,
      booking_mode: mode,
      case_type,
      language,
    });

    await newBooking.save();

    res.status(201).json({
      message: "Case booked successfully",
      booking_id,
      user_id,
      mode,
      case_type,
      language,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getMyCases = async (req, res) => {
  try {
    const { id: user_id } = req.params;
    const token = req.cookies.auth_token;
    const isUser = await isLoggedIn(user_id, token);

    if (!isUser)
      return res
        .status(401)
        .json({ error: 401, message: "Unauthorized access" });

    const userCases = await Case.find({ parties: user_id }).select(
      "_id case_type language parties location mediation_mode assigned_mediator status result initiated_by priority rate"
    );

    if (!userCases.length) {
      return res.status(404).json({ message: "No cases found for this user." });
    }

    res.status(200).json({ data: userCases });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createUser,
  findUsers,
  findUserById,
  deleteUserById,
  bookCase,
  getMyCases,
};
