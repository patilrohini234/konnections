const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware.js");
const { searchByName, getByContactNumber } = require("../controllers/contacts");

router.route("/").get(protect, searchByName);
router.route("/:phoneNumber").get(protect, getByContactNumber);
module.exports = router;
