import { test as base, expect } from "@playwright/test";

// Never send real enquiries or contact CAPTCHA services from automated tests.
export const test = base.extend({
  page: async ({ page }, use) => {
    await page.route("https://api.web3forms.com/**", (route) =>
      route.fulfill({
        status: 503,
        json: { success: false, message: "Unmocked test request" },
      }),
    );
    await page.route(/https:\/\/[^/]*hcaptcha\.com\//, (route) =>
      route.abort(),
    );
    await page.addInitScript(() => {
      let token = "";
      let latest: Record<string, (...args: string[]) => void> = {};
      const widgets = new Map<string, HTMLElement>();
      let nextId = 0;
      Object.assign(window, {
        hcaptcha: {
          render(element: HTMLElement, options: typeof latest) {
            const id = String(++nextId);
            latest = options;
            const button = document.createElement("button");
            button.type = "button";
            button.textContent = "Verify test captcha";
            button.style.cssText =
              "width:164px;height:144px;color:#193f35;background:#faf9f5;border:1px solid #777";
            button.onclick = () => {
              token = "test-captcha-token";
              options.callback(token);
            };
            element.replaceChildren(button);
            widgets.set(id, element);
            return id;
          },
          reset() {
            token = "";
          },
          remove(id: string) {
            widgets.get(id)?.replaceChildren();
            widgets.delete(id);
          },
          getResponse() {
            return token;
          },
          getRespKey() {
            return "test-response-key";
          },
        },
      });
      window.addEventListener("test-captcha-expire", () =>
        latest["expired-callback"](),
      );
      window.addEventListener("test-captcha-error", () =>
        latest["error-callback"]("network-error"),
      );
    });
    await use(page);
  },
});
export { expect };
