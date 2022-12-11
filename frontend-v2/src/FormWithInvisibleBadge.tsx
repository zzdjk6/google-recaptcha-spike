import React from "react";
import axios from "axios";
import ReCAPTCHA from "react-google-recaptcha";
import trim from "lodash/trim";

const SITE_KEY = trim(process.env.REACT_APP_RECAPTCHA_KEY_INVISIBLE);

const FormWithInvisibleBadge: React.FC = () => {
  const [username, setUsername] = React.useState("");
  const [registrationResult, setRegistrationResult] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState("");

  const recaptchaRef = React.useRef<ReCAPTCHA | null>(null);

  const handleUsernameChange = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const value = trim(event.target.value);
    setUsername(value);
  }, []);

  const handleClickRegister = React.useCallback(async () => {
    let recaptchaToken = "";
    try {
      recaptchaToken = (await recaptchaRef.current?.executeAsync()) || "";
      console.log("FormWithInvisibleBadge::handleClickRegister > recaptchaToken: ", recaptchaToken);
    } catch (e) {
      console.error(e);
      alert("Fail to get recaptcha token");
    }

    try {
      const response = await axios.post("/api/user/registration", {
        username,
        recaptchaToken,
        recaptchaVersion: "V2_INVISIBLE",
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
  }, [username]);

  return (
    <div className="Form" data-testid="FormWithInvisibleBadge" data-registration-result={registrationResult}>
      <div>
        <label>
          <span>username: </span>
          <input type="text" name="username" value={username} onChange={handleUsernameChange} />
        </label>
      </div>

      <ReCAPTCHA sitekey={SITE_KEY} size="invisible" ref={recaptchaRef} />

      <button type="button" onClick={handleClickRegister}>
        register
      </button>

      {errorMessage && <div className="Error">{errorMessage}</div>}
    </div>
  );
};

export default FormWithInvisibleBadge;
