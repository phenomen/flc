import { PersistedState } from "runed";
import { nanoid } from "nanoid";
import * as v from "valibot";

const statusSchema = v.object({
	active: v.optional(v.boolean()),
	version: v.optional(v.string()),
	world: v.optional(v.string()),
	system: v.optional(v.string()),
	users: v.optional(v.number()),
	partner: v.optional(v.string())
});

const PARTNERS = [
	{ url: "forge-vtt.com", name: "The Forge" },
	{ url: "forgevtt.com", name: "The Forge" },
	{ url: "moltenhosting.com", name: "Molten Hosting" },
	{ url: "foundryserver.com", name: "Foundry Server" }
];

export type ServerStatus = v.InferOutput<typeof statusSchema>;

const ServerSchema = v.object({
	id: v.string(),
	label: v.pipe(v.string(), v.trim(), v.minLength(1, "Please enter a server name")),
	url: v.pipe(
		v.string(),
		v.trim(),
		v.regex(/^https?:\/\//, "Please enter a correct URL starting with either http:// or https://")
	),
	notes: v.optional(v.string())
});

const ServerPartialSchema = v.omit(ServerSchema, ["id"]);

export type Server = v.InferOutput<typeof ServerSchema>;
export type ServerPartial = v.InferOutput<typeof ServerPartialSchema>;

export let servers = new PersistedState<Server[]>("servers", []);

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

export async function getServerStatus(url: string) {
	const partner = PARTNERS.find((p) => url.includes(p.url))?.name;

	if (partner) return { partner: partner };

	const cleanUrl = url.replace(/\/+$/, "").replace(/\/(game|join)$/, "");

	const response = await fetch(`${cleanUrl}/api/status`, {
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
};
