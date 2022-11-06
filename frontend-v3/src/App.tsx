import React from "react";
import "./App.css";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import axios from "axios";

const App = () => {
  const { executeRecaptcha } = useGoogleReCaptcha();

  const [recaptchaResult, setRecaptchaResult] = React.useState<any>(null);

  const handleClickRegister = React.useCallback(async () => {
    if (!executeRecaptcha) {
      console.log("Execute recaptcha not yet available");
      return;
    }

    const token = await executeRecaptcha("register");
    console.log("App::handleClickRegister > token");
    console.log(token);

    const recaptchaResponse = await axios.post("/api/recaptcha/verify/v3", {
      token,
    });
    const recaptchaResult = recaptchaResponse.data;
    console.log(
      "App::handleClickRegister > recaptchaResult: ",
      recaptchaResult
    );

    setRecaptchaResult(recaptchaResult);
  }, [executeRecaptcha]);

  return (
    <div className="App">
      <div>
        <div>
          <label>
            <span>username: </span>
            <input type="text" />
          </label>
        </div>

        <button onClick={handleClickRegister}>register</button>

        {recaptchaResult && (
          <div data-testid="RecaptchaResult">
            {recaptchaResult.success ? "SUCCESS" : "FAIL"}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
