import { test, expect } from "@playwright/test";

test("bot should not be able to register", async ({ browser }) => {
  const context = await browser.newContext({ userAgent: "BadUserAgent" });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:9874", { waitUntil: "networkidle" });

  const registerButtonLocator = page.getByRole("button", { name: "register" });
  const recaptchaResultLocator = page.getByTestId("RecaptchaResult");

  // Click the get started link.
  await registerButtonLocator.click();

  // Expects the URL to contain intro.
  await expect(recaptchaResultLocator).toHaveText("FAIL");
});
