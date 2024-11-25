import type { Nodeserver } from "$scripts/nodeservers.svelte.js";
import type { Child } from "@tauri-apps/plugin-shell";

import { join } from "@tauri-apps/api/path";
import { Command } from "@tauri-apps/plugin-shell";

const DEFAULT_PORT = 30000;

class NodeLauncher {
	value = $state<Nodeserver>({
		id: "",
		label: "",
		notes: "",
		foundryPath: "",
		dataPath: "",
		port: DEFAULT_PORT,
		args: ""
	});

	reset() {
		this.value = {
			id: "",
			label: "",
			notes: "",
			foundryPath: "",
			dataPath: "",
			port: DEFAULT_PORT,
			args: ""
		};
	}
}

class NodeStatus {
	value = $state({
		launched: false,
		status: "",
		stdoutData: "",
		stderrData: ""
	});

	reset() {
		this.value = {
			launched: false,
			status: "",
			stdoutData: "",
			stderrData: ""
		};
	}
}

export const nodeLauncher = new NodeLauncher();
export const nodeStatus = new NodeStatus();

let child: Child | undefined;

export async function launchNodeserver() {
	nodeStatus.reset();

	const server = nodeLauncher.value;
	const normalizedFoundryPath = await join(server.foundryPath, "resources", "app", "main.js");
	const normalizedDataPath = server.dataPath ? await join(server.dataPath) : undefined;

	const command = Command.create("node", [
		normalizedFoundryPath,
		normalizedDataPath ? `--dataPath=${normalizedDataPath}` : "",
		`--port=${server.port}`,
		server.args || ""
	]);

	command.on("close", () => {
		nodeStatus.value.status = `Node process finished`;
		nodeStatus.value.launched = false;
	});

	command.on("error", (error: string) => {
		nodeStatus.value.status = `Command error: "${error}"`;
		nodeStatus.value.launched = false;
	});

	command.stdout.on("data", (line: string) => {
		nodeStatus.value.stdoutData += line;
	});

	command.stderr.on("data", (line: string) => {
		nodeStatus.value.stderrData += line;
	});

	if (child) {
		await child.kill();
	}

	child = await command.spawn();

	nodeStatus.value.status = `FOUNDRY VTT SERVER "${server.label}" STARTED`;
	nodeStatus.value.launched = true;
}

export async function stopNodeserver() {
	if (child) {
		await child.kill();
	}

	nodeStatus.reset();
}
