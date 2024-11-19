import { LocalStorage } from "$scripts/storage.svelte.js";
import { nanoid } from "nanoid";
import * as v from "valibot";

const URLSchema = v.union(
	[
		v.pipe(v.string(), v.trim(), v.url(), v.startsWith("http://")),
		v.pipe(v.string(), v.trim(), v.url(), v.startsWith("https://"))
	],
	"Please enter a correct URL starting with either http:// or https://"
);

const ServerSchema = v.object({
	id: v.string(),
	label: v.pipe(v.string(), v.trim(), v.minLength(1, "Please enter a server name")),
	url: URLSchema,
	notes: v.optional(v.string())
});

const ServerPartialSchema = v.omit(ServerSchema, ["id"]);

export type Server = v.InferOutput<typeof ServerSchema>;
export type ServerPartial = v.InferOutput<typeof ServerPartialSchema>;

const storage = new LocalStorage<Server[]>("servers", []);

export let servers = $state<LocalStorage<Server[]>>(storage);

export function addServer(data: ServerPartial) {
	const result = v.safeParse(ServerPartialSchema, data);

	if (result.success) {
		servers.current.unshift({
			id: nanoid(),
			label: result.output.label,
			url: result.output.url,
			notes: result.output.notes
		});
	}

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

	if (result.success) {
		servers.current = servers.current.map((s: Server) => {
			if (s.id !== result.output.id) {
				return s;
			}

			return {
				id: result.output.id,
				label: result.output.label,
				url: result.output.url,
				notes: result.output.notes
			};
		});
	}

	return result;
}
