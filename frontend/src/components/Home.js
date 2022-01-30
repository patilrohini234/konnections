import React, { useState } from "react";
import axios from "axios";
import Card from "react-bootstrap/Card";
import "./home.css";
import config from "../config";

function Home({ user }) {
  const [contacts, setContacts] = useState([]);
  const [isLoading, setIsLoading] = useState(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e) => {
    if (e.key === "Enter") {
      e.target.value = e.target.value.trim();
      if (e.target.value === "") return;
      if (isNumber(e.target.value)) {
        setIsLoading(true);
        setContacts([]);
        setSearched(false);
        const res = await axios.get(
          `${config.BACKEND_HOST}/contacts/${e.target.value}`,
          {
            headers: {
              Authorization: `Bearer ${user.authtoken}`,
            },
          }
        );
        setContacts([res.data.contact]);
        setIsLoading(false);
        setSearched(true);
      } else {
        setIsLoading(true);
        setContacts([]);
        setSearched(false);
        const res = await axios.get(`${config.BACKEND_HOST}/contacts`, {
          params: { name: e.target.value },
          headers: {
            Authorization: `Bearer ${user.authtoken}`,
          },
        });
        setContacts(res.data.contacts);
        setIsLoading(false);
        setSearched(true);
      }
    }
  };

  const isNumber = (input) => {
    return !isNaN(input) && parseInt(input).toString().length === 10;
  };

  return (
    <div className="container">
      {user ? (
        <>
          <p className="title">Get contact information on anyone</p>
          <input
            id="input"
            type="search"
            placeholder="Search with name or contact number"
            onKeyDown={handleSearch}
          ></input>

          <div className="contacts">
            {isLoading && (
              <div class="spinner-border text-info" role="status"></div>
            )}
            {contacts.length === 0 && searched && (
              <>
                <Card style={{ width: "18rem", margin: "5px" }}>
                  <Card.Body>
                    <Card.Title>
                      You bumb, go find some other name to search.
                    </Card.Title>
                  </Card.Body>
                </Card>
              </>
            )}
            {contacts.map((contact) => (
              <>
                <Card style={{ width: "18rem", margin: "5px" }}>
                  <Card.Body>
                    <Card.Title>{contact.displayName.name}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">
                      {contact.contactNumber}
                    </Card.Subtitle>
                    <hr></hr>
                    <Card.Text>
                      <p>{`DOB : ${contact.address}`}</p>
                      <p>{`Address : ${contact.address}`}</p>
                    </Card.Text>
                  </Card.Body>
                </Card>
              </>
            ))}
          </div>
        </>
      ) : (
        <div className="box">
          <p>
            Always Free. join now and start today and get contact information
            and connect with people that matters to you
          </p>
        </div>
      )}
    </div>
  );
}

export default Home;
