const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.CLIENT_ID);

exports.protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      if (!token) res.status(401).send({ msg: "Missing token in request." });

      const { authToken: idToken } = jwt.verify(token, process.env.JWT_SECRET);
      const ticket = await client.verifyIdToken({
        idToken,
        audience: process.env.CLIENT_ID,
      });
      if (!ticket) {
        return null;
      }
      next();
    } catch (error) {
      res.status(401).send({ msg: "Not authorized, token failed" });
    }
  } else {
    res.status(401).send({ msg: "Missing token in request." });
  }
};
