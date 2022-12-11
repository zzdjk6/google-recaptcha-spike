import React from "react";
import "./App.css";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import axios from "axios";
import trim from "lodash/trim";

const App = () => {
  const { executeRecaptcha } = useGoogleReCaptcha();

  const [username, setUsername] = React.useState("");
  const [registrationResult, setRegistrationResult] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState("");

  const handleUsernameChange = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const value = trim(event.target.value);
    setUsername(value);
  }, []);

  const handleClickRegister = React.useCallback(async () => {
    if (!executeRecaptcha) {
      console.log("Execute recaptcha not yet available");
      return;
    }

    const recaptchaToken = await executeRecaptcha("register");
    console.log("App::handleClickRegister > recaptchaToken: ", recaptchaToken);

    try {
      const response = await axios.post("/api/user/registration", {
        username,
        recaptchaToken,
        recaptchaVersion: "V3",
      });
      const { result } = response.data;
      console.log("FormWithInvisibleBadge::handleClickRegister > result: ", result);
      setRegistrationResult(trim(result));
      alert("Register success");
    } catch (e: any) {
      const response = e.response;
      const { result, error } = response.data;
      setRegistrationResult(trim(result));
      setErrorMessage(trim(error));
    }
  }, [executeRecaptcha, username]);

  return (
    <div className="App">
      <form className="Form" data-registration-result={registrationResult}>
        <div>
          <label>
            <span>username: </span>
            <input type="text" name="username" value={username} onChange={handleUsernameChange} />
          </label>
        </div>

        <button type="button" onClick={handleClickRegister}>
          register
        </button>

        {/*asdf*/}

        {errorMessage && <div className="Error">{errorMessage}</div>}
      </form>
    </div>
  );
};

export default App;
