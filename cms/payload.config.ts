import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildConfig } from "payload";
import { sqliteAdapter } from "@payloadcms/db-sqlite";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import sharp from "sharp";

import { Users } from "./src/collections/Users";
import { Media } from "./src/collections/Media";
import { Pages } from "./src/collections/Pages";
import { Updates } from "./src/collections/Updates";
import { Leads } from "./src/collections/Leads";
import { Chats } from "./src/collections/Chats";
import { SecurityLogs } from "./src/collections/SecurityLogs";
import { AdminDocs } from "./src/collections/AdminDocs";
import { DeploymentChecklists } from "./src/collections/DeploymentChecklists";
import { SMTPSettings } from "./src/globals/SMTPSettings";
import { testSmtpEndpoint } from "./src/endpoints/testSmtp";
import { seed } from "./src/seed";

const dirname = path.dirname(fileURLToPath(import.meta.url));

if (!process.env.PAYLOAD_SECRET) {
  // Never run production without a real secret; this fallback only lets local
  // tooling (type generation, first build) work before .env is created.
  console.error("[cms] WARNING: PAYLOAD_SECRET is not set. Set it before deploying.");
}

export default buildConfig({
  secret: process.env.PAYLOAD_SECRET || "insecure-local-dev-secret-set-payload-secret",
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL || undefined,
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname, "src")
    },
    meta: {
      titleSuffix: " — VMG CMS"
    }
  },
  editor: lexicalEditor(),
  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URI || "file:./vmg-cms.db"
    }
  }),
  collections: [Users, Media, Pages, Updates, Leads, Chats, SecurityLogs, AdminDocs, DeploymentChecklists],
  globals: [SMTPSettings],
  endpoints: [testSmtpEndpoint],
  graphQL: {
    disable: true
  },
  telemetry: false,
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, "src/payload-types.ts")
  },
  onInit: async (payload) => {
    await seed(payload);
  }
});
