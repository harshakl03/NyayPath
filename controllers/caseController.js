const Booking = require("../Models/Booking");
const Case = require("../Models/Case");
const Hearing = require("../Models/Hearing");
const User = require("../Models/User");
const Mediator = require("../Models/Mediator");

const { isLoggedIn } = require("../controllers/authController");

const { v4: uuidv4 } = require("uuid");

const fileCase = async (req, res) => {
  try {
    const case_id = `CASE-${uuidv4()}`;
    const booking_id = `BOOKING-${uuidv4()}`;
    const user_id = req.params.id;
    const {
      mode,
      case_type,
      language,
      location,
      mediator_id,
      party_ids,
      party_contacts,
    } = req.body;
    const token = req.cookies.auth_token;

    const isUser = await isLoggedIn(user_id, token);

    if (isUser != 1 || isUser == 0)
      return res.status(401).json({ message: "Unauthorized access" });

    if (!party_ids)
      return res
        .status(201)
        .json({ message: "Call parties", number: party_contacts });

    const newBooking = new Booking({
      _id: booking_id,
      case_id,
      created_by: user_id,
      booking_mode: mode,
    });

    await newBooking.save();

    const newCase = new Case({
      _id: case_id,
      case_type,
      language,
      parties: party_ids,
      initiated_by: user_id,
      location,
      mediation_mode: mode,
      assigned_mediator: mediator_id,
    });

    await newCase.save();

    party_ids.map(async (id) => {
      await User.findOneAndUpdate(
        { _id: id },
        { $addToSet: { cases_involved: case_id } },
        { new: true }
      );
    });

    await Mediator.findOneAndUpdate(
      { _id: mediator_id },
      { $addToSet: { cases: case_id } },
      { new: true }
    );

    res.status(201).json({
      message: "Case booked successfully",
      case_id,
      user_id,
      mode,
      case_type,
      language,
      mediator_id,
      party_ids,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//hearing status -> Scheduled,
const acceptCase = async (req, res) => {
  try {
    const hearing_id = `HEARING-${uuidv4()}`;

    const mediator_id = req.params.id;
    const case_id = req.params.case_id;
    const { scheduled_date, rate, details } = req.body;
    const token = req.cookies.auth_token;

    const isMediator = await isLoggedIn(mediator_id, token);

    if (isMediator != 2 || isMediator == 0)
      return res.status(401).json({ message: "Unauthorized access" });
    const booking_id = await Booking.findOne({ case_id }).select("_id");
    const user_ids = await Case.findOne({ _id: case_id }).select("parties");
    const mediation_mode = await Case.findOne({ _id: case_id }).select(
      "mediation_mode"
    );

    const newHearing = new Hearing({
      _id: hearing_id,
      case_id,
      booking_id,
      user_ids,
      mediator_id,
      online_details: mediation_mode == "Online" ? details : {},
      offline_details: mediation_mode == "Offline" ? details : {},
      status: "Scheduled",
      scheduled_date,
    });

    await newHearing.save();

    await Booking.findOneAndUpdate(
      { _id: booking_id },
      { $set: { status: "In Progress", scheduled_date } },
      { new: true }
    );

    await Case.findOneAndUpdate(
      { _id: case_id },
      { $set: { status: "Mediator Assigned", rate } }
    );

    res.status(201).json({
      message: "Case accepted successfully",
      case_id,
      user_ids,
      mediator_id,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const rejectCase = async (req, res) => {
  try {
    const mediator_id = req.params.id;
    const case_id = req.params.case_id;
    const token = req.cookies.auth_token;

    const isMediator = await isLoggedIn(mediator_id, token);
    if (isMediator != 2 || isMediator == 0)
      return res.status(401).json({ message: "Unauthorized access" });

    await Case.findOneAndUpdate(
      { _id: case_id },
      { $set: { status: "Mediator Rejected" } }
    );
    await Booking.findOneAndUpdate(
      { case_id },
      { $set: { status: "Cancelled" } }
    );

    return res
      .status(200)
      .json({ message: "Case Cancelled by Mediator", mediator_id, case_id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const fetchMyCases = async (req, res) => {
  try {
    const _id = req.params.id;
    const token = req.cookies.auth_token;
    const auth = await isLoggedIn(_id, token);

    if (auth == 0)
      return res.status(401).json({ message: "Unauthorized access" });

    if (auth == 1) {
      const cases = await User.findOne({ _id }).populate({
        path: "cases_involved",
        select:
          "case_id case_type language mediation_mode status rate priority",
      });

      return res.status(201).json(cases);
    }

    const cases = await Mediator.findOne({ _id }).populate({
      path: "cases",
      select: "case_id case_type language mediation_mode status rate priority",
    });

    return res.status(201).json(cases);
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
  fileCase,
  acceptCase,
  rejectCase,
  fetchMyCases,
  uploadDocument,
};
