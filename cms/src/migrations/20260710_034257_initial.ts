import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`users_sessions\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`created_at\` text,
  	\`expires_at\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`users_sessions_order_idx\` ON \`users_sessions\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`users_sessions_parent_id_idx\` ON \`users_sessions\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`users\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`enable_a_p_i_key\` integer,
  	\`api_key\` text,
  	\`api_key_index\` text,
  	\`email\` text NOT NULL,
  	\`reset_password_token\` text,
  	\`reset_password_expiration\` text,
  	\`salt\` text,
  	\`hash\` text,
  	\`login_attempts\` numeric DEFAULT 0,
  	\`lock_until\` text
  );
  `)
  await db.run(sql`CREATE INDEX \`users_updated_at_idx\` ON \`users\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`users_created_at_idx\` ON \`users\` (\`created_at\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`users_email_idx\` ON \`users\` (\`email\`);`)
  await db.run(sql`CREATE TABLE \`media\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`alt\` text NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`url\` text,
  	\`thumbnail_u_r_l\` text,
  	\`filename\` text,
  	\`mime_type\` text,
  	\`filesize\` numeric,
  	\`width\` numeric,
  	\`height\` numeric,
  	\`focal_x\` numeric,
  	\`focal_y\` numeric,
  	\`sizes_card_url\` text,
  	\`sizes_card_width\` numeric,
  	\`sizes_card_height\` numeric,
  	\`sizes_card_mime_type\` text,
  	\`sizes_card_filesize\` numeric,
  	\`sizes_card_filename\` text,
  	\`sizes_feature_url\` text,
  	\`sizes_feature_width\` numeric,
  	\`sizes_feature_height\` numeric,
  	\`sizes_feature_mime_type\` text,
  	\`sizes_feature_filesize\` numeric,
  	\`sizes_feature_filename\` text
  );
  `)
  await db.run(sql`CREATE INDEX \`media_updated_at_idx\` ON \`media\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`media_created_at_idx\` ON \`media\` (\`created_at\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`media_filename_idx\` ON \`media\` (\`filename\`);`)
  await db.run(sql`CREATE INDEX \`media_sizes_card_sizes_card_filename_idx\` ON \`media\` (\`sizes_card_filename\`);`)
  await db.run(sql`CREATE INDEX \`media_sizes_feature_sizes_feature_filename_idx\` ON \`media\` (\`sizes_feature_filename\`);`)
  await db.run(sql`CREATE TABLE \`pages\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`slug\` text NOT NULL,
  	\`content\` text NOT NULL,
  	\`excerpt\` text,
  	\`meta_title\` text,
  	\`meta_description\` text,
  	\`featured_image_id\` integer,
  	\`published\` integer DEFAULT false,
  	\`published_at\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`featured_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`pages_slug_idx\` ON \`pages\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`pages_featured_image_idx\` ON \`pages\` (\`featured_image_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_updated_at_idx\` ON \`pages\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`pages_created_at_idx\` ON \`pages\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`updates\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`slug\` text NOT NULL,
  	\`content\` text NOT NULL,
  	\`excerpt\` text,
  	\`featured_image_id\` integer,
  	\`category\` text,
  	\`published\` integer DEFAULT false,
  	\`published_at\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`featured_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`updates_slug_idx\` ON \`updates\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`updates_featured_image_idx\` ON \`updates\` (\`featured_image_id\`);`)
  await db.run(sql`CREATE INDEX \`updates_updated_at_idx\` ON \`updates\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`updates_created_at_idx\` ON \`updates\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`leads_service_needed\` (
  	\`order\` integer NOT NULL,
  	\`parent_id\` integer NOT NULL,
  	\`value\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`leads\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`leads_service_needed_order_idx\` ON \`leads_service_needed\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`leads_service_needed_parent_idx\` ON \`leads_service_needed\` (\`parent_id\`);`)
  await db.run(sql`CREATE TABLE \`leads\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`email\` text,
  	\`phone\` text,
  	\`project_address\` text,
  	\`city\` text,
  	\`county\` text,
  	\`message\` text NOT NULL,
  	\`preferred_contact_method\` text,
  	\`source_page\` text,
  	\`status\` text DEFAULT 'new' NOT NULL,
  	\`consent\` integer DEFAULT false NOT NULL,
  	\`ip_address\` text,
  	\`user_agent\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`leads_updated_at_idx\` ON \`leads\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`leads_created_at_idx\` ON \`leads\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`chats_messages\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`sender\` text NOT NULL,
  	\`text\` text NOT NULL,
  	\`timestamp\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`chats\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`chats_messages_order_idx\` ON \`chats_messages\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`chats_messages_parent_id_idx\` ON \`chats_messages\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`chats\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`session_id\` text NOT NULL,
  	\`user_name\` text,
  	\`user_email\` text,
  	\`user_phone\` text,
  	\`service_needed\` text,
  	\`status\` text DEFAULT 'open',
  	\`lead_id\` integer,
  	\`source_page\` text,
  	\`ip_address\` text,
  	\`user_agent\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`lead_id\`) REFERENCES \`leads\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`chats_session_id_idx\` ON \`chats\` (\`session_id\`);`)
  await db.run(sql`CREATE INDEX \`chats_lead_idx\` ON \`chats\` (\`lead_id\`);`)
  await db.run(sql`CREATE INDEX \`chats_updated_at_idx\` ON \`chats\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`chats_created_at_idx\` ON \`chats\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`security_logs\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`event_type\` text NOT NULL,
  	\`ip_address\` text,
  	\`user_agent\` text,
  	\`route\` text,
  	\`description\` text NOT NULL,
  	\`severity\` text DEFAULT 'low' NOT NULL,
  	\`metadata\` text,
  	\`timestamp\` text NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`security_logs_updated_at_idx\` ON \`security_logs\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`security_logs_created_at_idx\` ON \`security_logs\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`admin_docs\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`slug\` text NOT NULL,
  	\`category\` text,
  	\`content\` text,
  	\`published\` integer DEFAULT false,
  	\`internal_only\` integer DEFAULT true,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`admin_docs_slug_idx\` ON \`admin_docs\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`admin_docs_updated_at_idx\` ON \`admin_docs\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`admin_docs_created_at_idx\` ON \`admin_docs\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`deployment_checklists_checklist\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`item\` text NOT NULL,
  	\`completed\` integer DEFAULT false,
  	\`notes\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`deployment_checklists\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`deployment_checklists_checklist_order_idx\` ON \`deployment_checklists_checklist\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`deployment_checklists_checklist_parent_id_idx\` ON \`deployment_checklists_checklist\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`deployment_checklists\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`environment\` text,
  	\`last_reviewed\` text,
  	\`published\` integer DEFAULT false,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`deployment_checklists_updated_at_idx\` ON \`deployment_checklists\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`deployment_checklists_created_at_idx\` ON \`deployment_checklists\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`payload_kv\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`key\` text NOT NULL,
  	\`data\` text NOT NULL
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`payload_kv_key_idx\` ON \`payload_kv\` (\`key\`);`)
  await db.run(sql`CREATE TABLE \`payload_locked_documents\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`global_slug\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_global_slug_idx\` ON \`payload_locked_documents\` (\`global_slug\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_updated_at_idx\` ON \`payload_locked_documents\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_created_at_idx\` ON \`payload_locked_documents\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`payload_locked_documents_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`users_id\` integer,
  	\`media_id\` integer,
  	\`pages_id\` integer,
  	\`updates_id\` integer,
  	\`leads_id\` integer,
  	\`chats_id\` integer,
  	\`security_logs_id\` integer,
  	\`admin_docs_id\` integer,
  	\`deployment_checklists_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_locked_documents\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`pages_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`updates_id\`) REFERENCES \`updates\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`leads_id\`) REFERENCES \`leads\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`chats_id\`) REFERENCES \`chats\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`security_logs_id\`) REFERENCES \`security_logs\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`admin_docs_id\`) REFERENCES \`admin_docs\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`deployment_checklists_id\`) REFERENCES \`deployment_checklists\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_order_idx\` ON \`payload_locked_documents_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_parent_idx\` ON \`payload_locked_documents_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_path_idx\` ON \`payload_locked_documents_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_users_id_idx\` ON \`payload_locked_documents_rels\` (\`users_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_media_id_idx\` ON \`payload_locked_documents_rels\` (\`media_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_pages_id_idx\` ON \`payload_locked_documents_rels\` (\`pages_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_updates_id_idx\` ON \`payload_locked_documents_rels\` (\`updates_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_leads_id_idx\` ON \`payload_locked_documents_rels\` (\`leads_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_chats_id_idx\` ON \`payload_locked_documents_rels\` (\`chats_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_security_logs_id_idx\` ON \`payload_locked_documents_rels\` (\`security_logs_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_admin_docs_id_idx\` ON \`payload_locked_documents_rels\` (\`admin_docs_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_deployment_checklists_id_idx\` ON \`payload_locked_documents_rels\` (\`deployment_checklists_id\`);`)
  await db.run(sql`CREATE TABLE \`payload_preferences\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`key\` text,
  	\`value\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_preferences_key_idx\` ON \`payload_preferences\` (\`key\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_updated_at_idx\` ON \`payload_preferences\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_created_at_idx\` ON \`payload_preferences\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`payload_preferences_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`users_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_preferences\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_order_idx\` ON \`payload_preferences_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_parent_idx\` ON \`payload_preferences_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_path_idx\` ON \`payload_preferences_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_users_id_idx\` ON \`payload_preferences_rels\` (\`users_id\`);`)
  await db.run(sql`CREATE TABLE \`payload_migrations\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text,
  	\`batch\` numeric,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_migrations_updated_at_idx\` ON \`payload_migrations\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`payload_migrations_created_at_idx\` ON \`payload_migrations\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`smtp_settings\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`enabled\` integer DEFAULT true,
  	\`smtp_host\` text DEFAULT 'smtp.hostinger.com' NOT NULL,
  	\`smtp_port\` numeric DEFAULT 465 NOT NULL,
  	\`smtp_secure\` integer DEFAULT true,
  	\`smtp_user\` text DEFAULT 'info@vmgpaintingnremodelingllc.com' NOT NULL,
  	\`smtp_password\` text,
  	\`smtp_password_encrypted\` text,
  	\`smtp_from_email\` text DEFAULT 'info@vmgpaintingnremodelingllc.com' NOT NULL,
  	\`smtp_from_name\` text DEFAULT 'VMG Painting & Remodeling' NOT NULL,
  	\`lead_notify_email\` text DEFAULT 'vmgpaintingnremodelingllc@gmail.com' NOT NULL,
  	\`reply_to_email\` text DEFAULT 'vmgpaintingnremodelingllc@gmail.com',
  	\`test_recipient_email\` text,
  	\`last_test_status\` text,
  	\`last_tested_at\` text,
  	\`internal_notes\` text,
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`users_sessions\`;`)
  await db.run(sql`DROP TABLE \`users\`;`)
  await db.run(sql`DROP TABLE \`media\`;`)
  await db.run(sql`DROP TABLE \`pages\`;`)
  await db.run(sql`DROP TABLE \`updates\`;`)
  await db.run(sql`DROP TABLE \`leads_service_needed\`;`)
  await db.run(sql`DROP TABLE \`leads\`;`)
  await db.run(sql`DROP TABLE \`chats_messages\`;`)
  await db.run(sql`DROP TABLE \`chats\`;`)
  await db.run(sql`DROP TABLE \`security_logs\`;`)
  await db.run(sql`DROP TABLE \`admin_docs\`;`)
  await db.run(sql`DROP TABLE \`deployment_checklists_checklist\`;`)
  await db.run(sql`DROP TABLE \`deployment_checklists\`;`)
  await db.run(sql`DROP TABLE \`payload_kv\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_preferences\`;`)
  await db.run(sql`DROP TABLE \`payload_preferences_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_migrations\`;`)
  await db.run(sql`DROP TABLE \`smtp_settings\`;`)
}
