import React from "react";
import axios from "axios";
import ReCAPTCHA from "react-google-recaptcha";

const FormWithCheckbox: React.FC = () => {
  const [recaptchaValue, setRecaptchaValue] = React.useState<any>(null);
  const [recaptchaResult, setRecaptchaResult] = React.useState<any>(null);

  const handleRecaptchaChange = React.useCallback((value: any) => {
    console.log("FormWithCheckbox::handleRecaptchaChange > value: ", value);
    setRecaptchaValue(value);
  }, []);

  const handleClickRegister = React.useCallback(async () => {
    if (!recaptchaValue) {
      alert("click recaptcha checkbox!");
      return;
    }

    const token = await recaptchaValue;
    console.log("FormWithCheckbox::handleClickRegister > token: ", token);

    const recaptchaResponse = await axios.post(
      "/api/recaptcha/verify/v2/checkbox",
      {
        token,
      }
    );
    const recaptchaResult = recaptchaResponse.data;
    console.log(
      "FormWithCheckbox::handleClickRegister > recaptchaResult: ",
      recaptchaResult
    );

    setRecaptchaResult(recaptchaResult);
  }, [recaptchaValue]);

  return (
    <div className="Form" data-testid="FormWithCheckbox">
      <div>
        <label>
          <span>username: </span>
          <input type="text" />
        </label>
      </div>

      <ReCAPTCHA
        sitekey="6LdH6-IiAAAAAISJqrkoyhUjcZRtzWqLR0mTARrz"
        onChange={handleRecaptchaChange}
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

export default FormWithCheckbox;
