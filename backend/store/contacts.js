const Contact = require("../models/contactModel");

exports.upsertContact = async (contact) => {
  const existingContact = await getByPhoneNumber(contact.contactNumber);
  if (!existingContact) {
    const newContact = new Contact(contact);
    await newContact.save();
    return;
  }
  const name = contact.names[0].name;
  await updateContact(existingContact, name);
};

const updateContact = async (contact, newName) => {
  const name = contact.names.find((nameObj) => nameObj.name === newName);
  if (name) {
    name.count++;
    if (name.count > contact.displayName.count) {
      contact.displayName = name;
    }
  } else {
    contact.names.push({ name: newName, count: 1 });
  }
  await contact.save();
};

const getByPhoneNumber = async (phoneNumber) => {
  const contact = await Contact.findOne({ contactNumber: phoneNumber });
  return contact;
};

exports.getByPhoneNumber = getByPhoneNumber;

exports.findByName = async (name) => {
  const contacts = await Contact.find({
    "displayName.name": new RegExp(name, "gi"),
  });
  return contacts;
};
