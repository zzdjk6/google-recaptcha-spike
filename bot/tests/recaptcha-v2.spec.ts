import { test, expect } from "@playwright/test";

test("bot should not be able to register with checkbox recaptcha", async ({
  browser,
}) => {
  const context = await browser.newContext({ userAgent: "BadUserAgent" });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:9875", { waitUntil: "networkidle" });

  const formLocator = page.getByTestId("FormWithCheckbox");

  const recaptchaFrameLocator = formLocator
    .frameLocator(`[name^="a-"]`)
    .first();
  const recaptchaCheckboxLocator = recaptchaFrameLocator.locator(
    "div.recaptcha-checkbox-border"
  );
  await expect(recaptchaCheckboxLocator).toBeVisible();
  console.log("Captcha appears!");

  await recaptchaCheckboxLocator.click();

  try {
    const challengeFrameLocator = page.frameLocator(`[name^="c-"]`).first();
    const challengeLocator = challengeFrameLocator.locator("#rc-imageselect");
    await expect(challengeLocator).toBeVisible();
  } catch {
    const challengeFrameLocator = page.frameLocator(`[name^="c-"]`).last();
    const challengeLocator = challengeFrameLocator.locator("#rc-imageselect");
    await expect(challengeLocator).toBeVisible();
  }
  console.log("Challenge appears!");
});

test("bot should not be able to register with invisible recaptcha", async ({
  browser,
}) => {
  const context = await browser.newContext({ userAgent: "BadUserAgent" });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:9875", { waitUntil: "networkidle" });

  const formLocator = page.getByTestId("FormWithInvisibleRecaptcha");
  const registerButtonLocator = formLocator.getByRole("button", {
    name: "register",
  });
  await registerButtonLocator.click();

  try {
    const challengeFrameLocator = page.frameLocator(`[name^="c-"]`).first();
    const challengeLocator = challengeFrameLocator.locator("#rc-imageselect");
    await expect(challengeLocator).toBeVisible();
  } catch {
    const challengeFrameLocator = page.frameLocator(`[name^="c-"]`).last();
    const challengeLocator = challengeFrameLocator.locator("#rc-imageselect");
    await expect(challengeLocator).toBeVisible();
  }
  console.log("Challenge appears!");
});
