import { PersistedState } from "runed";
import { nanoid } from "nanoid";
import * as z from "zod/v4";

const ERROR_MESSAGES = {
	serverName: "Please enter a server name",
	foundryPath: "Please select a path to the Foundry VTT installation directory",
	validPort: "Please enter a valid port number"
};

const NodeserverSchema = z.object({
	id: z.string(),
	label: z.string().trim().min(1, { error: ERROR_MESSAGES.serverName }),
	notes: z.optional(z.string()),
	foundryPath: z.string().trim().min(1, { error: ERROR_MESSAGES.foundryPath }),
	dataPath: z.optional(z.string().trim()),
	port: z
		.number()
		.min(1, { error: ERROR_MESSAGES.validPort })
		.max(65535, { error: ERROR_MESSAGES.validPort }),
	args: z.optional(z.string()),
	order: z.optional(z.number())
});

const NodeserverPartialSchema = NodeserverSchema.partial({ id: true });

export type Nodeserver = z.infer<typeof NodeserverSchema>;
export type NodeserverPartial = z.infer<typeof NodeserverPartialSchema>;

export const nodeservers = new PersistedState<Nodeserver[]>("nodeservers", []);

export function addServer(data: NodeserverPartial) {
	const result = z.safeParse(NodeserverPartialSchema, data);

	if (!result.success) {
		return { error: z.prettifyError(result.error) };
	}

	nodeservers.current = [
		{
			id: nanoid(),
			order: 0,
			...result.data
		},
		...nodeservers.current
	];

	return result;
}

export function deleteServer(id: string) {
	const result = z.safeParse(z.string(), id);

	if (!result.success) {
		return z.prettifyError(result.error);
	}

	nodeservers.current = nodeservers.current.filter((server) => server.id !== result.data);

	return result;
}

export function updateServer(data: Nodeserver) {
	const result = z.safeParse(NodeserverSchema, data);

	if (!result.success) {
		return { error: z.prettifyError(result.error) };
	}

	nodeservers.current = nodeservers.current.map((server) =>
		server.id === result.data.id ? result.data : server
	);

	nodeservers.current = nodeservers.current.sort((a, b) => {
		if (a.order === undefined) return 1;
		if (b.order === undefined) return -1;
		return a.order - b.order;
	});

	return result;
}
