import type { APIRoute } from "astro";
import { handleLeadRequest } from "../../lib/leadEndpoint";
import {
  clean,
  cleanMultiline,
  isValidEmail,
  isValidPhone,
  looksSuspicious,
  type FieldErrors
} from "../../lib/validation";

export const prerender = false;

/**
 * Accepts leads from the native chatbot widget and the footer mini form.
 * These flows are conversational/compact, so beyond the core identity fields
 * the payload is flexible — but everything is still sanitized and the
 * choice-style answers arrive as plain strings that get length-capped.
 */
export const POST: APIRoute = (context) =>
  handleLeadRequest(context, (body) => {
    const errors: FieldErrors = {};

    const leadType = clean(body.leadType, 60) || "Chatbot Lead";
    const name = clean(body.name, 120);
    const phone = clean(body.phone, 30);
    const email = clean(body.email, 254);
    const service = clean(body.service, 120);
    const county = clean(body.county, 120);
    const location = clean(body.location, 200);
    const details = cleanMultiline(body.details);
    const timeline = clean(body.timeline, 60);
    const budget = clean(body.budget, 40);
    const owner = clean(body.owner, 120);
    const contactMethod = clean(body.contactMethod, 40);
    const consent = body.consent === true || body.consent === "true" || body.consent === "on";
    const page = clean(body.page, 200);

    if (!name) errors.name = "Please provide your name.";
    if (!phone) errors.phone = "Please provide a phone number.";
    else if (!isValidPhone(phone)) errors.phone = "Please provide a valid phone number.";
    if (email && !isValidEmail(email)) errors.email = "Please provide a valid email address.";
    if (details && looksSuspicious(details)) errors.details = "Please remove links from the description.";
    if (!consent) errors.consent = "Consent is required before submitting.";

    const subject =
      leadType === "Footer Quick Lead"
        ? "New Website Lead - VMG Painting & Remodeling"
        : "New Chatbot Lead - VMG Painting & Remodeling";

    return {
      errors,
      subject,
      leadType,
      replyTo: email || undefined,
      rows: [
        { label: "Name", value: name },
        { label: "Phone", value: phone },
        { label: "Email", value: email },
        { label: "Service(s)", value: service },
        { label: "County", value: county },
        { label: "Project Location", value: location },
        { label: "Project Details", value: details },
        { label: "Timeline", value: timeline },
        { label: "Budget Range", value: budget },
        { label: "Property Owner", value: owner },
        { label: "Preferred Contact Method", value: contactMethod },
        { label: "Consent to Contact", value: consent ? "Yes — agreed to be contacted by phone, text, or email" : "No" },
        { label: "Page Source", value: page }
      ]
    };
  });
