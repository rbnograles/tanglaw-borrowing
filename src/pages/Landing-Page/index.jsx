import React, { Fragment, useState } from "react";
// utitlities
import TanglawLogo from "../../assets/tanglawlogo.png";
import "./landing.css";
import { Link } from "react-router-dom";
// component
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Button } from "@mui/material";
import LoadingButton from "../../components/LoadingButton";
import StudentLogin from "../Auth/StudentLogin";
import FacultyLogin from "../Auth/FacultyLogin";
// firebase
import { SystemLogs } from "../../context/LogsContext";
import { UserAuth } from "../../context/AuthContext";
import { UserProfile } from "../../context/UsersProfileContext";
import { errorMessageEnhancer } from "../../utilities/firebaseErrorTextEnhancer";

const Index = () => {
  // states
  const [isSignningIn, setIsSignningIn] = useState(false);
  const [currentRedner, setCurrentRender] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState("");
  // context functions for firebase auth
  const { signinUser, logout } = UserAuth();
  const { checkUserTypeAndRedirect, getUserProfile, updateLastLoginDate } =
    UserProfile();
  const { createSystemLogs } = SystemLogs();
  /**
   * This function is used for logging in on both students and faculty
   * checkUserTypeAndRedirect is a function for redirecting on intended user page
   * eg. student => /home
   * eg. faculty/super-admin => /dashboard
   */
  const signIn = async () => {
    setIsSignningIn(true);
    try {
      const user = await signinUser(email, password);
      if (user) {
        await updateLastLoginDate(user.user.uid);
        /**
         * Creates logged in logs for the system administrator
         * @param{string} message
         * @param{string} email
         */
        const profile = await getUserProfile(user.user.uid);
        await createSystemLogs(
          "Logged in to the system.",
          email,
          profile[0].userType
        );
        const userType = await checkUserTypeAndRedirect(
          user.user.uid,
          currentRedner
        );
        // handles the checking if user logs properly on the designated route
        if (userType !== null) {
          setErrors("Email does not exist");
          // removed current session generated from login
          logout();
        }
      }
      setIsSignningIn(false);
    } catch (error) {
      setIsSignningIn(false);
      setErrors(errorMessageEnhancer(error.message));
    }
  };
  /**
   * This function reset the state of email and password field
   * Used for change log in type
   * @param {string} renderType
   */
  const setCurrentRenderAndResetState = (renderType) => {
    setCurrentRender(renderType);
    setEmail("");
    setPassword("");
  };

  return (
    <div className="tg-background-image">
      <div className="pane">
        <div className="flex justify-center m-10 mt-32">
          <Link to="/">
            <img src={TanglawLogo} className="logo" alt="tanglaw-logo" />
          </Link>
        </div>
        <h1 className="page-title">
          <b>Tanglaw Thesis Archive</b>
        </h1>
        <div className="indexbutton">
          {renderLoginOption(
            currentRedner,
            email,
            password,
            isSignningIn,
            errors,
            setCurrentRenderAndResetState,
            signIn,
            setEmail,
            setPassword
          )}
          <section className="indextos">
            <p>
              By using this service, you understood and agree to the Tanglaw
              Online Services
              <a href="https://www.Tanglaw.edu.ph/terms/"> Terms of Use</a> and
              <a href="https://www.Tanglaw.edu.ph/privacy/">
                {" "}
                Privacy Statement
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

/**
 *
 * @param {null|student|faculty} currentRedner
 * @param {string} email
 * @param {string} password
 * @param {boolean} isSignningIn
 * @param {array of object} errors
 * @param {method for changing currentRender} setCurrentRender
 * @param {method for signing up} signIn
 * @param {method for setting studentNumber} setEmail
 * @param {method for setting password} setPassword
 * @returns {Component for Student/Faculty Sign in and Selection}
 */
const renderLoginOption = (
  currentRedner,
  email,
  password,
  isSignningIn,
  errors,
  setCurrentRender,
  signIn,
  setEmail,
  setPassword
) => {
  if (currentRedner === null) {
    return (
      <Fragment>
        <p>↓ Please click or tap your destination.</p>
        <div className="flex flex-col button-container">
          <Button
            className="button blue"
            onClick={() => {
              setCurrentRender("student");
            }}
          >
            Student
          </Button>
          <Button
            className="button red"
            onClick={() => {
              setCurrentRender("faculty");
            }}
          >
            Faculty
          </Button>
        </div>
      </Fragment>
    );
  }

  if (currentRedner === "student") {
    return (
      <Fragment>
        <p>Sign in to start your session</p>
        <div className="flex flex-col button-container">
          <StudentLogin
            setEmail={setEmail}
            setPassword={setPassword}
            email={email}
            password={password}
            errors={errors}
          />
          {isSignningIn ? (
            <LoadingButton label="Signing In" />
          ) : (
            <Button
              className="button blue"
              onClick={() => {
                signIn();
              }}
            >
              Sign in
            </Button>
          )}
          <Button
            variant="outlined"
            className="button"
            style={{ color: "black", fontWeight: "bold" }}
            onClick={() => {
              setCurrentRender(null);
            }}
          >
            <ArrowBackIcon style={{ marginRight: "5px" }} /> Return to selection
          </Button>
        </div>
      </Fragment>
    );
  }

  if (currentRedner === "faculty") {
    return (
      <Fragment>
        <p>Sign in to start your session</p>
        <div className="flex flex-col button-container">
          <FacultyLogin
            setEmail={setEmail}
            setPassword={setPassword}
            email={email}
            password={password}
            errors={errors}
          />
          {isSignningIn ? (
            <LoadingButton label="Signing In" />
          ) : (
            <Button
              className="button blue"
              onClick={() => {
                signIn();
              }}
            >
              Sign in
            </Button>
          )}
          <Button
            variant="outlined"
            className="button"
            style={{ color: "black", fontWeight: "bold" }}
            onClick={() => {
              setCurrentRender(null);
            }}
          >
            <ArrowBackIcon style={{ marginRight: "5px" }} /> Return to selection
          </Button>
        </div>
      </Fragment>
    );
  }
};

export default Index;
