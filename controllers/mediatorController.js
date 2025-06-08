const Mediator = require("../Models/Mediator");
const Case = require("../Models/Case");
const User = require("../Models/User");
const Hearing = require("../Models/Hearing");
const Booking = require("../Models/Booking");
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

    // Fetch hearing details for all cases
    const casesWithMeetingDetails = await Promise.all(
      mediatorCases.map(async (caseItem) => {
        const hearing = await Hearing.findOne({ case_id: caseItem._id }).select(
          "online_details scheduled_date offline_details"
        );

        return {
          ...caseItem.toObject(),
          meet_link: hearing?.online_details?.meet_link || null,
          location: hearing?.offline_details?.meeting_address || null,
          is_meeting_active:
            hearing?.online_details?.is_meeting_active || false,
          schedule_date: hearing?.scheduled_date || null,
        };
      })
    );

    res.status(200).json({ data: casesWithMeetingDetails });
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

const acceptCase = async (req, res) => {
  try {
    const { case_id, mediator_id } = req.params;
    const { scheduled_date } = req.body;
    const token = req.cookies.auth_token;
    const isMediator = await isLoggedIn(mediator_id, token);
    const hearing_id = `HEARING-${uuidv4()}`;
    if (isMediator == 2) {
      const caseDetails = await Case.findById(case_id);
      if (caseDetails.status !== "Filed") {
        return res
          .status(400)
          .json({ error: 400, message: "Case is not in filed state" });
      }
      await Case.findByIdAndUpdate(case_id, {
        $set: { status: "Mediator Assigned" },
      });
      await Mediator.findByIdAndUpdate(mediator_id, {
        $addToSet: { cases: case_id },
      });
      const booking = await Booking.findOne({ case_id }).select("_id");
      await Hearing({
        _id: hearing_id,
        booking_id: booking._id,
        case_id,
        mediator_id,
        status: "Scheduled",
        scheduled_date,
      }).save();
      return res.status(200).json({ message: "Case Accepted", case_id });
    }
    return res.status(500).json({ message: "Unauthorized access" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const rejectCase = async (req, res) => {
  try {
    const { case_id, mediator_id } = req.params;
    const token = req.cookies.auth_token;
    const isMediator = await isLoggedIn(mediator_id, token);
    if (isMediator == 2) {
      const caseDetails = await Case.findById(case_id);
      if (!caseDetails) {
        return res.status(404).json({ error: 404, message: "Case not found" });
      }
      if (caseDetails.status !== "Filed") {
        return res
          .status(400)
          .json({ error: 400, message: "Case is not in filed state" });
      }
      await Case.findByIdAndUpdate(case_id, {
        $set: { status: "Mediator Rejected" },
      });
      await Mediator.findByIdAndUpdate(mediator_id, {
        $pull: { cases: case_id },
      });
      return res.status(200).json({ message: "Case Rejected", case_id });
    }
    return res.status(500).json({ message: "Unauthorized access" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createMeeting = async (req, res) => {
  try {
    const { case_id, mediator_id } = req.params;
    const { scheduled_date } = req.body;
    const token = req.cookies.auth_token;

    // Check mediator authorization
    const isMediator = await isLoggedIn(mediator_id, token);
    if (isMediator === 2) {
      // Check case status
      const caseDetails = await Case.findOne({
        _id: case_id,
        assigned_mediator: mediator_id,
      });

      if (!caseDetails) {
        return res.status(404).json({
          message: "Case not found or not assigned to this mediator",
        });
      }

      if (caseDetails.status !== "Mediator Assigned") {
        return res.status(400).json({
          message:
            "Meeting can only be created for cases with 'Mediator Assigned' status",
        });
      }

      if (caseDetails.mediation_mode !== "Online") {
        return res.status(400).json({
          error: 400,
          message:
            "Meeting link can only be created for online mediation cases",
        });
      }
      // Find associated booking
      const booking = await Booking.findOne({ case_id });
      if (!booking) {
        return res
          .status(404)
          .json({ message: "Associated booking not found" });
      }

      // Generate Jitsi meeting link
      const meetingId = `nyaypath-${case_id}-${Date.now()}`;
      const meetingLink = `https://meet.jit.si/${meetingId}`;

      // Update hearing with meeting link
      await Hearing.findOneAndUpdate(
        { case_id },
        {
          scheduled_date,
          $set: {
            online_details: {
              meet_link: meetingLink,
              is_meeting_active:
                new Date() >= new Date(scheduled_date).getTime() - 5 * 60000,
            },
            scheduled_date: scheduled_date,
          },
        }
      );

      // Update case status to In Progress
      await Case.findByIdAndUpdate(case_id, {
        $set: { status: "In Progress" },
      });

      return res.status(200).json({
        message: "Meeting created successfully",
        data: {
          meeting_link: meetingLink,
          scheduled_date,
          case_id,
          status: "In Progress",
          is_meeting_active: false,
        },
      });
    }
    return res.status(401).json({ message: "Unauthorized access" });
  } catch (err) {
    console.error("Create Meeting Error:", err);
    return res.status(500).json({ error: err.message });
  }
};

const scheduleNewDate = async (req, res) => {
  try {
    const { case_id, mediator_id } = req.params;
    const { scheduled_date: new_scheduled_date } = req.body;
    const token = req.cookies.auth_token;

    // Check mediator authorization
    const isMediator = await isLoggedIn(mediator_id, token);
    if (isMediator === 2) {
      const caseDetails = await Case.findOne({
        _id: case_id,
        assigned_mediator: mediator_id,
      });

      if (!caseDetails) {
        return res.status(404).json({
          message: "Case not found or not assigned to this mediator",
        });
      }
      const existingHearing = await Hearing.findOne({ case_id });

      if (!existingHearing) {
        return res.status(404).json({ message: "Hearing not found" });
      }
      // Update only scheduled_date using findOneAndUpdate
      const updatedHearing = await Hearing.findOneAndUpdate(
        { case_id },
        {
          scheduled_date: new_scheduled_date,
          $set: {
            online_details: {
              is_meeting_active:
                new Date() >=
                new Date(new_scheduled_date).getTime() - 5 * 60000,
              meet_link: existingHearing?.online_details?.meet_link,
            },
          },
        },
        { new: true }
      );

      if (!updatedHearing) {
        return res.status(404).json({ message: "Hearing not found" });
      }

      return res.status(200).json({
        message: "Scheduled date updated successfully",
        data: {
          case_id,
          scheduled_date: new_scheduled_date,
          meeting_link: updatedHearing.online_details?.meet_link || null,
        },
      });
    }
    return res.status(401).json({ message: "Unauthorized access" });
  } catch (err) {
    console.error("Schedule New Date Error:", err);
    return res.status(500).json({ error: err.message });
  }
};

const scheduleVenue = async (req, res) => {
  try {
    const { case_id, mediator_id } = req.params;
    const { meeting_address } = req.body;
    const token = req.cookies.auth_token;

    // Check mediator authorization
    const isMediator = await isLoggedIn(mediator_id, token);
    if (isMediator !== 2) {
      return res.status(401).json({ message: "Unauthorized access" });
    }

    // Validate case and mediator association
    const caseDetails = await Case.findOne({
      _id: case_id,
      assigned_mediator: mediator_id,
    });

    if (!caseDetails) {
      return res.status(404).json({
        message: "Case not found or not assigned to this mediator",
      });
    }

    if (caseDetails.mediation_mode !== "Offline") {
      return res.status(400).json({
        message: "Venue can only be scheduled for offline mediation cases",
      });
    }

    // Find existing hearing
    const existingHearing = await Hearing.findOne({
      case_id,
      mediator_id,
    });

    if (!existingHearing) {
      return res.status(404).json({ message: "Hearing not found" });
    }

    await Case.findByIdAndUpdate(case_id, {
      $set: { status: "In Progress" },
    });

    // Update hearing with offline venue details
    const updatedHearing = await Hearing.findOneAndUpdate(
      {
        case_id,
        mediator_id,
      },
      {
        $set: {
          offline_details: {
            meeting_address,
          },
        },
      },
      { new: true }
    );

    return res.status(200).json({
      message: "Venue scheduled successfully",
      data: {
        case_id,
        mediator_id,
        meeting_address: updatedHearing.offline_details.meeting_address,
      },
    });
  } catch (err) {
    console.error("Schedule Venue Error:", err);
    return res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createMediator,
  findMediatorById,
  deleteMediatorById,
  changeStatus,
  fetchMyCases,
  uploadDocument,
  acceptCase,
  rejectCase,
  createMeeting,
  scheduleNewDate,
  scheduleVenue,
};
