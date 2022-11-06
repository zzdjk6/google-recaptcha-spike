import { test, expect } from "@playwright/test";

test("bot should not be able to register", async ({ page }) => {
  await page.goto("http://localhost:9874", { waitUntil: "networkidle" });

  const registerButtonLocator = page.getByRole("button", { name: "register" });
  const recaptchaResultLocator = page.getByTestId("RecaptchaResult");

  // Click the get started link.
  await registerButtonLocator.click();

  // Expects the URL to contain intro.
  await expect(recaptchaResultLocator).toHaveText("FAIL");
});
