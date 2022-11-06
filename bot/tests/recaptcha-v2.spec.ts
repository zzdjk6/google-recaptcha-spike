import { test, expect } from "@playwright/test";

test("bot should not be able to register with checkbox recaptcha", async ({
  page,
}) => {
  await page.goto("http://localhost:9875", { waitUntil: "networkidle" });

  const formLocator = page.getByTestId("FormWithCheckbox");

  const recaptchaFrame = await page
    .frames()
    .find((frame) => frame.name().startsWith("a-"));
  await recaptchaFrame!.waitForSelector("div.recaptcha-checkbox-border");
  console.log("Captcha appears!");

  await recaptchaFrame?.locator("div.recaptcha-checkbox-border").click();

  const challengeFrame = await page
    .frames()
    .find((frame) => frame.name().startsWith("c-"));
  await challengeFrame!.waitForSelector("div.rc-imageselect-challenge");
  console.log("Challenge appears!");
});
