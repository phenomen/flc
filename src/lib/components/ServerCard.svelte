<script lang="ts">
	import { onMount } from "svelte";
	import { fetch } from "@tauri-apps/plugin-http";

	import * as Card from "$ui/card/index.js";
	import { Input } from "$ui/input/index.js";
	import { Label } from "$ui/label/index.js";
	import { Button } from "$ui/button/index.js";
	import * as Popover from "$ui/popover/index.js";
	import { Textarea } from "$ui/textarea/index.js";
	import * as Alert from "$lib/components/ui/alert/index.js";

	import Settings from "lucide-svelte/icons/settings";
	import X from "lucide-svelte/icons/x";
	import LogIn from "lucide-svelte/icons/log-in";
	import Dot from "lucide-svelte/icons/dot";

	import { deleteServer, updateServer } from "$scripts/servers.svelte.js";
	import { openWebview } from "$scripts/webview.svelte.js";
	import CardFooter from "./ui/card/card-footer.svelte";

	let { server } = $props();

	if (!server) {
		throw new Error("Server not found");
	}

	let open = $state<boolean>(false);
	let error = $state<string>("");

	let label = $state<string>(server.label);
	let url = $state<string>(server.url);
	let notes = $state<string>(server.notes);
	let online = $state<boolean>(false);

	function handleUpdateServer() {
		if (!label) {
			error = "Server label is required.";
			return;
		}

		if (!url) {
			error = "URL is required.";
			return;
		}

		if (!url.startsWith("http://") && !url.startsWith("https://")) {
			error = "URL must start with http:// or https://";
			return;
		}

		updateServer({
			id: server.id,
			label,
			url,
			notes
		});

		error = "";
		open = false;
	}

	async function checkOnline() {
		online = false;

		const response = await fetch(url, {
			method: "GET"
		});

		if (response.statusText === "OK" || response.status === 200) {
			online = true;
		}
	}

	onMount(async () => {
		await checkOnline();
	});
</script>

<Card.Root class="w-full border flex items-center h-full rounded-md overflow-hidden group">
	<button
		onclick={() => deleteServer(server)}
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
			<form class="grid gap-4">
				<div class="grid items-center gap-2">
					<Label for="label">Label</Label>
					<Input
						id="label"
						bind:value={label}
						placeholder="Server name"
						required
					/>
				</div>
				<div class="grid items-center gap-2">
					<Label for="url">URL</Label>
					<Input
						id="url"
						bind:value={url}
						placeholder="URL or IP"
						required
					/>
				</div>
				<div class="grid items-center gap-2">
					<Label for="notes">Notes</Label>
					<Textarea
						id="notes"
						bind:value={notes}
						class="h-8"
						placeholder="Notes, passwords, etc."
					/>
				</div>
				<Button
					type="submit"
					onclick={handleUpdateServer}
					class="w-full">Save</Button
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
		<span
			class:text-green-500={online}
			class:text-red-500={!online}
		>
			<Dot class="size-8" />
		</span>
		<h1 class="text-ellipsis text-nowrap font-semibold overflow-hidden">{server.label}</h1>
	</div>

	<button
		onclick={() => openWebview(server.url, label)}
		class="w-full h-full bg-primary text-primary-foreground overflow-hidden max-w-16 hover:bg-primary/90 border-primary border"
		title="Join Server"
	>
		<LogIn class="size-5 w-full" />
	</button>
</Card.Root>
