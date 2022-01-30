const userService = require("../services/userService");

exports.login = async (req, res) => {
  const { idToken, accessToken } = req.body;
  const response = await userService.login(idToken, accessToken);
  res.status(response.statusCode).send(response.body);
};
