import { useState } from "react";

import style from "../assets/style";

import SignInForm from "../components/SignInForm";
import SignUpForm from "../components/SignUpForm";

const Login = () => {
  const [formToggle, setFormToggle] = useState(true);

  const toggle = () => {
    setFormToggle(!formToggle);
  };

  return (
    <div className={style.body}>
      <div className={style.loginSection}>
        <form className={style.loginForm}>
          {formToggle ? (
            <div>
              <SignInForm />
              <p>
                Don&apos;t have an account?{" "}
                <button className={style.link} onClick={toggle} type="button">
                  Sign up
                </button>
              </p>
            </div>
          ) : (
            <div>
              <SignUpForm />
              <p>
                Already have an account?{" "}
                <button className={style.link} onClick={toggle} type="button">
                  Sign in
                </button>
              </p>
            </div>
          )}
        </form>
      </div>

      {/* {!username ? <></> : <h2 className={style.h2}>Welcome {username}!</h2>} */}
    </div>
  );
};

export default Login;
