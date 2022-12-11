import express from "express";
import _ from "lodash";
import axios from "axios";
const app = express();
const port = 9876;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

type VerifyRecaptchaTokenArgs = {
  secret: string;
  token: string;
};
const verifyRecaptchaToken = async (args: VerifyRecaptchaTokenArgs) => {
  const { secret, token } = args;
  if (!token || !secret) {
    throw new Error("reCAPTCHA secret or token is invalid");
  }

  const response = await axios.post(
    "https://www.google.com/recaptcha/api/siteverify",
    undefined,
    {
      params: { secret, response: token },
    }
  );

  console.log("reCAPTCHA siteverify result: ", response.data);

  if (!response.data.success) {
    throw new Error("reCAPTCHA token is invalid");
  }

  // Special handling for v3
  const score = _.toNumber(_.get(response.data, "score"));
  const action = _.toString(_.get(response.data, "action"));
  if (action === "register" && score < 0.5) {
    throw new Error("Bot detected!");
  }
};

const getSecretByRecaptchaVersion = (version: string) => {
  switch (version) {
    case "V2_CHECKBOX":
      return "6LdH6-IiAAAAAB9ENqqRh8TMMwXVG5BTqydTjZoh";
    case "V2_INVISIBLE":
      return "6LddDOMiAAAAAIQybpd0_XUpvSI6RBn8lDTIsKMg";
    case "V3":
      return "6LcmreIiAAAAACTFMqenXmeoH_VQ2CA4Xitd0d6Q";
    default:
      throw new Error("reCAPTCHA secret not found");
  }
};

const validateUsername = (username: string) => {
  if (username.length < 2) {
    throw new Error("Invalid username");
  }
};

app.post("/api/user/registration", async (req, res) => {
  const recaptchaVersion = _.trim(_.get(req.body, "recaptchaVersion"));
  const username = _.trim(_.get(req.body, "username"));
  const token = _.trim(_.get(req.body, "recaptchaToken"));

  try {
    validateUsername(username);
    const secret = getSecretByRecaptchaVersion(recaptchaVersion);
    await verifyRecaptchaToken({ token, secret });
    // ... Register ...
    res.status(201).json({ result: "SUCCESS", username });
  } catch (e) {
    console.error(e);
    res.status(400).json({
      result: "FAIL",
      error: _.get(e, "message") ? _.get(e, "message") : JSON.stringify(e),
    });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
