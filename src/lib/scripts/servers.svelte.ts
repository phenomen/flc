import { LocalStorage } from "$scripts/storage.svelte.js";
import { nanoid } from "nanoid";

export type Server = {
	id: string;
	label: string;
	url: string;
	notes?: string;
};

let storage = new LocalStorage<Server[]>("servers", []);

export let servers = $state<LocalStorage<Server[]>>(storage);

export function addServer(added: Server) {
	servers.current.unshift({
		id: nanoid(),
		label: added.label,
		url: added.url,
		notes: added.notes
	});
}

export function deleteServer(deleted: Server) {
	servers.current = servers.current.filter((s: Server) => s.id !== deleted.id);
}

export function updateServer(updated: Server) {
	if (!updated.label || !updated.url) {
		return;
	}

	servers.current = servers.current.map((s: Server) => {
		if (s.id !== updated.id) {
			return s;
		}

		return {
			id: s.id,
			label: updated.label,
			url: updated.url,
			notes: updated.notes
		};
	});
}
