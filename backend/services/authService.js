const { google } = require("googleapis");
const jwt = require("jsonwebtoken");

const { OAuth2Client } = require("google-auth-library");
const oAuthClient = new OAuth2Client(process.env.CLIENT_ID);

exports.getUser = async (idToken) => {
  const ticket = await oAuthClient.verifyIdToken({
    idToken,
    audience: process.env.CLIENT_ID,
  });
  if (!ticket) {
    return null;
  }
  const { name, email, picture } = ticket.getPayload();
  return { name, email, picture };
};

exports.generateToken = (authToken) => {
  return jwt.sign({ authToken }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
};
