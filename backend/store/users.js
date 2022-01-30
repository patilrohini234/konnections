const User = require("../models/userModel");

exports.upsertUser = async (user) => {
  const { email } = user;
  const userexists = await User.findOne({ email });
  if (!userexists) {
    const newuser = new User(user);
    await newuser.save();
    return true;
  }
  return false;
};
