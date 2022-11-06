const express = require("express");
const _ = require("lodash");
const axios = require("axios");
const app = express();
const port = 9876;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const verifyWithSecret = (secret) => async (req, res) => {
  console.log({ body: req.body });

  const token = _.get(req.body, "token");
  const response = await axios.post(
    "https://www.google.com/recaptcha/api/siteverify",
    undefined,
    {
      params: {
        secret,
        response: token,
      },
    }
  );

  const success = response.data.success;
  const challengeTimestamp = response.data.challenge_ts;
  const hostname = response.data.hostname;
  const errorCodes = response.data["error-codes"];

  res.json({
    success,
    challengeTimestamp,
    hostname,
    errorCodes,
  });
};

app.post("/api/recaptcha/verify/v3", async (req, res) => {
  await verifyWithSecret("6LcmreIiAAAAACTFMqenXmeoH_VQ2CA4Xitd0d6Q")(req, res);
});

app.post("/api/recaptcha/verify/v2/checkbox", async (req, res) => {
  await verifyWithSecret("6LdH6-IiAAAAAB9ENqqRh8TMMwXVG5BTqydTjZoh")(req, res);
});

app.post("/api/recaptcha/verify/v2/invisible", async (req, res) => {
  await verifyWithSecret("6LddDOMiAAAAAIQybpd0_XUpvSI6RBn8lDTIsKMg")(req, res);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
