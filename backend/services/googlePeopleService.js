const { google } = require("googleapis");

exports.getContacts = (accessToken) =>
  new Promise((resolve, reject) => {
    const oauth2Client = new google.auth.OAuth2(
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET,
      process.env.REDIRECT_URI
    );
    oauth2Client.setCredentials({ refresh_token: accessToken });

    const service = google.people({
      version: "v1",
      auth: oauth2Client,
    });

    service.people.connections.list(
      {
        resourceName: "people/me",
        pageSize: 200,
        sortOrder: "LAST_MODIFIED_DESCENDING",
        personFields: "names,phoneNumbers,emailAddresses,addresses,birthdays",
      },
      (err, res) => {
        if (err) return reject(err);
        return resolve(res.data.connections);
      }
    );
  });
