import type { APIRoute } from "astro";
import { handleLeadRequest } from "../../lib/leadEndpoint";
import { genericLeadValidator } from "../../lib/leadValidators";

export const prerender = false;

/** Generic lead intake: validates, stores in Payload CMS, and emails the owner. */
export const POST: APIRoute = (context) => handleLeadRequest(context, genericLeadValidator);
