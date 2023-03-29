import { z } from "zod";

export const I18n = z.record(z.record(z.string()));
export const ValidURL = z.union([z.string().url(), z.string().ip()]);
export const PartnerHosting = z.enum(["forge-vtt.com", "moltenhosting.com", "foundryserver.com"]);
export const Server = z.object({
  id: z.string().uuid(),
  host: z.union([z.string().url(), z.string().ip()]),
  label: z.string().optional(),
  status: z.enum(["Active", "Inactive", "Hosting", "Skipped", "Offline"]),
  active: z.boolean(),
  users: z.number().optional(),
  system: z.string().optional(),
  systemVersion: z.string().optional(),
});
export const ServerUpdate = Server.partial();

export type I18n = z.infer<typeof I18n>;
export type ValidURL = z.infer<typeof ValidURL>;
export type PartnerHosting = z.infer<typeof PartnerHosting>;
export type Server = z.infer<typeof Server>;
export type ServerUpdate = z.infer<typeof ServerUpdate>;
