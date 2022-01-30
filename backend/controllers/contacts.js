const contactsService = require("../services/contactService");

exports.searchByName = async (req, res) => {
  const name = req.query.name;
  const response = await contactsService.searchByName(name);
  res.status(response.statusCode).send(response.body);
};

exports.getByContactNumber = async (req, res) => {
  const { phoneNumber } = req.params;
  const response = await contactsService.getByContactNumber(phoneNumber);
  res.status(response.statusCode).send(response.body);
};
