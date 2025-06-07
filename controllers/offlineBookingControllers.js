const Booking = require("../Models/Booking");
const { v4: uuidv4 } = require("uuid");

const callBooking = async (req, res) => {
  const language_arr = ["English", "Hindi", "Kannada", "Telugu", "Tamil"];
  const mediation_arr = ["Family Dispute", "Land Dispute", "Others"];
  try {
    const { phone_number, language, mediation_type } = req.body;
    const booking_id = `BOOKING-${uuidv4()}`;

    const newBooking = new Booking({
      _id: booking_id,
      booking_mode: "Offline",
      phone_number,
      language: language_arr[language - 1],
      case_type: mediation_arr[mediation_type - 1],
    });

    await newBooking.save();

    console.log({ message: "Case Booked Successfully", booking_id });

    res.status(200).json({ message: "Case Booked Successfully", booking_id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const smsBooking = async (req, res) => {
  const data = req.params.number;
  console.log(data);
  return { booking_id: "BOOKING-SAMPLE" };
};

const smsStatusCheck = async (req, res) => {
  const name = req.params.name;
  console.log(name);
  return { status: "Dummy Status", booked_at: "Now" };
};

module.exports = { callBooking, smsBooking, smsStatusCheck };
