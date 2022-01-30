const mongoose = require("mongoose");
const User = require("../models/userModel");

const contactScema = mongoose.Schema({
  displayName: {
    name: {
      type: String,
      index: true,
    },
    count: Number,
  },
  names: [
    {
      name: String,
      count: Number,
    },
  ],
  contactNumber: {
    type: String,
    required: true,
    index: true,
    unique: true,
  },
  userEmail: {
    type: String,
  },
  address: {
    type: String,
  },
  birthdayDate: {
    type: String,
  },
  contactOf: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

const Contact = mongoose.model("Contact", contactScema);

module.exports = Contact;
