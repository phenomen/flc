<script lang="ts">
	import { onMount } from "svelte";
	import { fetch } from "@tauri-apps/plugin-http";

	import * as Card from "$ui/card/index.js";
	import { Input } from "$ui/input/index.js";
	import { Label } from "$ui/label/index.js";
	import { Button } from "$ui/button/index.js";
	import * as Popover from "$ui/popover/index.js";
	import { Textarea } from "$ui/textarea/index.js";
	import * as Alert from "$ui/alert/index.js";
	import { Badge } from "$ui/badge/index.js";

	import Settings from "lucide-svelte/icons/settings";
	import X from "lucide-svelte/icons/x";
	import LogIn from "lucide-svelte/icons/log-in";
	import Smile from "lucide-svelte/icons/smile";
	import Zap from "lucide-svelte/icons/zap";
	import Dices from "lucide-svelte/icons/dices";
	import Hexagon from "lucide-svelte/icons/hexagon";
	import Globe from "lucide-svelte/icons/globe";

	import { deleteServer, updateServer } from "$scripts/servers.svelte.js";
	import { openWebview } from "$scripts/webview.svelte.js";

	let { server } = $props();

	if (!server) {
		throw new Error("Server not found");
	}

	type Status = {
		active?: boolean;
		version?: string;
		world?: string;
		system?: string;
		users?: number;
	};

	let open = $state<boolean>(false);
	let error = $state<string>("");

	let label = $state<string>(server.label);
	let url = $state<string>(server.url);
	let notes = $state<string>(server.notes);

	let online = $state<boolean>(false);
	let status = $state<Status>();

	function handleUpdateServer() {
		const result = updateServer({
			id: server.id,
			label,
			url,
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

	async function checkStatus() {
		const response = await fetch(`${url}${url.endsWith("/") ? "" : "/"}api/status`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json"
			}
		});

		if (response.statusText === "OK" || response.status === 200) {
			status = await response.json();
		}
	}

	onMount(async () => {
		await checkStatus();
	});
</script>

<Card.Root class="w-full border flex items-center h-full rounded-md overflow-hidden group">
	<button
		onclick={handleDeleteServer}
		class="w-full h-full bg-destructive text-destructive-foreground overflow-hidden max-w-8 hover:bg-destructive/90 border-destructive border"
		title="Delete Server"
		><X
			size={18}
			class="mx-auto"
		/></button
	>

	<Popover.Root bind:open>
		<Popover.Trigger
			class="w-full h-full bg-secondary dark:bg-secondary/50 overflow-hidden max-w-12"
			title="Edit Server"
			><Settings
				size={18}
				class="mx-auto"
			/></Popover.Trigger
		>
		<Popover.Content
			class="w-80"
			side="right"
			sideOffset={8}
		>
			<form class="grid gap-2">
				<div class="grid items-center gap-2">
					<Label for="label">Label</Label>
					<Input
						id="label"
						bind:value={label}
						placeholder="Server name"
					/>
				</div>
				<div class="grid items-center gap-2">
					<Label for="url">URL</Label>
					<Input
						id="url"
						bind:value={url}
						placeholder="URL or IP"
					/>
				</div>
				<div class="grid items-center gap-2">
					<Label for="notes"
						>Notes <span class="text-muted-foreground text-xs">(optional)</span></Label
					>
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

	<div class="w-full px-2 py-3">
		<div class="grid gap-1.5">
			<h1 class="text-ellipsis text-nowrap font-semibold overflow-hidden">{server.label}</h1>
			<div class="text-muted-foreground text-xs items-center flex gap-1">
				{#if status}<Badge>
						<Zap
							size={16}
							class="mr-1 text-orange-500"
						/>Online</Badge
					>
					<Badge variant="secondary"
						><Hexagon
							size={16}
							class="mr-1"
						/>{status.version}</Badge
					>
					{#if status.system}<Badge variant="secondary"
							><Dices
								size={16}
								class="mr-1"
							/>{status.system.toUpperCase()}</Badge
						>{/if}
					{#if status.users !== undefined}<Badge variant="secondary"
							><Smile
								size={16}
								class="mr-1"
							/>{status.users}</Badge
						>{/if}
				{:else}
					<Badge variant="outline">
						<Zap
							size={16}
							class="mr-1"
						/>Offline</Badge
					>{/if}
			</div>
		</div>
	</div>

	<button
		onclick={() => openWebview(server.url, label)}
		class="w-full h-full bg-primary text-primary-foreground overflow-hidden max-w-16 hover:bg-primary/90 border-primary border"
		title="Join Server"
	>
		<LogIn
			size={20}
			class="mx-auto"
		/>
	</button>
</Card.Root>
