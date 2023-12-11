import { z } from 'zod';

export const I18nScheme = z.record(z.record(z.string()));

export const ValidURLScheme = z.union([z.string().url(), z.string().ip()]);

export const PartnerHostingScheme = z.enum([
	'forge-vtt.com',
	'moltenhosting.com',
	'foundryserver.com'
]);

export const ServerScheme = z.object({
	id: z.string().uuid(),
	host: z.union([z.string().url(), z.string().ip()]),
	label: z.string().optional(),
	notes: z.string().optional()
});

export type I18n = z.infer<typeof I18nScheme>;
export type ValidURL = z.infer<typeof ValidURLScheme>;
export type PartnerHosting = z.infer<typeof PartnerHostingScheme>;
export type Server = z.infer<typeof ServerScheme>;
