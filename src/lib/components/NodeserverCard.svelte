<script lang="ts">
	import { open as tauriOpen } from "@tauri-apps/plugin-dialog";

	import * as Card from "$ui/card/index.js";
	import { Input } from "$ui/input/index.js";
	import { Label } from "$ui/label/index.js";
	import { Button } from "$ui/button/index.js";
	import * as Popover from "$ui/popover/index.js";
	import { Textarea } from "$ui/textarea/index.js";
	import * as Alert from "$ui/alert/index.js";

	import { SettingsIcon, XIcon, ArrowUpToLineIcon } from "lucide-svelte";

	import { deleteServer, updateServer } from "$scripts/nodeservers.svelte.js";
	import { nodeLauncher } from "$scripts/nodelauncher.svelte.js";

	let { server } = $props();

	if (!server) {
		throw new Error("Node Server not found");
	}

	let open = $state<boolean>(false);
	let error = $state<string>("");

	let label = $state<string>(server.label);
	let notes = $state<string | undefined>(server.notes);
	let foundryPath = $state<string>(server.foundryPath);
	let dataPath = $state<string | undefined>(server.dataPath);
	let port = $state<number>(server.port);
	let args = $state<string | undefined>(server.args);
	let modern = $state<boolean | undefined>(server.modern);
	let order = $state<number | undefined>(server.order);

	function handleUpdateServer() {
		const result = updateServer({
			id: server.id,
			label,
			foundryPath,
			dataPath,
			port,
			args,
			modern,
			notes,
			order
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
			directory: false,
			multiple: false,
			filters: [
				{
					name: "main.js",
					extensions: ["js"]
				}
			]
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

	async function handleLoadSettings() {
		nodeLauncher.value = server;
	}
</script>

<Card.Root class="group flex h-full w-full items-center overflow-hidden rounded-md border">
	<button
		onclick={handleDeleteServer}
		class="border-destructive bg-destructive text-destructive-foreground hover:bg-destructive/90 h-full w-full max-w-8 overflow-hidden border"
		title="Delete Server"
		><XIcon
			size={18}
			class="mx-auto" /></button>

	<Popover.Root bind:open>
		<Popover.Trigger
			class="bg-secondary dark:bg-secondary/50 h-full w-full max-w-12 overflow-hidden"
			title="Edit Server"
			><SettingsIcon
				size={18}
				class="mx-auto" /></Popover.Trigger>
		<Popover.Content
			class="w-80"
			side="right"
			sideOffset={8}>
			<form class="grid gap-2">
				<div class="grid gap-1.5">
					<Label for="label">Label *</Label>
					<Input
						id="label"
						bind:value={label}
						placeholder="Server name" />
				</div>

				<div class="grid gap-1.5">
					<Label for="foundryPath">Path to main.js</Label>
					<Input
						id="foundryPath"
						bind:value={foundryPath}
						placeholder="main.js"
						onclick={selectFoundryPath} />
				</div>

				<div class="grid gap-1.5">
					<Label for="foundryPath"
						>Foundry User Data <span class="text-muted-foreground text-xs">(optional)</span></Label>
					<Input
						id="foundryPath"
						bind:value={dataPath}
						placeholder="User data directory"
						onclick={selectDataPath} />
				</div>

				<div class="grid gap-1.5">
					<Label for="port">Port</Label>
					<Input
						id="port"
						type="number"
						bind:value={port}
						placeholder="Foundry port" />
				</div>

				<div class="grid gap-1.5">
					<Label for="args"
						>Arguments <span class="text-muted-foreground text-xs">(optional)</span></Label>
					<Input
						id="args"
						bind:value={args}
						placeholder="Additional arguments" />
				</div>

				<div class="grid gap-1.5">
					<Label for="notes"
						>Notes <span class="text-muted-foreground text-xs">(optional)</span></Label>
					<Textarea
						id="notes"
						bind:value={notes}
						rows={2}
						placeholder="Notes, passwords, etc." />
				</div>

				<div class="grid gap-1.5">
					<Label for="notes"
						>Order <span class="text-muted-foreground text-xs">(optional)</span></Label>
					<Input
						id="order"
						type="number"
						min={0}
						bind:value={order}
						placeholder="Lower number is higher order" />
				</div>

				<Button
					type="submit"
					onclick={handleUpdateServer}
					class="w-full">Save Settings</Button>

				{#if error}
					<Alert.Root variant="destructive">
						<Alert.Description>{error}</Alert.Description>
					</Alert.Root>
				{/if}
			</form>
		</Popover.Content>
	</Popover.Root>

	<div class="w-full px-2 py-6">
		<h1 class="overflow-hidden text-ellipsis text-nowrap font-semibold">{server.label}</h1>
	</div>

	<button
		onclick={handleLoadSettings}
		class="border-primary bg-primary text-primary-foreground hover:bg-primary/90 h-full w-full max-w-16 overflow-hidden border"
		title="Load Server Settings">
		<ArrowUpToLineIcon
			size={20}
			class="mx-auto" />
	</button>
</Card.Root>
