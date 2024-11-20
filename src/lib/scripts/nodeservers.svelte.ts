import { LocalStorage } from "$scripts/storage.svelte.js";
import { nanoid } from "nanoid";
import * as v from "valibot";

const NodeserverSchema = v.object({
	id: v.string(),
	label: v.pipe(v.string(), v.trim(), v.minLength(1, "Please enter a server name")),
	notes: v.optional(v.string()),
	foundryPath: v.pipe(
		v.string(),
		v.trim(),
		v.minLength(1, "Please select a path to the Foundry VTT installation directory")
	),
	dataPath: v.optional(v.string()),
	port: v.pipe(
		v.number(),
		v.minValue(1, "Please enter a valid port number"),
		v.maxValue(65535, "Please enter a valid port number")
	),
	args: v.optional(v.string())
});

const NodeserverPartialSchema = v.omit(NodeserverSchema, ["id"]);

export type Nodeserver = v.InferOutput<typeof NodeserverSchema>;
export type NodeserverPartial = v.InferOutput<typeof NodeserverPartialSchema>;

const storage = new LocalStorage<Nodeserver[]>("nodeservers", []);

export let nodeservers = $state<LocalStorage<Nodeserver[]>>(storage);

export function addServer(data: NodeserverPartial) {
	const result = v.safeParse(NodeserverPartialSchema, data);

	if (result.success) {
		nodeservers.current.unshift({
			id: nanoid(),
			label: result.output.label,
			notes: result.output.notes,
			foundryPath: result.output.foundryPath,
			dataPath: result.output.dataPath,
			port: result.output.port,
			args: result.output.args
		});
	}

	return result;
}

export function deleteServer(id: string) {
	const result = v.safeParse(v.string(), id);

	if (result.success) {
		nodeservers.current = nodeservers.current.filter((s: Nodeserver) => s.id !== result.output);
	}

	return result;
}

export function updateServer(data: Nodeserver) {
	const result = v.safeParse(NodeserverSchema, data);

	if (result.success) {
		nodeservers.current = nodeservers.current.map((s: Nodeserver) => {
			if (s.id !== result.output.id) {
				return s;
			}

			return {
				id: result.output.id,
				label: result.output.label,
				notes: result.output.notes,
				foundryPath: result.output.foundryPath,
				dataPath: result.output.dataPath,
				port: result.output.port,
				args: result.output.args
			};
		});
	}

	return result;
}
