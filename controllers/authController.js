const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const Auth = require("../Models/Auth");
const ENV = require("../config/env");
const Mediator = require("../Models/Mediator");

const isExistingAuth = async (email) => {
  const existingAuth = await Auth.findOne({ email });
  if (existingAuth) return true;
  return false;
};

const createAuth = async (email, password, linked_id, role, level = 1) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const _id = `AUTH-${uuidv4()}`;
    const newAuth = new Auth({
      _id,
      email,
      password: hashedPassword,
      level,
      linked_id,
      role,
      created_at: new Date(),
    });
    await newAuth.save();
    return { _id, message: "Auth record created successfully", role, level };
  } catch (error) {
    throw new Error(error.message);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const authRecord = await Auth.findOne({ email });
    if (!authRecord) {
      return res.status(404).json({ message: "User not found" });
    }
    const isMatch = await bcrypt.compare(password, authRecord.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign(
      {
        auth_id: authRecord._id,
        role: authRecord.role,
        linked_id: authRecord.linked_id,
        level: authRecord.level,
      },
      ENV.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: ENV.NODE_ENV === "production",
      maxAge: 3600000, // 1 Hour
    });

    res.status(200).json({
      message: "Login successful",
      token,
      role: authRecord.role,
      level: authRecord.level,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const isAdmin = async (token) => {
  if (!token) {
    return "no-token";
  }
  const decode = jwt.verify(token, ENV.JWT_SECRET);
  if (decode.level == 3) return "admin";
  return "non-admin";
};

// checks if current auth and requesting auth are same, if not returns invalid else if returns no-token if token doesnt exist else return auth type
const isLoggedIn = async (id, token) => {
  if (!token) {
    return "no-token";
  }
  const decode = jwt.verify(token, ENV.JWT_SECRET);
  if (decode.level == 3) return "admin";
  const loggedUserId = decode.linked_id;
  if (loggedUserId != id) {
    return "invalid";
  }
  if (decode.level == 2) return "mediator";
  return "user";
};

const deleteAuthByLinkedId = async (linked_id) => {
  try {
    const deletedAuth = await Auth.findOneAndDelete({ linked_id });
    if (deletedAuth) return true;
    return false;
  } catch (error) {
    throw new Error(error.message);
  }
};

const verifyMediator = async (req, res) => {
  try {
    const token = req.cookies.auth_token;
    const _id = req.params.id;
    const status = req.params.status;
    const auth = await isAdmin(token);
    if (auth == "non-admin")
      return res.status(401).json({ message: "Unauthorized access" });
    await Mediator.findOneAndUpdate(
      { _id },
      { $set: { verification_status: status } }
    );

    return res.status(201).json({ message: `Mediator ${status}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createAuth,
  login,
  isExistingAuth,
  isLoggedIn,
  deleteAuthByLinkedId,
  isAdmin,
  verifyMediator,
};
