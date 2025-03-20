<script lang="ts">
	import { open as tauriOpen } from "@tauri-apps/plugin-dialog";

	import { Button } from "$ui/button/index.js";
	import { Input } from "$ui/input/index.js";
	import { Textarea } from "$ui/textarea/index.js";
	import { Label } from "$ui/label/index.js";
	import * as Sheet from "$ui/sheet/index.js";
	import * as Alert from "$ui/alert/index.js";
	import { buttonVariants } from "$ui/button/index.js";

	import { addServer } from "$scripts/nodeservers.svelte.js";

	let open = $state<boolean>(false);
	let error = $state<string>("");

	let label = $state<string>("");
	let notes = $state<string>("");
	let foundryPath = $state<string>("");
	let dataPath = $state<string>("");
	let port = $state<number>(30000);
	let args = $state<string>("");

	function handleAddServer() {
		const result = addServer({
			label,
			notes,
			foundryPath,
			dataPath,
			port,
			args
		});

		if (result.success) {
			label = "";
			notes = "";
			foundryPath = "";
			dataPath = "";
			port = 30000;
			args = "";
			error = "";
			open = false;
		} else {
			error = result.issues[0].message;
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
</script>

<Sheet.Root bind:open>
	<Sheet.Trigger class={buttonVariants({ variant: "default" })}>Add Server</Sheet.Trigger>
	<Sheet.Content side="right">
		<form class="grid gap-3 py-2">
			<div class="grid gap-1.5">
				<Label for="label">Label</Label>
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
				<p class="text-muted-foreground text-xs">/resources/app/main.js or /main.js</p>
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
			<Button
				type="submit"
				onclick={handleAddServer}
				class="w-full">Add Node Server</Button>

			{#if error}
				<Alert.Root variant="destructive">
					<Alert.Description>{error}</Alert.Description>
				</Alert.Root>
			{/if}
		</form>
	</Sheet.Content>
</Sheet.Root>
