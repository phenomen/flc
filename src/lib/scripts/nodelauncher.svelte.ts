import type { Nodeserver } from "$scripts/nodeservers.svelte.js";

class NodeLauncher {
	value = $state<Nodeserver>({
		id: "",
		label: "",
		notes: "",
		foundryPath: "",
		dataPath: "",
		port: 30000,
		args: ""
	});
}

export const nodelauncher = new NodeLauncher();
