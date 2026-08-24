import { nanoid } from "nanoid";
import * as z from "zod";
import { invoke } from "@tauri-apps/api/core";
import { open, save } from "@tauri-apps/plugin-dialog";

import { ServerSchema, servers, type Server } from "$scripts/servers.svelte.js";
import { NodeserverSchema, nodeservers, type Nodeserver } from "$scripts/nodeservers.svelte.js";

export const ServerListSchema = z.object({
	servers: z.array(ServerSchema),
	nodeservers: z.array(NodeserverSchema)
});

export type ServerList = z.infer<typeof ServerListSchema>;
export type ImportMode = "append" | "replace";

export type ImportResult =
	| { success: true; data: ServerList }
	| { success: false; cancelled: true }
	| { success: false; error: string };

export type ExportResult =
	{ success: true } | { success: false; cancelled: true } | { success: false; error: string };

function uniqueIds(items: { id: string }[], label: string): string | undefined {
	const seen: Record<string, true> = {};

	for (const item of items) {
		if (seen[item.id]) return `Duplicate ${label} IDs in the file`;
		seen[item.id] = true;
	}
}

export function validateServerList(value: unknown): ImportResult {
	const result = ServerListSchema.safeParse(value);

	if (!result.success) {
		return {
			success: false,
			error: `This file is not a valid FLC server list.\n\n${z.prettifyError(result.error)}`
		};
	}

	const serverIdError = uniqueIds(result.data.servers, "server");
	if (serverIdError) return { success: false, error: serverIdError };

	const nodeserverIdError = uniqueIds(result.data.nodeservers, "node server");
	if (nodeserverIdError) return { success: false, error: nodeserverIdError };

	return { success: true, data: result.data };
}

function uniquifyIds<T extends { id: string }>(items: T[], existingIds: string[]): T[] {
	const used: Record<string, true> = {};
	for (const id of existingIds) used[id] = true;

	return items.map((item) => {
		if (!used[item.id]) {
			used[item.id] = true;
			return item;
		}

		const next = { ...item, id: nanoid() };
		used[next.id] = true;
		return next;
	});
}

export function serializeServerList(): ServerList {
	return {
		servers: $state.snapshot(servers.current) as Server[],
		nodeservers: $state.snapshot(nodeservers.current) as Nodeserver[]
	};
}

export function applyServerList(data: ServerList, mode: ImportMode) {
	if (mode === "replace") {
		servers.current = data.servers;
		nodeservers.current = data.nodeservers;
		return;
	}

	const importedServers = uniquifyIds(
		data.servers,
		servers.current.map((server) => server.id)
	);
	const importedNodeservers = uniquifyIds(
		data.nodeservers,
		nodeservers.current.map((server) => server.id)
	);

	servers.current = [...importedServers, ...servers.current];
	nodeservers.current = [...importedNodeservers, ...nodeservers.current];
}

function toErrorMessage(error: unknown, fallback: string) {
	if (typeof error === "string" && error.length > 0) return error;
	if (error instanceof Error && error.message) return error.message;
	return fallback;
}

function withJsonExtension(path: string) {
	return path.toLowerCase().endsWith(".json") ? path : `${path}.json`;
}

export async function exportServerList(): Promise<ExportResult> {
	try {
		const path = await save({
			defaultPath: "flc-servers.json",
			filters: [{ name: "JSON", extensions: ["json"] }]
		});

		if (!path) return { success: false, cancelled: true };

		const contents = `${JSON.stringify(serializeServerList(), null, 2)}\n`;
		await invoke("write_text_file", { path: withJsonExtension(path), contents });
		return { success: true };
	} catch (error) {
		return { success: false, error: toErrorMessage(error, "Failed to export servers.") };
	}
}

export async function importServerList(): Promise<ImportResult> {
	try {
		const selected = await open({
			multiple: false,
			directory: false,
			filters: [{ name: "JSON", extensions: ["json"] }]
		});

		if (!selected) return { success: false, cancelled: true };

		const path = Array.isArray(selected) ? selected[0] : selected;
		if (!path) return { success: false, cancelled: true };

		const contents = await invoke<string>("read_text_file", { path });

		let parsed: unknown;
		try {
			parsed = JSON.parse(contents);
		} catch {
			return { success: false, error: "This file is not valid JSON." };
		}

		return validateServerList(parsed);
	} catch (error) {
		return { success: false, error: toErrorMessage(error, "Failed to import servers.") };
	}
}
