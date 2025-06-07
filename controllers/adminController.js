const Booking = require("../Models/Booking");
const Case = require("../Models/Case");
const { v4: uuidv4 } = require("uuid");
const { isLoggedIn } = require("../controllers/authController");

//hearing status -> Scheduled,
const fileCase = async (req, res) => {
  try {
    const case_id = `CASE-${uuidv4()}`;

    const id = req.params.id;
    const booking_id = req.params.booking_id;
    const { party_ids, mediator_id, mediation_mode } = req.body;
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

module.exports = { fileCase, dissmissBooking };
