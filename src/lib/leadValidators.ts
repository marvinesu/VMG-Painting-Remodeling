/**
 * Shared validator for flexible/conversational leads
 * (chatbot, footer quick form, generic /api/lead).
 */
import type { LeadValidator } from "./leadEndpoint";
import {
  clean,
  cleanMultiline,
  isValidEmail,
  isValidPhone,
  looksSuspicious,
  type FieldErrors
} from "./validation";
import { COUNTY_OPTIONS, SERVICE_OPTIONS } from "./leadOptions";

export const genericLeadValidator: LeadValidator = (body) => {
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

  const subject = leadType.includes("Chatbot")
    ? "New Chatbot Lead - VMG Painting & Remodeling"
    : "New Website Lead - VMG Painting & Remodeling";

  // Structured lead for CMS storage: select values must match known options;
  // anything else is preserved inside the message body.
  const knownServices = SERVICE_OPTIONS.includes(service as (typeof SERVICE_OPTIONS)[number]) ? [service] : [];
  const knownCounty = COUNTY_OPTIONS.includes(county as (typeof COUNTY_OPTIONS)[number]) ? county : undefined;
  const storedMessage = [
    details || "(no project details provided)",
    "",
    knownServices.length === 0 && service ? `Service (as entered): ${service}` : "",
    !knownCounty && county ? `County (as entered): ${county}` : "",
    location ? `Project location: ${location}` : "",
    timeline ? `Timeline: ${timeline}` : "",
    budget ? `Budget range: ${budget}` : "",
    owner ? `Property owner: ${owner}` : ""
  ]
    .filter((line, index) => line !== "" || index === 1)
    .join("\n");

  return {
    errors,
    subject,
    leadType,
    replyTo: email || undefined,
    lead: {
      name,
      email,
      phone,
      serviceNeeded: knownServices,
      city: location,
      county: knownCounty,
      message: storedMessage,
      preferredContactMethod: contactMethod || undefined,
      sourcePage: page,
      consent
    },
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
      { label: "Consent to Contact", value: consent ? "Yes — agreed to be contacted by phone, text, or email" : "" },
      { label: "Page Source", value: page }
    ]
  };
};
