import type { Access } from "payload";

/** Any authenticated user of the admin `users` collection. */
export const adminsOnly: Access = ({ req: { user } }) => Boolean(user);

/** Admins see everything; the public only reads published documents. */
export const publishedOrAdmin: Access = ({ req: { user } }) => {
  if (user) return true;
  return { published: { equals: true } };
};

/** Nobody — used to disable an operation entirely. */
export const noOne: Access = () => false;

/** Anyone (used only where the spec explicitly allows public create). */
export const anyone: Access = () => true;
