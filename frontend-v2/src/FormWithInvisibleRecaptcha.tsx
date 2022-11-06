import React from "react";
import axios from "axios";
import ReCAPTCHA from "react-google-recaptcha";

const FormWithInvisibleRecaptcha: React.FC = () => {
  const recaptchaRef = React.useRef<any>();
  const [recaptchaResult, setRecaptchaResult] = React.useState<any>(null);

  const handleClickRegister = React.useCallback(async () => {
    const token = await recaptchaRef.current.executeAsync();
    console.log(
      "FormWithInvisibleRecaptcha::handleClickRegister > token: ",
      token
    );

    const recaptchaResponse = await axios.post(
      "/api/recaptcha/verify/v2/invisible",
      {
        token,
      }
    );
    const recaptchaResult = recaptchaResponse.data;
    console.log(
      "FormWithInvisibleRecaptcha::handleClickRegister > recaptchaResult: ",
      recaptchaResult
    );

    setRecaptchaResult(recaptchaResult);
  }, []);

  return (
    <div className="Form" data-testid="FormWithInvisibleRecaptcha">
      <div>
        <label>
          <span>username: </span>
          <input type="text" />
        </label>
      </div>

      <ReCAPTCHA
        sitekey="6LddDOMiAAAAABxIoS4Fu6gkXWloiL0Gt2kJ0Dhm"
        size="invisible"
        ref={recaptchaRef}
      />

      <button onClick={handleClickRegister}>register</button>

      {recaptchaResult && (
        <div data-testid="RecaptchaResult">
          {recaptchaResult.success ? "SUCCESS" : "FAIL"}
        </div>
      )}
    </div>
  );
};

export default FormWithInvisibleRecaptcha;
