const Booking = require("../Models/Booking");
const Case = require("../Models/Case");
const { v4: uuidv4 } = require("uuid");
const { isLoggedIn, isAdmin } = require("../controllers/authController");
const Mediator = require("../Models/Mediator");
const User = require("../Models/User");

//hearing status -> Scheduled,
const fileCase = async (req, res) => {
  try {
    const case_id = `CASE-${uuidv4()}`;

    const id = req.params.id;
    const booking_id = req.params.booking_id;
    const { party_ids, mediator_id, mediation_mode, rate } = req.body;
    const token = req.cookies.auth_token;

    const status = await isLoggedIn(id, token);

    if (status === 3) {
      const isBooking = await Booking.findById(booking_id);

      if (!isBooking)
        return res.status(404).json({
          error: 404,
          message: `Booking Id: ${booking_id} doesn't exists`,
        });

      await Booking.findByIdAndUpdate(
        booking_id,
        { $set: { status: "Booked", case_id } },
        { new: true }
      );

      const booking = await Booking.findById(booking_id);

      const newCase = new Case({
        _id: case_id,
        case_type: booking.case_type,
        language: booking.language,
        parties: party_ids,
        initiated_by: party_ids[0],
        mediation_mode,
        assigned_mediator: mediator_id,
        status: "Filed",
        rate,
      });

      await newCase.save();

      return res.status(201).json({
        message: "Case filed successfully",
        case_id,
        party_ids,
        mediator_id,
      });
    }

    return res.status(401).json({ error: 401, message: "Unauthorized access" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const dissmissBooking = async (req, res) => {
  try {
    const { id, booking_id } = req.params;
    const token = req.cookies.auth_token;
    const status = await isLoggedIn(id, token);

    if (status === 3) {
      await Booking.findByIdAndUpdate(booking_id, {
        $set: { status: "Cancelled" },
      });

      return res
        .status(200)
        .json({ message: "Case Booking Dismissed", booking_id });
    }
    return res.status(401).json({ error: 401, message: "Unauthorized access" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const findMediators = async (req, res) => {
  try {
    const token = req.cookies.auth_token;
    const status = await isAdmin(token);
    if (status != 3)
      return res.status(400).json({ message: "Unauthorized access" });
    const mediators = await Mediator.find();
    res.status(200).json(mediators);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const checkBooking = async (req, res) => {
  try {
    const token = req.cookies.auth_token;
    const status = await isAdmin(token);

    if (status === 3) {
      const bookings = await Booking.find();
      return res.status(200).json({
        message: "Booking details received successfully",
        data: bookings,
      });
    }
    return res.status(401).json({ error: 401, message: "Unauthorized access" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const unVerifiedUsers = async (req, res) => {
  try {
    const token = req.cookies.auth_token;
    const status = await isAdmin(token);

    if (status === 3) {
      const pendingUsers = await User.find({ verification_status: "Pending" });
      return res.status(200).json({
        message: "Unverified Users fetched",
        data: pendingUsers,
      });
    }
    return res.status(401).json({ error: 401, message: "Unauthorized access" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const unVerifiedMediators = async (req, res) => {
  try {
    const token = req.cookies.auth_token;
    const status = await isAdmin(token);

    if (status === 3) {
      const pendingMediator = await Mediator.find({
        verification_status: "Pending",
      });
      return res.status(200).json({
        message: "Unverified Mediators fetched",
        data: pendingMediator,
      });
    }
    return res.status(401).json({ error: 401, message: "Unauthorized access" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const verifyMediator = async (req, res) => {
  try {
    const token = req.cookies.auth_token;
    const _id = req.params.id;
    const status = req.params.status;
    const auth = await isAdmin(token);

    if (status !== "Verified" && status !== "Rejected")
      return res.status(401).json({
        error: 401,
        message: "Invalid Status",
      });

    if (auth == 3) {
      await Mediator.findOneAndUpdate(
        { _id },
        { $set: { verification_status: status } }
      );

      return res.status(201).json({ message: `Mediator ${status}` });
    }
    return res.status(401).json({
      error: 401,
      message: "Unauthorized: You don't have access to this",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const verifyUser = async (req, res) => {
  try {
    const token = req.cookies.auth_token;
    const _id = req.params.id;
    const status = req.params.status;
    const auth = await isAdmin(token);

    if (status != "Verified" && status != "Rejected")
      return res.status(401).json({
        error: 401,
        message: "Invalid Status",
      });

    if (auth == 3) {
      const user = await User.findById(_id);
      if (!user)
        return res.status(400).json({ error: 400, message: "Invalid User ID" });

      await User.findOneAndUpdate(
        { _id },
        { $set: { verification_status: status } }
      );

      return res.status(201).json({ message: `User ${status}` });
    }

    return res.status(401).json({
      error: 401,
      message: "Unauthorized: You don't have access to this",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  fileCase,
  dissmissBooking,
  checkBooking,
  findMediators,
  unVerifiedUsers,
  unVerifiedMediators,
  verifyUser,
  verifyMediator,
};
