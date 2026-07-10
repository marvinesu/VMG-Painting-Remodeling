/**
 * Single source of truth for lead form / chatbot options.
 * Used by the form components (to render), the API endpoints (to validate),
 * and the chatbot widget (serialized into its config).
 */

export const SERVICE_OPTIONS = [
  "Interior Painting",
  "Exterior Painting",
  "Siding",
  "Roofing",
  "Windows Installation",
  "Wood Deck",
  "Composite Deck",
  "Custom Deck",
  "Remodeling Services",
  "Multiple Services",
  "Not Sure Yet"
] as const;

export const COUNTY_OPTIONS = [
  "Thurston County",
  "Pierce County",
  "King County",
  "Snohomish County",
  "Other"
] as const;

export const TIMELINE_OPTIONS = [
  "As soon as possible",
  "Within 1-2 weeks",
  "Within 30 days",
  "In 1-3 months",
  "Just planning"
] as const;

export const TIME_OPTIONS = ["Morning", "Afternoon", "Evening", "Flexible"] as const;

export const BUDGET_OPTIONS = [
  "Under $5,000",
  "$5,000-$10,000",
  "$10,000-$25,000",
  "$25,000-$50,000",
  "$50,000+",
  "Not sure yet"
] as const;

export const OWNER_OPTIONS = ["Yes", "No", "I am helping the owner"] as const;

export const CONTACT_METHOD_OPTIONS = ["Phone Call", "Text Message", "Email"] as const;
