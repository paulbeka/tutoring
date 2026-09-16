import { expect, test } from "./fixtures";
import AxeBuilder from "@axe-core/playwright";

test("loads without runtime errors and shows all core sections", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  await expect(page).toHaveTitle(/Bekaert & Pastuszka/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "A sharper mind.",
  );
  await expect(
    page.getByRole("heading", { name: "Paul Bekaert", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Katarzyna Pastuszka", exact: true }),
  ).toBeVisible();
  await page.screenshot({ path: ".qa/desktop.png", fullPage: true });
  await page.screenshot({ path: ".qa/desktop-hero.png" });
  expect(errors).toEqual([]);
});

test("subject discovery prefills an enquiry and FAQ disclosures work", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Find your starting point" }).click();
  await expect(page).toHaveURL(/#subjects$/);
  const card = page.locator(".subject-card").first();
  await card.locator("summary").click();
  await expect(card.getByText("Data structures and algorithms")).toBeVisible();
  await card.getByRole("link", { name: "Let’s work on this" }).click();
  await expect(page.getByRole("combobox")).toHaveValue("Coding & development");
  await page
    .getByText("Do I need to know how to code already?", { exact: true })
    .click();
  await expect(page.locator(".faq-item").first()).toHaveAttribute("open", "");
  await page.getByText("Who is the tutoring for?", { exact: true }).click();
  await expect(page.locator(".faq-item").first()).not.toHaveAttribute(
    "open",
    "",
  );
  await expect(page.locator(".faq-item").nth(1)).toHaveAttribute("open", "");
});

test("mobile navigation works and layouts do not overflow", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  await expect(page.getByRole("navigation")).not.toBeVisible();
  await page.getByRole("button", { name: "Open navigation" }).click();
  await expect(page.getByRole("navigation")).toBeVisible();
  await page.getByRole("link", { name: "Who we are" }).click();
  await expect(page).toHaveURL(/#about$/);
  await expect(page.getByRole("navigation")).not.toBeVisible();
  await page.getByRole("button", { name: "Open navigation" }).click();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("navigation")).not.toBeVisible();
  await page.goto("/");
  await page.screenshot({ path: ".qa/mobile.png", fullPage: true });
  await page.screenshot({ path: ".qa/mobile-hero.png" });
  for (const width of [320, 375, 390, 700, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
      `Horizontal overflow at ${width}px`,
    ).toBeLessThanOrEqual(width);
  }
});

test("meets automated WCAG AA accessibility checks", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(
    results.violations.map((violation) => ({
      id: violation.id,
      description: violation.description,
      nodes: violation.nodes.map((node) => ({
        target: node.target,
        summary: node.failureSummary,
      })),
    })),
  ).toEqual([]);
});
