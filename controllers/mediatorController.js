const Mediator = require("../Models/Mediator");
const Case = require("../Models/Case");
const User = require("../Models/User");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const ENV = require("../config/env");
const {
  createAuth,
  isExistingAuth,
  isLoggedIn,
  deleteAuthByLinkedId,
  isAdmin,
} = require("../controllers/authController");

const createMediator = async (req, res) => {
  try {
    const { _id, email, password, ...remainingDetails } = req.body;
    const exists = await isExistingAuth(email);
    if (exists)
      return res.status(401).json({ message: "Email already registered" });
    const newMediator = new Mediator({
      _id,
      email,
      ...remainingDetails,
      cases: [],
      created_at: new Date(),
      updated_at: new Date(),
    });
    await newMediator.save();
    const authResponse = await createAuth(email, password, _id, "Mediator", 2);
    res.status(201).json({
      message: "Mediator created successfully",
      _id,
      auth_id: authResponse._id,
      role: authResponse.role,
      level: authResponse.level,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const findMediatorById = async (req, res) => {
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
    const mediator = await Mediator.findById(id);
    if (!mediator) {
      return res.status(404).json({ message: "Mediator not found" });
    }
    res.status(200).json(mediator);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteMediatorById = async (req, res) => {
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
    const authDeleted = await deleteAuthByLinkedId(id);
    if (!authDeleted) {
      return res.status(404).json({ message: "Auth record not found" });
    }
    const deleteMediator = await Mediator.findByIdAndDelete(id);
    if (!deleteMediator) {
      return res.status(404).json({ message: "Mediator not found" });
    }
    if (status != "admin")
      res.clearCookie("auth_token", {
        httpOnly: true,
        secure: ENV.NODE_ENV === "production",
        sameSite: "strict",
      });
    res.status(200).json({ message: "Mediator deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const changeStatus = async (req, res) => {
  try {
    const _id = req.params.id;
    const { status } = req.body;
    const token = req.cookies.auth_token;
    const isMediator = await isLoggedIn(_id, token);
    if (isMediator == -1) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });
    }
    if (isMediator == 0) {
      return res.status(403).json({ message: "You don't have access" });
    }

    await Mediator.findOneAndUpdate({ _id }, { $set: { status } });

    return res.status(200).json({ message: `Status Changed to ${status}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const fetchMyCases = async (req, res) => {
  try {
    const { id: mediator_id } = req.params;
    const token = req.cookies.auth_token;
    const isUser = await isLoggedIn(mediator_id, token);

    if (!isUser)
      return res
        .status(401)
        .json({ error: 401, message: "Unauthorized access" });

    const mediatorCases = await Case.find({
      assigned_mediator: mediator_id,
    }).select(
      "_id case_type language parties location mediation_mode assigned_mediator status result initiated_by priority rate"
    );

    if (!mediatorCases.length) {
      return res.status(404).json({ message: "No cases found for this user." });
    }

    res.status(200).json({ data: mediatorCases });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const uploadDocument = async (req, res) => {
  try {
    const case_id = req.params.case_id;
    const mediator_id = req.params.mediator_id;
    const { documents } = req.body;
    const token = req.cookies.auth_token;
    const isMediator = await isLoggedIn(mediator_id, token);
    if (isMediator == 2) {
      await Case.findOneAndUpdate(
        { _id: case_id },
        { $addToSet: { documents } }
      );

      return res
        .status(200)
        .json({ message: "Document Uploaded", case_id, mediator_id });
    }
    return res.status(500).json({ message: "Unauthorized access" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createMediator,
  findMediatorById,
  deleteMediatorById,
  changeStatus,
  fetchMyCases,
  uploadDocument,
};
