<script lang="ts">
	import { open as tauriOpen } from "@tauri-apps/plugin-dialog";

	import { Button } from "$ui/button/index.js";
	import { Input } from "$ui/input/index.js";
	import { Textarea } from "$ui/textarea/index.js";
	import { Label } from "$ui/label/index.js";
	import * as Alert from "$ui/alert/index.js";

	let {
		mode = "add",
		label = $bindable(""),
		notes = $bindable(""),
		foundryPath = $bindable(""),
		dataPath = $bindable(""),
		port = $bindable(30000),
		args = $bindable(""),
		modern = $bindable(undefined),
		order = $bindable(0),
		error = $bindable(""),
		onSubmit
	} = $props<{
		mode?: "add" | "edit";
		label?: string;
		notes?: string;
		foundryPath?: string;
		dataPath?: string;
		port?: number;
		args?: string;
		modern?: boolean;
		order?: number;
		error?: string;
		onSubmit: () => void;
	}>();

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

<form class="grid gap-3 py-2">
	<div class="grid gap-1.5">
		<Label for="label">Label</Label>
		<Input
			id="label"
			autocomplete="off"
			bind:value={label}
			placeholder="Server name" />
	</div>

	<div class="grid gap-1.5">
		<Label for="foundryPath"
			>Path to main.js <span class="text-xs text-muted-foreground"
				>(in Foundry installation directory)</span
			></Label>
		<Input
			id="foundryPath"
			autocomplete="off"
			bind:value={foundryPath}
			placeholder="/resources/app/main.js or /main.js"
			onclick={selectFoundryPath} />
	</div>

	<div class="grid gap-1.5">
		<Label for="dataPath"
			>Foundry User Data <span class="text-xs text-muted-foreground">(optional)</span></Label>
		<Input
			id="dataPath"
			autocomplete="off"
			bind:value={dataPath}
			placeholder="User data directory"
			onclick={selectDataPath} />
	</div>

	<div class="grid gap-1.5">
		<Label for="port">Port</Label>
		<Input
			id="port"
			autocomplete="off"
			type="number"
			bind:value={port}
			placeholder="Foundry port" />
	</div>

	<div class="grid gap-1.5">
		<Label for="args"
			>Arguments <span class="text-xs text-muted-foreground">(optional)</span></Label>
		<Input
			id="args"
			autocomplete="off"
			bind:value={args}
			placeholder="Additional arguments" />
	</div>

	<div class="grid gap-1.5">
		<Label for="notes">Notes <span class="text-xs text-muted-foreground">(optional)</span></Label>
		<Textarea
			id="notes"
			bind:value={notes}
			rows={2}
			placeholder="Notes, passwords, etc." />
	</div>

	{#if mode === "edit"}
		<div class="grid gap-1.5">
			<Label for="order">Order <span class="text-xs text-muted-foreground">(optional)</span></Label>
			<Input
				id="order"
				type="number"
				min={0}
				bind:value={order}
				placeholder="Lower number is higher order" />
		</div>
	{/if}

	<Button
		type="submit"
		onclick={onSubmit}
		class="w-full">{mode === "add" ? "Add" : "Update"} Server</Button>

	{#if error}
		<Alert.Root variant="destructive">
			<Alert.Description>{error}</Alert.Description>
		</Alert.Root>
	{/if}
</form>
