import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

import { onAuthStateChanged } from "firebase/auth";
import { auth, firestore } from "../utils/firebase";

import style from "../assets/style";

const Header = ({ onToggleButton }) => {
  const [username, setUsername] = useState("");
  const [buttonText, setButtonText] = useState("Ai generator");

  const navigate = useNavigate();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;

        try {
          const userDoc = firestore.collection("users").doc(uid);
          userDoc.get().then((doc) => {
            if (doc.exists) {
              const userData = doc.data();
              setUsername(userData.username);
            }
          });
        } catch (error) {
          console.log(error);
        }
      }
    });
  }, []);

  useEffect(() => {
    const pathName = window.location.pathname;

    if (pathName === "/") {
      setButtonText("Ai generator");
    } else if (pathName === "/groups") {
      setButtonText("Create group");
    }
  }, []);

  const goTo = (path) => {
    navigate(path);
  };

  return (
    <div className={style.header}>
      <h1 className={style.siteHeader} onClick={() => goTo("/")}>
        {username}
      </h1>
      <button className={style.buttonGenerator} onClick={onToggleButton}>
        {buttonText}
      </button>
    </div>
  );
};

Header.propTypes = {
  onToggleButton: PropTypes.func.isRequired,
};

export default Header;
