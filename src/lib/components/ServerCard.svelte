<script lang="ts">
	import { onMount } from "svelte";

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

<div
	class="group bg-secondary/10 flex h-full w-full items-center overflow-hidden rounded-md border">
	<div class="flex h-full w-10 flex-col border-r">
		<button
			onclick={() => onEdit(server)}
			class="hover:bg-secondary h-full w-full border-b"
			title="Edit Server"
			><SettingsIcon
				size={18}
				class="mx-auto" /></button>

		<button
			onclick={handleDeleteServer}
			class="text-destructive hover:bg-destructive/20 h-full w-full"
			title="Delete Server"
			><XIcon
				size={18}
				class="mx-auto" /></button>
	</div>

	<div class="w-full px-4 py-3">
		<div class="grid gap-1.5">
			<h1 class="overflow-hidden font-semibold text-nowrap text-ellipsis">{server.label}</h1>
			<div class="text-muted-foreground flex items-center gap-1 text-xs">
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
		onclick={() => openWebview(server.url, server.id, server.label)}
		class="border-primary bg-primary text-primary-foreground hover:bg-primary/90 h-full w-16 border"
		title="Join Server">
		<LogInIcon
			size={20}
			class="mx-auto" />
	</button>
</div>
