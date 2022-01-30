import logo from "../assets/logo.png";
import React from "react";
import GoogleLogin from "react-google-login";
import axios from "axios";
import "./header.css";
import config from "../config";

function Header({ user, setUser }) {
  const handleLogin = async (googleData) => {
    const idToken = googleData.tokenId;
    const { access_token } = googleData.tokenObj;
    const res = await axios.post(`${config.BACKEND_HOST}/login`, {
      idToken,
      accessToken: access_token,
    });
    setUser(res.data.user);
    localStorage.setItem("user", JSON.stringify(res.data.user));
  };
  const handleFailure = (result) => {
    console.log(result);
  };
  const handleLogOut = () => {
    localStorage.removeItem("user");
    setUser(null);
  };
  return (
    <div id="header">
      <div id="logo">
        <img src={logo} alt="Logo" width={150} />
      </div>

      {user ? (
        <>
          <span>{user.name}</span>
          <button className="btn" onClick={handleLogOut}>
            LOGOUT
          </button>
        </>
      ) : (
        <GoogleLogin
          clientId="132278272770-3tov263qk70rqu8mgpja7jdsd974pfrc.apps.googleusercontent.com"
          buttonText="LOGIN"
          render={(renderProps) => (
            <button onClick={renderProps.onClick} className="btn">
              LOGIN
            </button>
          )}
          scope="https://www.googleapis.com/auth/contacts.readonly"
          onSuccess={handleLogin}
          onFailure={handleFailure}
          cookiePolicy={"single_host_origin"}
        />
      )}
    </div>
  );
}

export default Header;
