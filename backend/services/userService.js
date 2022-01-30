const authService = require("./authService");
const userStore = require("../store/users");
const contactService = require("./contactService");
const { response } = require("./responseHelper");

exports.login = async (idToken, accessToken) => {
  const user = await authService.getUser(idToken);
  if (!user) return response(404, { msg: "Unauthorized user." });
  const isNewUser = await userStore.upsertUser(user);
  if (isNewUser) contactService.storeContacts(accessToken);
  const authtoken = authService.generateToken(idToken);
  return response(200, { user: { ...user, authtoken } });
};
