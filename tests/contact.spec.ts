import type { Page } from "@playwright/test";
import { test, expect } from "./fixtures";

async function fillEnquiry(page: Page) {
  await page.goto("/#contact");
  await page.getByLabel("Your name", { exact: true }).fill("Alex Test");
  await page
    .getByLabel("Email address", { exact: true })
    .fill("alex@example.com");
  await page.getByRole("combobox").selectOption("Mathematics & finance");
  await page
    .getByLabel("A little about you", { exact: true })
    .fill("I would like help preparing for quant interviews.");
}

test("validates fields and verification before submitting", async ({
  page,
}) => {
  const posts: string[] = [];
  page.on("request", (request) => {
    if (request.method() === "POST") posts.push(request.url());
  });
  await page.goto("/#contact");
  await page.getByRole("button", { name: "Send enquiry" }).click();
  expect(
    await page
      .locator('input[name="name"]')
      .evaluate((el) => (el as HTMLInputElement).validity.valueMissing),
  ).toBe(true);
  await fillEnquiry(page);
  await page.getByRole("button", { name: "Send enquiry" }).click();
  await expect(page.getByRole("alert")).toContainText(
    "complete the human verification",
  );
  await page.getByRole("button", { name: "Verify test captcha" }).click();
  await page.getByLabel("A little about you", { exact: true }).fill("   ");
  await page.getByRole("button", { name: "Send enquiry" }).click();
  await expect(page.getByRole("alert")).toContainText(
    "complete all the fields",
  );
  expect(posts).toEqual([]);
});

test("sends the expected enquiry once, waits for acceptance, and clears on success", async ({
  page,
}) => {
  let release!: () => void;
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  const payloads: Record<string, unknown>[] = [];
  await page.route("https://api.web3forms.com/submit", async (route) => {
    payloads.push(route.request().postDataJSON());
    await gate;
    await route.fulfill({ json: { success: true } });
  });
  await fillEnquiry(page);
  await page.getByRole("button", { name: "Verify test captcha" }).click();
  await page.getByRole("button", { name: "Send enquiry" }).click();
  await expect(
    page.getByRole("button", { name: "Sending…", exact: true }),
  ).toBeDisabled();
  await expect(page.getByRole("status")).toHaveText("Sending your enquiry…");
  await page
    .getByRole("form")
    .evaluate((form) =>
      form.dispatchEvent(
        new Event("submit", { bubbles: true, cancelable: true }),
      ),
    );
  await expect.poll(() => payloads.length).toBe(1);
  expect(payloads[0]).toMatchObject({
    access_key: "test-form-key-never-use-for-delivery",
    name: "Alex Test",
    email: "alex@example.com",
    replyto: "alex@example.com",
    interest: "Mathematics & finance",
    message: "I would like help preparing for quant interviews.",
    subject: "Tutoring enquiry — Mathematics & finance",
    "h-captcha-response": "test-captcha-token",
    botcheck: false,
  });
  release();
  await expect(page.getByRole("status")).toContainText(
    "your enquiry has been submitted",
  );
  await expect(page.getByLabel("Your name", { exact: true })).toHaveValue("");
  await expect(page.getByRole("combobox")).toHaveValue("");
  await expect(
    page.getByLabel("A little about you", { exact: true }),
  ).toHaveValue("");
  await page
    .locator(".enquiry-form")
    .screenshot({ path: ".qa/enquiry-success.png" });
});

for (const failure of [
  "rejected",
  "http-error",
  "network",
  "malformed",
  "rate-limit",
  "timeout",
] as const) {
  test(`preserves enquiry on ${failure} and supports a verified retry`, async ({
    page,
  }) => {
    await page.route("https://api.web3forms.com/submit", (route) => {
      if (failure === "network") return route.abort();
      if (failure === "timeout") return new Promise<void>(() => {});
      if (failure === "malformed")
        return route.fulfill({
          contentType: "text/html",
          body: "<h1>Unavailable</h1>",
        });
      return route.fulfill({
        status:
          failure === "rate-limit" ? 429 : failure === "http-error" ? 500 : 200,
        json: { success: failure === "http-error" },
      });
    });
    await fillEnquiry(page);
    if (failure === "timeout") await page.clock.install();
    await page.getByRole("button", { name: "Verify test captcha" }).click();
    await page.getByRole("button", { name: "Send enquiry" }).click();
    if (failure === "timeout") await page.clock.fastForward(20_001);
    await expect(page.getByRole("alert")).toContainText(
      "Your message is still here",
    );
    await expect(page.getByLabel("Your name", { exact: true })).toHaveValue(
      "Alex Test",
    );
    await expect(page.getByRole("combobox")).toHaveValue(
      "Mathematics & finance",
    );
    await expect(
      page.getByLabel("A little about you", { exact: true }),
    ).toHaveValue("I would like help preparing for quant interviews.");
    await page.getByRole("button", { name: "Send enquiry" }).click();
    await expect(page.getByRole("alert")).toContainText(
      "complete the human verification",
    );
    await page.route("https://api.web3forms.com/submit", (route) =>
      route.fulfill({ json: { success: true } }),
    );
    await page.getByRole("button", { name: "Verify test captcha" }).click();
    await page.getByRole("button", { name: "Send enquiry" }).click();
    await expect(page.getByRole("status")).toContainText(
      "your enquiry has been submitted",
    );
  });
}

test("expired or failed CAPTCHA cannot be submitted and can recover", async ({
  page,
}) => {
  await fillEnquiry(page);
  await page.getByRole("button", { name: "Verify test captcha" }).click();
  await page.evaluate(() =>
    window.dispatchEvent(new Event("test-captcha-expire")),
  );
  await expect(page.getByRole("alert")).toContainText("Verification expired");
  await page.getByRole("button", { name: "Send enquiry" }).click();
  await expect(page.locator(".form-feedback")).toContainText(
    "complete the human verification",
  );
  await page.evaluate(() =>
    window.dispatchEvent(new Event("test-captcha-error")),
  );
  await expect(page.locator(".captcha-error")).toContainText(
    "Verification couldn’t load",
  );
  await page.getByRole("button", { name: "Retry verification" }).click();
  await page.getByRole("button", { name: "Verify test captcha" }).click();
  await expect(page.locator(".captcha-error")).toHaveCount(0);
  await expect(page.getByLabel("Your name", { exact: true })).toHaveValue(
    "Alex Test",
  );
});

test("missing configuration disables sending with an honest explanation", async ({
  page,
}) => {
  await page.route("**/src/contactConfig.ts*", (route) =>
    route.fulfill({
      contentType: "application/javascript",
      body: 'export const web3formsAccessKey = "";',
    }),
  );
  await page.goto("/#contact");
  await expect(page.getByRole("alert")).toContainText(
    "Enquiries are temporarily unavailable",
  );
  await expect(
    page.getByRole("button", { name: "Send enquiry" }),
  ).toBeDisabled();
  await expect(
    page.getByRole("button", { name: "Verify test captcha" }),
  ).toHaveCount(0);
});
