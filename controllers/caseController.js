const Case = require("../Models/Case");
const User = require("../Models/User");
const Mediator = require("../Models/Mediator");
const { isLoggedIn } = require("../controllers/authController");

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
  fetchMyCases,
  uploadDocument,
};
