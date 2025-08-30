import { PersistedState } from "runed";
import { nanoid } from "nanoid";
import * as z from "zod/v4";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const statusSchema = z.object({
	active: z.boolean().optional(),
	version: z.string().optional(),
	world: z.string().optional(),
	system: z.string().optional(),
	users: z.number().optional(),
	partner: z.string().optional()
});

const PARTNERS = [
	{ url: "forge-vtt.com", name: "The Forge" },
	{ url: "forgevtt.com", name: "The Forge" },
	{ url: "moltenhosting.com", name: "Molten Hosting" },
	{ url: "foundryserver.com", name: "Foundry Server" }
];

export type ServerStatus = z.infer<typeof statusSchema>;

const ServerSchema = z.object({
	id: z.string(),
	label: z.string().trim().min(1, "Please enter a server name"),
	url: z.url("Please enter a valid URL"),
	notes: z.string().optional(),
	order: z.number().optional()
});

const ServerPartialSchema = ServerSchema.partial({ id: true });

export type Server = z.infer<typeof ServerSchema>;
export type ServerPartial = z.infer<typeof ServerPartialSchema>;

export const servers = new PersistedState<Server[]>("servers", []);

export function addServer(data: ServerPartial) {
	const result = ServerPartialSchema.safeParse(data);

	if (!result.success) {
		return { error: z.prettifyError(result.error) };
	}

	servers.current = [
		{
			id: nanoid(),
			order: 0,
			...result.data
		},
		...servers.current
	];

	return result;
}

export function deleteServer(id: string) {
	const result = z.string().safeParse(id);

	if (result.success) {
		servers.current = servers.current.filter((s: Server) => s.id !== result.data);
	}

	return result;
}

export function updateServer(data: Server) {
	const result = ServerSchema.safeParse(data);

	if (!result.success) {
		return { error: z.prettifyError(result.error) };
	}

	servers.current = servers.current.map((server) =>
		server.id === result.data.id ? result.data : server
	);

	servers.current = servers.current.sort((a, b) => {
		if (a.order === undefined) return 1;
		if (b.order === undefined) return -1;
		return a.order - b.order;
	});

	return result;
}

export async function getServerStatus(url: string) {
	const partner = PARTNERS.find((p) => url.includes(p.url))?.name;

	if (partner) return { partner: partner };

	// Build the status URL robustly, preserving subpaths and stripping query/hash
	let statusUrl: string;
	try {
		const parsed = new URL(url);
		let pathname = parsed.pathname.replace(/\/+$/, "");
		pathname = pathname.replace(/\/(game|join|setup)$/, "");
		const base = new URL(
			(pathname || "/").endsWith("/") ? pathname || "/" : `${pathname}/`,
			parsed.origin
		);
		statusUrl = new URL("api/status", base).toString();
	} catch {
		// Fallback for non-standard inputs
		const cleanUrl = url
			.split(/[?#]/)[0]
			.replace(/\/+$/, "")
			.replace(/\/(game|join|setup)$/, "");
		statusUrl = `${cleanUrl}/api/status`;
	}

	const response = await fetch(statusUrl, {
		method: "GET",
		headers: {
			"Content-Type": "application/json"
		}
	});

	if (response.status !== 200) {
		return;
	}

	const data: ServerStatus = await response.json();

	return data;
}
