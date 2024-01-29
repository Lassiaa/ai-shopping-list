import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { auth } from "../utils/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

import style from "../assets/style";

const SignInForm = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onLogin = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        navigate("/groups");
        console.log(user);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
      });
  };

  return (
    <>
      <h2 className={style.loginHeader}>Sign in</h2>

      {/* <p className={style.error}>{errorMessage}</p> */}

      <input
        className={style.loginInput}
        id="email-address"
        type="email"
        placeholder="username or email"
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <input
        className={style.loginInput}
        id="password"
        type="password"
        placeholder="password"
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <div>
        <button className={style.loginButton} onClick={onLogin} type="submit">
          Sign in
        </button>
      </div>
    </>
  );
};

export default SignInForm;
