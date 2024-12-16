import { PersistedState } from "runed";
import { nanoid } from "nanoid";
import * as v from "valibot";

const ERROR_MESSAGES = {
	serverName: "Please enter a server name",
	foundryPath: "Please select a path to the Foundry VTT installation directory",
	validPort: "Please enter a valid port number"
};

const NodeserverSchema = v.object({
	id: v.string(),
	label: v.pipe(v.string(), v.trim(), v.minLength(1, ERROR_MESSAGES.serverName)),
	notes: v.optional(v.string()),
	foundryPath: v.pipe(v.string(), v.trim(), v.minLength(1, ERROR_MESSAGES.foundryPath)),
	dataPath: v.optional(v.string()),
	port: v.pipe(
		v.number(),
		v.minValue(1, ERROR_MESSAGES.validPort),
		v.maxValue(65535, ERROR_MESSAGES.validPort)
	),
	args: v.optional(v.string())
});

const NodeserverPartialSchema = v.omit(NodeserverSchema, ["id"]);

export type Nodeserver = v.InferOutput<typeof NodeserverSchema>;
export type NodeserverPartial = v.InferOutput<typeof NodeserverPartialSchema>;

export let nodeservers = new PersistedState<Nodeserver[]>("nodeservers", []);

export function addServer(data: NodeserverPartial) {
	const result = v.safeParse(NodeserverPartialSchema, data);

	if (!result.success) {
		return result;
	}

	nodeservers.current = [
		{
			id: nanoid(),
			...result.output
		},
		...nodeservers.current
	];

	return result;
}

export function deleteServer(id: string) {
	const result = v.safeParse(v.string(), id);

	if (!result.success) {
		return result;
	}

	nodeservers.current = nodeservers.current.filter((server) => server.id !== result.output);

	return result;
}

export function updateServer(data: Nodeserver) {
	const result = v.safeParse(NodeserverSchema, data);

	if (!result.success) {
		return result;
	}

	nodeservers.current = nodeservers.current.map((server) =>
		server.id === result.output.id ? result.output : server
	);

	return result;
}
