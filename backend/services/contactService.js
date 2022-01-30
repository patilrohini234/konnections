const { response } = require("./responseHelper");
const peopleService = require("./googlePeopleService");
const contactStore = require("../store/contacts");

exports.storeContacts = async (accessToken) => {
  const contacts = await peopleService.getContacts(accessToken);
  for (const contact of contacts) {
    addContact(contact);
  }
};

const addContact = async (contact) => {
  try {
    const newContact = parseContact(contact);
    if (newContact.names && newContact.contactNumber) {
      await contactStore.upsertContact(newContact);
    }
  } catch (error) {
    console.log("error while adding new contact", error);
  }
};

const parseContact = (contact) => {
  const names = parseNames(contact.names);
  const contactNumber = parsePhoneNumbers(contact.phoneNumbers);
  const userEmail = parseUserEmail(contact.emailAddresses);
  const address = parseAddress(contact.addresses);
  const birthdayDate = parseBirthdayDate(contact.birthdays);

  return {
    displayName: names[0],
    names,
    contactNumber,
    userEmail,
    address,
    birthdayDate,
  };
};

const parseNames = (names) => {
  let [{ displayName }] = Array.isArray(names)
    ? names
    : [{ displayName: null }];

  if (!displayName) return null;
  return [{ name: displayName.trim(), count: 1 }];
};

const parsePhoneNumbers = (phoneNumbers) => {
  let [{ canonicalForm }] = Array.isArray(phoneNumbers)
    ? phoneNumbers
    : [{ canonicalForm: null }];

  if (canonicalForm) {
    canonicalForm = canonicalForm.trim().slice(-10, canonicalForm.length);
  }
  return canonicalForm;
};

const parseAddress = (addresses) => {
  let [address] = Array.isArray(addresses) ? addresses : [null];
  if (!address) return null;
  let completeAddress = "";
  if (address.streetAddress)
    completeAddress += `${address.streetAddress.trim()}, `;
  if (address.extendedAddress)
    completeAddress += `${address.extendedAddress.trim()}, `;
  if (address.city) completeAddress += `${address.city.trim()}, `;
  if (address.region) completeAddress += `${address.region.trim()}, `;
  if (address.postalCode) completeAddress += `${address.postalCode.trim()}, `;
  return completeAddress;
};

const parseUserEmail = (emailAddresses) => {
  let [{ value: emailAddress }] = Array.isArray(emailAddresses)
    ? emailAddresses
    : [{ value: null }];
  if (emailAddress) emailAddress = emailAddress.trim();
  return emailAddress;
};

const parseBirthdayDate = (birthdays) => {
  let [{ text: birthDay }] = Array.isArray(birthdays)
    ? birthdays
    : [{ text: null }];
  if (birthDay) birthDay = birthDay.trim();
  return birthDay;
};

exports.searchByName = async (name) => {
  const contacts = await contactStore.findByName(name);
  return response(200, { contacts });
};

exports.getByContactNumber = async (phoneNumber) => {
  const contact = await contactStore.getByPhoneNumber(phoneNumber);
  if (!contact) {
    return response(404, { msg: "No contact Found" });
  }
  return response(200, { contact });
};
