import { z } from "zod";

export const I18nScheme = z.record(z.record(z.string()));
export const ValidURLScheme = z.union([z.string().url(), z.string().ip()]);
export const PartnerHostingScheme = z.enum([
  "forge-vtt.com",
  "moltenhosting.com",
  "foundryserver.com",
]);
export const ServerScheme = z.object({
  id: z.string().uuid(),
  host: z.union([z.string().url(), z.string().ip()]),
  label: z.string().optional(),
  status: z.enum(["Active", "Inactive", "Hosting", "Skipped", "Online", "Offline"]),
  active: z.boolean(),
  users: z.number().optional(),
  system: z.string().optional(),
  systemVersion: z.string().optional(),
});
export const ServerUpdateScheme = ServerScheme.partial();

export type I18n = z.infer<typeof I18nScheme>;
export type ValidURL = z.infer<typeof ValidURLScheme>;
export type PartnerHosting = z.infer<typeof PartnerHostingScheme>;
export type Server = z.infer<typeof ServerScheme>;
export type ServerUpdate = z.infer<typeof ServerUpdateScheme>;
