import type { APIRoute } from "astro";
import { handleLeadRequest } from "../../lib/leadEndpoint";
import {
  clean,
  cleanMultiline,
  inList,
  isValidEmail,
  isValidPhone,
  looksSuspicious,
  pickFromList,
  type FieldErrors
} from "../../lib/validation";
import {
  BUDGET_OPTIONS,
  CONTACT_METHOD_OPTIONS,
  COUNTY_OPTIONS,
  OWNER_OPTIONS,
  SERVICE_OPTIONS,
  TIMELINE_OPTIONS,
  TIME_OPTIONS
} from "../../lib/leadOptions";

export const prerender = false;

export const POST: APIRoute = (context) =>
  handleLeadRequest(context, (body) => {
    const errors: FieldErrors = {};

    const name = clean(body.name, 120);
    const phone = clean(body.phone, 30);
    const email = clean(body.email, 254);
    const address = clean(body.address, 200);
    const city = clean(body.city, 100);
    const county = clean(body.county, 60);
    const countyOther = clean(body.countyOther, 120);
    const projectTypes = pickFromList(body.projectTypes, SERVICE_OPTIONS);
    const details = cleanMultiline(body.details);
    const timeline = clean(body.timeline, 60);
    const preferredDate = clean(body.preferredDate, 40);
    const preferredTime = clean(body.preferredTime, 40);
    const budget = clean(body.budget, 40);
    const owner = clean(body.owner, 60);
    const ownerRelationship = clean(body.ownerRelationship, 200);
    const contactMethod = clean(body.contactMethod, 40);
    const consent = body.consent === true || body.consent === "true" || body.consent === "on";
    const page = clean(body.page, 200);

    if (!name) errors.name = "Please enter your full name.";
    if (!phone) errors.phone = "Please enter your phone number.";
    else if (!isValidPhone(phone)) errors.phone = "Please enter a valid phone number.";
    if (!email) errors.email = "Please enter your email address.";
    else if (!isValidEmail(email)) errors.email = "Please enter a valid email address.";
    if (!address) errors.address = "Please enter the project address.";
    if (!city) errors.city = "Please enter the city.";
    if (!county || !inList(county, COUNTY_OPTIONS)) errors.county = "Please choose a county.";
    if (county === "Other" && !countyOther)
      errors.countyOther = "Please enter your county or service location.";
    if (projectTypes.length === 0) errors.projectTypes = "Please choose at least one project type.";
    if (!details) errors.details = "Please describe your project.";
    else if (looksSuspicious(details)) errors.details = "Please remove links from the description.";
    if (!timeline || !inList(timeline, TIMELINE_OPTIONS))
      errors.timeline = "Please choose when you would like to start.";
    if (preferredTime && !inList(preferredTime, TIME_OPTIONS))
      errors.preferredTime = "Please choose a valid time preference.";
    if (budget && !inList(budget, BUDGET_OPTIONS)) errors.budget = "Please choose a valid budget range.";
    if (!owner || !inList(owner, OWNER_OPTIONS))
      errors.owner = "Please tell us if you are the property owner.";
    if (owner === "No" && !ownerRelationship)
      errors.ownerRelationship = "Please describe your relationship to the property owner.";
    if (!contactMethod || !inList(contactMethod, CONTACT_METHOD_OPTIONS))
      errors.contactMethod = "Please choose a preferred contact method.";

    const countyValue = county === "Other" && countyOther ? `Other — ${countyOther}` : county;
    const ownerValue = owner === "No" && ownerRelationship ? `No — ${ownerRelationship}` : owner;

    const storedMessage = [
      details,
      "",
      `Timeline: ${timeline}`,
      preferredDate ? `Preferred estimate date: ${preferredDate}` : "",
      preferredTime ? `Preferred time: ${preferredTime}` : "",
      budget ? `Budget range: ${budget}` : "",
      `Property owner: ${ownerValue}`,
      county === "Other" && countyOther ? `Service location: ${countyOther}` : ""
    ]
      .filter((line, index) => line !== "" || index === 1)
      .join("\n");

    return {
      errors,
      subject: "New Free Estimate Request - VMG Painting & Remodeling",
      leadType: "Free Estimate Request",
      replyTo: email || undefined,
      lead: {
        name,
        email,
        phone,
        serviceNeeded: projectTypes,
        projectAddress: address,
        city,
        county,
        message: storedMessage,
        preferredContactMethod: contactMethod,
        sourcePage: page,
        consent
      },
      rows: [
        { label: "Name", value: name },
        { label: "Phone", value: phone },
        { label: "Email", value: email },
        { label: "Project Address", value: address },
        { label: "City", value: city },
        { label: "County", value: countyValue },
        { label: "Project Type(s)", value: projectTypes.join(", ") },
        { label: "Project Details", value: details },
        { label: "Timeline", value: timeline },
        { label: "Preferred Estimate Date", value: preferredDate },
        { label: "Preferred Time", value: preferredTime },
        { label: "Budget Range", value: budget },
        { label: "Property Owner", value: ownerValue },
        { label: "Preferred Contact Method", value: contactMethod },
        { label: "Consent to Contact", value: consent ? "Yes — agreed to be contacted by phone, text, or email" : "" },
        { label: "Page Source", value: page }
      ]
    };
  });
