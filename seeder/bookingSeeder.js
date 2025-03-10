const Booking = require("../Models/Booking");
const connectDB = require("../config/db");

const bookings = [
  {
    _id: "BOOK1001",
    case_id: "CASE1001",
    created_by: "USER1001",
    scheduled_date: new Date(),
    booking_mode: "Online",
    status: "Booked",
    booked_at: new Date(),
  },
  {
    _id: "BOOK1002",
    case_id: "CASE1002",
    created_by: "USER1003",
    scheduled_date: new Date(),
    booking_mode: "Offline",
    status: "In Progress",
    booked_at: new Date(),
  },
  {
    _id: "BOOK1003",
    case_id: "CASE1003",
    created_by: "USER1005",
    scheduled_date: new Date(),
    booking_mode: "Online",
    status: "Booked",
    booked_at: new Date(),
  },
  {
    _id: "BOOK1004",
    case_id: "CASE1004",
    created_by: "USER1007",
    scheduled_date: new Date(),
    booking_mode: "Online",
    status: "Booked",
    booked_at: new Date(),
  },
  {
    _id: "BOOK1005",
    case_id: "CASE1005",
    created_by: "USER1009",
    scheduled_date: new Date(),
    booking_mode: "Offline",
    status: "In Progress",
    booked_at: new Date(),
  },
  {
    _id: "BOOK1006",
    case_id: "CASE1006",
    created_by: "USER1011",
    scheduled_date: new Date(),
    booking_mode: "Online",
    status: "Booked",
    booked_at: new Date(),
  },
  {
    _id: "BOOK1007",
    case_id: "CASE1007",
    created_by: "USER1013",
    scheduled_date: new Date(),
    booking_mode: "Offline",
    status: "Booked",
    booked_at: new Date(),
  },
  {
    _id: "BOOK1008",
    case_id: "CASE1008",
    created_by: "USER1015",
    scheduled_date: new Date(),
    booking_mode: "Offline",
    status: "In Progress",
    booked_at: new Date(),
  },
  {
    _id: "BOOK1009",
    case_id: "CASE1009",
    created_by: "USER1017",
    scheduled_date: new Date(),
    booking_mode: "Online",
    status: "Booked",
    booked_at: new Date(),
  },
  {
    _id: "BOOK1010",
    case_id: "CASE1010",
    created_by: "USER1019",
    scheduled_date: new Date(),
    booking_mode: "Offline",
    status: "Booked",
    booked_at: new Date(),
  },
  {
    _id: "BOOK1011",
    case_id: "CASE1011",
    created_by: "USER1021",
    scheduled_date: new Date(),
    booking_mode: "Online",
    status: "In Progress",
    booked_at: new Date(),
  },
  {
    _id: "BOOK1012",
    case_id: "CASE1012",
    created_by: "USER1023",
    scheduled_date: new Date(),
    booking_mode: "Online",
    status: "Booked",
    booked_at: new Date(),
  },
  {
    _id: "BOOK1013",
    case_id: "CASE1013",
    created_by: "USER1025",
    scheduled_date: new Date(),
    booking_mode: "Offline",
    status: "Booked",
    booked_at: new Date(),
  },
  {
    _id: "BOOK1014",
    case_id: "CASE1014",
    created_by: "USER1027",
    scheduled_date: new Date(),
    booking_mode: "Online",
    status: "Booked",
    booked_at: new Date(),
  },
  {
    _id: "BOOK1015",
    case_id: "CASE1015",
    created_by: "USER1029",
    scheduled_date: new Date(),
    booking_mode: "Offline",
    status: "In Progress",
    booked_at: new Date(),
  },
  {
    _id: "BOOK1016",
    case_id: "CASE1001",
    created_by: "USER1001",
    scheduled_date: new Date(),
    booking_mode: "Online",
    status: "Cancelled",
    booked_at: new Date(),
  },
  {
    _id: "BOOK1017",
    case_id: "CASE1004",
    created_by: "USER1007",
    scheduled_date: new Date(),
    booking_mode: "Offline",
    status: "Cancelled",
    booked_at: new Date(),
  },
  {
    _id: "BOOK1018",
    case_id: "CASE1006",
    created_by: "USER1011",
    scheduled_date: new Date(),
    booking_mode: "Offline",
    status: "Cancelled",
    booked_at: new Date(),
  },
  {
    _id: "BOOK1019",
    case_id: "CASE1010",
    created_by: "USER1019",
    scheduled_date: new Date(),
    booking_mode: "Online",
    status: "Cancelled",
    booked_at: new Date(),
  },
  {
    _id: "BOOK1020",
    case_id: "CASE1012",
    created_by: "USER1023",
    scheduled_date: new Date(),
    booking_mode: "Offline",
    status: "Cancelled",
    booked_at: new Date(),
  },
];

(async function () {
  connectDB();
  try {
    await Booking.deleteMany();
    console.log("Booking collection flushed!!!");

    await Booking.insertMany(bookings);
    console.log("Booking collection seeded!!!");
    process.exit();
  } catch (err) {
    console.log("Error flushing or seeding Booking data", err);
    process.exit(1);
  }
})();
