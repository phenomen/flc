<script lang="ts">
	import { onMount } from "svelte";

	import { Badge } from "$ui/badge/index.js";
	import { Button } from "$ui/button/index.js";

	import {
		SettingsIcon,
		XIcon,
		LogInIcon,
		SmileIcon,
		ZapIcon,
		DicesIcon,
		HexagonIcon
	} from "@lucide/svelte";

	import type { ServerStatus, Server } from "$scripts/servers.svelte.js";
	import { deleteServer, getServerStatus } from "$scripts/servers.svelte.js";
	import { openWebview } from "$scripts/webview.svelte.js";

	let { server, onEdit = $bindable((server: Server) => {}) } = $props<{
		server: Server;
		onEdit?: (server: Server) => void;
	}>();

	if (!server) {
		throw new Error("Server not found");
	}

	let status = $state<ServerStatus>();

	function handleDeleteServer() {
		const result = deleteServer(server.id);

		if (!result.success) {
			console.error(result.error.message);
		}
	}

	onMount(async () => {
		status = await getServerStatus(server.url);
	});
</script>

<div class="flex h-full w-full items-center">
	<div class="grid gap-1">
		<Button
			onclick={() => onEdit(server)}
			class="hover:text-primary"
			size="icon"
			variant="outline"
			title="Edit Server"><SettingsIcon /></Button>

		<Button
			onclick={handleDeleteServer}
			class="hover:text-destructive"
			variant="outline"
			size="icon"
			title="Delete Server"><XIcon /></Button>
	</div>

	<div class="bg-accent/50 ring-border mx-2 h-full w-full rounded-md px-4 py-3 ring-1">
		<div class="my-auto grid gap-1.5">
			<h1 class="overflow-hidden font-semibold text-nowrap text-ellipsis">{server.label}</h1>
			<div class="text-muted-foreground flex items-center gap-1 text-xs">
				{#if status?.partner}
					<Badge>
						<ZapIcon />{status.partner}</Badge>
				{:else if status?.version}
					<Badge>
						<ZapIcon />Online</Badge>
					<Badge variant="secondary"><HexagonIcon />{status.version}</Badge>
					{#if status.system}<Badge variant="secondary"
							><DicesIcon />{status.system.toUpperCase()}</Badge>
					{/if}
					{#if status.users !== undefined}<Badge variant="secondary"
							><SmileIcon />{status.users}</Badge
						>{/if}
				{:else}
					<Badge variant="destructive">
						<ZapIcon />Offline</Badge>
				{/if}
			</div>
		</div>
	</div>

	<Button
		onclick={() => openWebview(server.url, server.id, server.label)}
		class="h-full w-16"
		title="Join Server">
		<LogInIcon class="size-5" />
	</Button>
</div>
