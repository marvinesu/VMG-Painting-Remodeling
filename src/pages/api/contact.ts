import type { APIRoute } from "astro";
import { handleLeadRequest } from "../../lib/leadEndpoint";
import {
  clean,
  cleanMultiline,
  inList,
  isValidEmail,
  isValidPhone,
  looksSuspicious,
  type FieldErrors
} from "../../lib/validation";
import { CONTACT_METHOD_OPTIONS, SERVICE_OPTIONS } from "../../lib/leadOptions";

export const prerender = false;

export const POST: APIRoute = (context) =>
  handleLeadRequest(context, (body) => {
    const errors: FieldErrors = {};

    const name = clean(body.name, 120);
    const phone = clean(body.phone, 30);
    const email = clean(body.email, 254);
    const address = clean(body.address, 200);
    const cityCounty = clean(body.cityCounty, 120);
    const service = clean(body.service, 100);
    const message = cleanMultiline(body.message);
    const contactMethod = clean(body.contactMethod, 40);
    const consent = body.consent === true || body.consent === "true" || body.consent === "on";
    const page = clean(body.page, 200);

    if (!name) errors.name = "Please enter your full name.";
    if (!phone) errors.phone = "Please enter your phone number.";
    else if (!isValidPhone(phone)) errors.phone = "Please enter a valid phone number.";
    if (!email) errors.email = "Please enter your email address.";
    else if (!isValidEmail(email)) errors.email = "Please enter a valid email address.";
    if (!service || !inList(service, SERVICE_OPTIONS)) errors.service = "Please choose a service.";
    if (!message) errors.message = "Please tell us how we can help.";
    else if (looksSuspicious(message)) errors.message = "Please remove links from your message.";
    if (!contactMethod || !inList(contactMethod, CONTACT_METHOD_OPTIONS))
      errors.contactMethod = "Please choose a preferred contact method.";

    return {
      errors,
      subject: "New Contact Message - VMG Painting & Remodeling",
      leadType: "Contact Form Message",
      replyTo: email || undefined,
      lead: {
        name,
        email,
        phone,
        serviceNeeded: service ? [service] : [],
        projectAddress: address,
        city: cityCounty,
        message,
        preferredContactMethod: contactMethod,
        sourcePage: page,
        consent
      },
      rows: [
        { label: "Name", value: name },
        { label: "Phone", value: phone },
        { label: "Email", value: email },
        { label: "Property Address", value: address },
        { label: "City / County", value: cityCounty },
        { label: "Service Interested In", value: service },
        { label: "Message", value: message },
        { label: "Preferred Contact Method", value: contactMethod },
        { label: "Consent to Contact", value: consent ? "Yes — agreed to be contacted by phone, text, or email" : "" },
        { label: "Page Source", value: page }
      ]
    };
  });
