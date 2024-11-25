import { fetch } from "@tauri-apps/plugin-http";
import { LocalStorage } from "$scripts/storage.svelte.js";
import { nanoid } from "nanoid";
import * as v from "valibot";

export type ServerStatus = {
	active?: boolean;
	version?: string;
	world?: string;
	system?: string;
	users?: number;
};

type StatusResponse = {
	status: ServerStatus | undefined;
	partner: string | undefined;
};

const ERROR_MESSAGES = {
	serverName: "Please enter a server name",
	validUrl: "Please enter a correct URL starting with either http:// or https://"
};

const ServerSchema = v.object({
	id: v.string(),
	label: v.pipe(v.string(), v.trim(), v.minLength(1, ERROR_MESSAGES.serverName)),
	url: v.pipe(v.string(), v.trim(), v.regex(/^https?:\/\//, ERROR_MESSAGES.validUrl)),
	notes: v.optional(v.string())
});

const ServerPartialSchema = v.omit(ServerSchema, ["id"]);

export type Server = v.InferOutput<typeof ServerSchema>;
export type ServerPartial = v.InferOutput<typeof ServerPartialSchema>;

const PARTNERS = [
	{ url: "forge-vtt.com", name: "The Forge" },
	{ url: "forgevtt.com", name: "The Forge" },
	{ url: "moltenhosting.com", name: "Molten Hosting" },
	{ url: "foundryserver.com", name: "Foundry Server" }
];

const storage = new LocalStorage<Server[]>("servers", []);
export let servers = $state<LocalStorage<Server[]>>(storage);

export function addServer(data: ServerPartial) {
	const result = v.safeParse(ServerPartialSchema, data);

	if (!result.success) {
		return result;
	}

	servers.current = [
		{
			id: nanoid(),
			...result.output
		},
		...servers.current
	];

	return result;
}

export function deleteServer(id: string) {
	const result = v.safeParse(v.string(), id);

	if (result.success) {
		servers.current = servers.current.filter((s: Server) => s.id !== result.output);
	}

	return result;
}

export function updateServer(data: Server) {
	const result = v.safeParse(ServerSchema, data);

	if (!result.success) {
		return result;
	}

	servers.current = servers.current.map((server) =>
		server.id === result.output.id ? result.output : server
	);

	return result;
}

export async function checkStatus(url: string): Promise<StatusResponse> {
	try {
		const partner = PARTNERS.find((p) => url.includes(p.url))?.name;
		if (partner) return { status: undefined, partner };

		const cleanUrl = url.replace(/\/+$/, "").replace(/\/(game|join)$/, "");

		const response = await fetch(`${cleanUrl}/api/status`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json"
			}
		});

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const status = await response.json();
		return { status, partner };
	} catch (error) {
		console.error("Error fetching server status:", error instanceof Error ? error.message : error);
		return { status: undefined, partner: undefined };
	}
}
