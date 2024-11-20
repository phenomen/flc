<script lang="ts">
	import { open as tauriOpen } from "@tauri-apps/plugin-dialog";

	import * as Card from "$ui/card/index.js";
	import { Input } from "$ui/input/index.js";
	import { Label } from "$ui/label/index.js";
	import { Button } from "$ui/button/index.js";
	import * as Popover from "$ui/popover/index.js";
	import { Textarea } from "$ui/textarea/index.js";
	import * as Alert from "$ui/alert/index.js";

	import Settings from "lucide-svelte/icons/settings";
	import X from "lucide-svelte/icons/x";
	import ArrowUpToLine from "lucide-svelte/icons/arrow-up-to-line";

	import { deleteServer, updateServer } from "$scripts/nodeservers.svelte.js";
	import { nodeLauncher } from "$scripts/nodelauncher.svelte.js";

	let { server } = $props();

	if (!server) {
		throw new Error("Node Server not found");
	}

	let open = $state<boolean>(false);
	let error = $state<string>("");

	let label = $state<string>(server.label);
	let notes = $state<string>(server.notes);
	let foundryPath = $state<string>(server.foundryPath);
	let dataPath = $state<string>(server.dataPath);
	let port = $state<number>(server.port);
	let args = $state<string>(server.args);

	function handleUpdateServer() {
		const result = updateServer({
			id: server.id,
			label,
			foundryPath,
			dataPath,
			port,
			args,
			notes
		});

		if (result.success) {
			error = "";
			open = false;
		} else {
			error = result.issues[0].message;
		}
	}

	function handleDeleteServer() {
		const result = deleteServer(server.id);

		if (!result.success) {
			console.error(result.issues);
		}
	}

	async function selectFoundryPath() {
		const path = await tauriOpen({
			directory: true,
			multiple: false
		});

		if (path) {
			foundryPath = path;
		}
	}

	async function selectDataPath() {
		const path = await tauriOpen({
			directory: true,
			multiple: false
		});

		if (path) {
			dataPath = path;
		}
	}

	async function handleNodelauncher() {
		nodeLauncher.value = server;
	}
</script>

<Card.Root class="w-full border flex items-center h-full rounded-md overflow-hidden group">
	<button
		onclick={handleDeleteServer}
		class="w-full h-full bg-destructive text-destructive-foreground overflow-hidden max-w-8 hover:bg-destructive/90 border-destructive border"
		title="Delete Server"><X class="size-4 w-full" /></button
	>

	<Popover.Root bind:open>
		<Popover.Trigger
			class="w-full h-full bg-secondary dark:bg-secondary/50 overflow-hidden max-w-12"
			title="Edit Server"><Settings class="size-4 w-full" /></Popover.Trigger
		>
		<Popover.Content
			class="w-80"
			side="right"
			sideOffset={8}
		>
			<form class="grid gap-2">
				<div class="grid items-center gap-2">
					<Label for="label">Label *</Label>
					<Input
						id="label"
						bind:value={label}
						placeholder="Server name"
					/>
				</div>

				<div class="grid items-center gap-2">
					<Label for="foundryPath">Foundry Installation</Label>
					<Input
						id="foundryPath"
						bind:value={foundryPath}
						placeholder="Installation directory"
						onclick={selectFoundryPath}
					/>
				</div>

				<div class="grid items-center gap-2">
					<Label for="foundryPath"
						>Foundry User Data <span class="text-muted-foreground text-xs">(optional)</span></Label
					>
					<Input
						id="foundryPath"
						bind:value={dataPath}
						placeholder="User data directory"
						onclick={selectDataPath}
					/>
				</div>

				<div class="grid items-center gap-2">
					<Label for="port">Port</Label>
					<Input
						id="port"
						type="number"
						bind:value={port}
						placeholder="Foundry port"
					/>
				</div>

				<div class="grid items-center gap-2">
					<Label for="args"
						>Arguments <span class="text-muted-foreground text-xs">(optional)</span></Label
					>
					<Input
						id="args"
						bind:value={args}
						placeholder="Additional arguments"
					/>
				</div>

				<div class="grid items-center gap-2">
					<Label for="notes"
						>Notes <span class="text-muted-foreground text-xs">(optional)</span></Label
					>
					<Textarea
						id="notes"
						bind:value={notes}
						rows={2}
						placeholder="Notes, passwords, etc."
					/>
				</div>
				<Button
					type="submit"
					onclick={handleUpdateServer}
					class="w-full">Save Settings</Button
				>

				{#if error}
					<Alert.Root variant="destructive">
						<Alert.Description>{error}</Alert.Description>
					</Alert.Root>
				{/if}
			</form>
		</Popover.Content>
	</Popover.Root>

	<div class="flex w-full px-2 py-4 items-center">
		<h1 class="text-ellipsis text-nowrap font-semibold overflow-hidden">{server.label}</h1>
	</div>

	<button
		onclick={handleNodelauncher}
		class="w-full h-full bg-primary text-primary-foreground overflow-hidden max-w-16 hover:bg-primary/90 border-primary border"
		title="Load Server Settings"
	>
		<ArrowUpToLine class="size-5 w-full" />
	</button>
</Card.Root>
