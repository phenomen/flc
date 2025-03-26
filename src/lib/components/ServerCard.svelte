<script lang="ts">
	import { onMount } from "svelte";

	import * as Card from "$ui/card/index.js";
	import { Input } from "$ui/input/index.js";
	import { Label } from "$ui/label/index.js";
	import { Button } from "$ui/button/index.js";
	import * as Popover from "$ui/popover/index.js";
	import { Textarea } from "$ui/textarea/index.js";
	import * as Alert from "$ui/alert/index.js";
	import { Badge } from "$ui/badge/index.js";

	import {
		SettingsIcon,
		XIcon,
		LogInIcon,
		SmileIcon,
		ZapIcon,
		DicesIcon,
		HexagonIcon
	} from "@lucide/svelte";

	import type { ServerStatus } from "$scripts/servers.svelte.js";
	import { deleteServer, updateServer, getServerStatus } from "$scripts/servers.svelte.js";
	import { openWebview } from "$scripts/webview.svelte.js";

	let { server } = $props();

	if (!server) {
		throw new Error("Server not found");
	}

	let open = $state<boolean>(false);
	let error = $state<string>("");

	let label = $state<string>(server.label);
	let url = $state<string>(server.url);
	let notes = $state<string | undefined>(server.notes);
	let order = $state<number | undefined>(server.order);

	let status = $state<ServerStatus>();

	function handleUpdateServer() {
		const result = updateServer({
			id: server.id,
			label,
			url,
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

	onMount(async () => {
		status = await getServerStatus(url);
	});
</script>

<Card.Root
	class="group flex h-full w-full items-center overflow-hidden rounded-md border bg-background dark:bg-secondary/30">
	<button
		onclick={handleDeleteServer}
		class="h-full w-8 border border-destructive bg-destructive text-destructive-foreground hover:bg-destructive/90"
		title="Delete Server"
		><XIcon
			size={18}
			class="mx-auto" /></button>

	<Popover.Root bind:open>
		<Popover.Trigger
			class="h-full w-12  bg-secondary dark:bg-secondary/50"
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
					<Label for="label">Label</Label>
					<Input
						id="label"
						bind:value={label}
						placeholder="Server name" />
				</div>
				<div class="grid gap-1.5">
					<Label for="url">URL</Label>
					<Input
						id="url"
						bind:value={url}
						placeholder="URL or IP" />
				</div>
				<div class="grid gap-1.5">
					<Label for="notes"
						>Notes <span class="text-xs text-muted-foreground">(optional)</span></Label>
					<Textarea
						id="notes"
						bind:value={notes}
						class="h-8"
						placeholder="Notes, passwords, etc." />
				</div>
				<div class="grid gap-1.5">
					<Label for="notes"
						>Order <span class="text-xs text-muted-foreground">(optional)</span></Label>
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

	<div class="w-full px-2 py-3">
		<div class="grid gap-1.5">
			<h1 class="overflow-hidden text-ellipsis text-nowrap font-semibold">{server.label}</h1>
			<div class="flex items-center gap-1 text-xs text-muted-foreground">
				{#if status?.partner}
					<Badge>
						<ZapIcon
							size={16}
							class="mr-1 text-orange-500" />{status.partner}</Badge>
				{:else if status?.version}
					<Badge>
						<ZapIcon
							size={16}
							class="mr-1 text-orange-500" />Online</Badge>
					<Badge variant="secondary"
						><HexagonIcon
							size={16}
							class="mr-1" />{status.version}</Badge>
					{#if status.system}<Badge variant="secondary"
							><DicesIcon
								size={16}
								class="mr-1" />{status.system.toUpperCase()}</Badge>
					{/if}
					{#if status.users !== undefined}<Badge variant="secondary"
							><SmileIcon
								size={16}
								class="mr-1" />{status.users}</Badge
						>{/if}
				{:else}
					<Badge variant="outline">
						<ZapIcon
							size={16}
							class="mr-1" />Offline</Badge>
				{/if}
			</div>
		</div>
	</div>

	<button
		onclick={() => openWebview(url, server.id, label)}
		class="h-full w-16 border border-primary bg-primary text-primary-foreground hover:bg-primary/90"
		title="Join Server">
		<LogInIcon
			size={20}
			class="mx-auto" />
	</button>
</Card.Root>
