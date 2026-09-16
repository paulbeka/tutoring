import { useRef, useState } from "react";
import type { FormEvent } from "react";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import { web3formsAccessKey } from "./contactConfig";

type Status = "idle" | "sending" | "success" | "error";

export default function EnquiryForm({
  interest,
  onInterestChange,
  categories,
}: {
  interest: string;
  onInterestChange: (value: string) => void;
  categories: readonly string[];
}) {
  const captchaRef = useRef<HCaptcha>(null);
  const submitting = useRef(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [captchaError, setCaptchaError] = useState("");
  const [captchaVersion, setCaptchaVersion] = useState(0);
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const configured = Boolean(web3formsAccessKey);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current || !configured) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    if (data.get("botcheck")) return;

    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const enquiry = String(data.get("message") ?? "").trim();
    if (
      !name ||
      !email ||
      !enquiry ||
      (!categories.includes(interest) &&
        interest !== "a little guidance on where to start")
    ) {
      setStatus("error");
      setMessage("Please complete all the fields before sending your enquiry.");
      return;
    }
    if (!captchaToken) {
      setStatus("error");
      setMessage("Please complete the human verification before sending.");
      return;
    }

    submitting.current = true;
    setStatus("sending");
    setMessage("Sending your enquiry…");
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 20_000);
    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        signal: controller.signal,
        body: JSON.stringify({
          access_key: web3formsAccessKey,
          name,
          email,
          replyto: email,
          interest,
          message: enquiry,
          subject: `Tutoring enquiry — ${interest}`,
          from_name: "Bekaert & Pastuszka website",
          "h-captcha-response": captchaToken,
          botcheck: false,
        }),
      });
      const result: unknown = await response.json();
      if (
        !response.ok ||
        typeof result !== "object" ||
        result === null ||
        !("success" in result) ||
        result.success !== true
      ) {
        setStatus("error");
        setMessage(
          response.status === 429
            ? "The enquiry service is temporarily busy. Your message is still here; please try again later."
            : "Your enquiry could not be accepted. Your message is still here; please complete the verification again and retry.",
        );
        return;
      }
      form.reset();
      onInterestChange("");
      setStatus("success");
      setMessage(
        "Thank you — your enquiry has been submitted. Paul or Katarzyna will get back to you by email.",
      );
    } catch {
      setStatus("error");
      setMessage(
        "We couldn’t confirm your enquiry was submitted. Your message is still here. Please check your connection and try again; retrying may send a duplicate.",
      );
    } finally {
      window.clearTimeout(timeout);
      submitting.current = false;
      setCaptchaToken(null);
      captchaRef.current?.resetCaptcha();
    }
  }

  return (
    <form
      className="enquiry-form"
      onSubmit={submit}
      aria-label="Tutoring enquiry"
    >
      <fieldset disabled={status === "sending" || !configured}>
        <div className="form-row">
          <label>
            Your name
            <input
              name="name"
              autoComplete="name"
              placeholder="Alex Taylor"
              required
              maxLength={100}
            />
          </label>
          <label>
            Email address
            <input
              name="email"
              type="email"
              autoComplete="email"
              placeholder="alex@example.com"
              required
              maxLength={254}
            />
          </label>
        </div>
        <label>
          What would you like to work on?
          <span className="select-wrap">
            <select
              name="interest"
              value={interest}
              onChange={(event) => onInterestChange(event.target.value)}
              required
            >
              <option value="" disabled>
                Select your starting point
              </option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
              <option value="a little guidance on where to start">
                I’m not sure yet — let’s figure it out
              </option>
            </select>
            <ChevronDown size={17} />
          </span>
        </label>
        <label>
          A little about you
          <textarea
            name="message"
            placeholder="What are you studying? What would you like to achieve? Tell us where you are and where you want to go."
            rows={4}
            required
            maxLength={3000}
          />
        </label>
        <div hidden aria-hidden="true">
          <input
            type="checkbox"
            name="botcheck"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>
        {configured && (
          <div className="captcha-wrap">
            <p className="captcha-label">Please confirm you’re human</p>
            <HCaptcha
              key={captchaVersion}
              ref={captchaRef}
              sitekey="50b2fe65-b00b-4b9e-ad62-3ba471098be2"
              size="compact"
              reCaptchaCompat={false}
              onVerify={(token) => {
                setCaptchaToken(token);
                setCaptchaError("");
              }}
              onExpire={() => {
                setCaptchaToken(null);
                setCaptchaError(
                  "Verification expired. Please complete it again.",
                );
              }}
              onChalExpired={() => {
                setCaptchaToken(null);
                setCaptchaError("Verification expired. Please try again.");
              }}
              onError={() => {
                setCaptchaToken(null);
                setCaptchaError(
                  "Verification couldn’t load. Check your connection or content blocker, then retry.",
                );
              }}
            />
            {captchaError && (
              <div className="captcha-error">
                <p role="alert">{captchaError}</p>
                <button
                  type="button"
                  className="text-link"
                  onClick={() => {
                    setCaptchaToken(null);
                    setCaptchaError("");
                    setCaptchaVersion((version) => version + 1);
                  }}
                >
                  Retry verification
                </button>
              </div>
            )}
          </div>
        )}
        <div className="form-bottom">
          <span>
            Every good plan starts
            <br />
            with a conversation.
          </span>
          <button className="button button-primary" type="submit">
            {status === "sending" ? "Sending…" : "Send enquiry"}
            <ArrowUpRight size={17} />
          </button>
        </div>
      </fieldset>
      {!configured && (
        <p className="form-feedback form-feedback-error" role="alert">
          Enquiries are temporarily unavailable. Please try again later.
        </p>
      )}
      <p
        className={`form-feedback${status === "error" ? " form-feedback-error" : ""}`}
        role={status === "error" ? "alert" : "status"}
        aria-atomic="true"
      >
        {message}
      </p>
      <p className="form-note">
        Your details are sent to us through{" "}
        <a
          href="https://web3forms.com/privacy"
          target="_blank"
          rel="noreferrer"
        >
          Web3Forms
        </a>{" "}
        to respond to your enquiry. Human verification is provided by{" "}
        <a
          href="https://www.hcaptcha.com/privacy"
          target="_blank"
          rel="noreferrer"
        >
          hCaptcha
        </a>
        .
      </p>
    </form>
  );
}
