const Hearing = require("../Models/Hearing");
const connectDB = require("../config/db");

const hearings = [
  {
    _id: "HEARING1001",
    case_id: "CASE1001",
    booking_id: "BOOK1001",
    user_ids: ["USER1001", "USER1002"],
    mediator_id: "MED1001",
    status: "Completed",
    scheduled_date: new Date(),
    created_at: new Date(),
  },
  {
    _id: "HEARING1002",
    case_id: "CASE1002",
    booking_id: "BOOK1002",
    user_ids: ["USER1003", "USER1004"],
    mediator_id: "MED1002",
    status: "Ongoing",
    scheduled_date: new Date(),
    created_at: new Date(),
  },
  {
    _id: "HEARING1003",
    case_id: "CASE1003",
    booking_id: "BOOK1003",
    user_ids: ["USER1005", "USER1006"],
    mediator_id: "MED1003",
    status: "Scheduled",
    scheduled_date: new Date(),
    created_at: new Date(),
  },
  {
    _id: "HEARING1004",
    case_id: "CASE1004",
    booking_id: "BOOK1004",
    user_ids: ["USER1007", "USER1008"],
    mediator_id: "MED1004",
    status: "Cancelled",
    scheduled_date: new Date(),
    created_at: new Date(),
  },
  {
    _id: "HEARING1005",
    case_id: "CASE1005",
    booking_id: "BOOK1005",
    user_ids: ["USER1009", "USER1010"],
    mediator_id: "MED1005",
    offline_details: { meeting_address: "Chennai Mediation Center" },
    status: "Scheduled",
    scheduled_date: new Date(),
    created_at: new Date(),
  },
  {
    _id: "HEARING1006",
    case_id: "CASE1006",
    booking_id: "BOOK1006",
    user_ids: ["USER1011", "USER1012"],
    mediator_id: "MED1006",
    status: "Ongoing",
    scheduled_date: new Date(),
    created_at: new Date(),
  },
  {
    _id: "HEARING1007",
    case_id: "CASE1007",
    booking_id: "BOOK1007",
    user_ids: ["USER1013", "USER1014"],
    mediator_id: "MED1007",
    status: "Scheduled",
    scheduled_date: new Date(),
    created_at: new Date(),
  },
  {
    _id: "HEARING1008",
    case_id: "CASE1008",
    booking_id: "BOOK1008",
    user_ids: ["USER1015", "USER1016"],
    mediator_id: "MED1008",
    status: "Completed",
    scheduled_date: new Date(),
    created_at: new Date(),
  },
  {
    _id: "HEARING1009",
    case_id: "CASE1009",
    booking_id: "BOOK1009",
    user_ids: ["USER1017", "USER1018"],
    mediator_id: "MED1009",
    status: "Ongoing",
    scheduled_date: new Date(),
    created_at: new Date(),
  },
  {
    _id: "HEARING1010",
    case_id: "CASE1010",
    booking_id: "BOOK1010",
    user_ids: ["USER1019", "USER1020"],
    mediator_id: "MED1010",
    status: "Scheduled",
    scheduled_date: new Date(),
    created_at: new Date(),
  },
  {
    _id: "HEARING1011",
    case_id: "CASE1011",
    booking_id: "BOOK1011",
    user_ids: ["USER1021", "USER1022"],
    mediator_id: "MED1003",
    status: "Completed",
    scheduled_date: new Date(),
    created_at: new Date(),
  },
  {
    _id: "HEARING1012",
    case_id: "CASE1012",
    booking_id: "BOOK1012",
    user_ids: ["USER1023", "USER1024"],
    mediator_id: "MED1004",
    status: "Ongoing",
    scheduled_date: new Date(),
    created_at: new Date(),
  },
  {
    _id: "HEARING1013",
    case_id: "CASE1013",
    booking_id: "BOOK1013",
    user_ids: ["USER1025", "USER1026"],
    mediator_id: "MED1005",
    status: "Scheduled",
    scheduled_date: new Date(),
    created_at: new Date(),
  },
  {
    _id: "HEARING1014",
    case_id: "CASE1014",
    booking_id: "BOOK1014",
    user_ids: ["USER1027", "USER1028"],
    mediator_id: "MED1006",
    status: "Completed",
    scheduled_date: new Date(),
    created_at: new Date(),
  },
  {
    _id: "HEARING1015",
    case_id: "CASE1015",
    booking_id: "BOOK1015",
    user_ids: ["USER1029", "USER1030"],
    mediator_id: "MED1007",
    status: "Scheduled",
    scheduled_date: new Date(),
    created_at: new Date(),
  },
];

(async function () {
  connectDB();
  try {
    await Hearing.deleteMany();
    console.log("Hearing collection flushed!!!");

    await Hearing.insertMany(hearings);
    console.log("Hearing collection seeded!!!");
    process.exit();
  } catch (err) {
    console.log("Error flushing or seeding Hearing data", err);
    process.exit(1);
  }
})();
