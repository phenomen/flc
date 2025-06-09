<script lang="ts">
	import { getVersion } from "@tauri-apps/api/app";

	import { page } from "$app/state";

	import { Button } from "$ui/button/index.js";
	import { Badge } from "$ui/badge/index.js";

	import LightSwitch from "$components/LightSwitch.svelte";
	import ServerAdd from "$components/ServerAdd.svelte";
	import NodeserverAdd from "$components/NodeserverAdd.svelte";
	import WebGl from "$components/WebGL.svelte";
	import FoundryControls from "$components/FoundryControls.svelte";
</script>

<header class="bg-background sticky top-0 z-10 w-full border-b">
	<div class="container mx-auto flex w-full max-w-3xl items-center justify-between py-2">
		<button
			class="flex items-center space-x-1"
			onclick={() => open("https://foundry.ruleplaying.com/flc")}>
			<img
				src="/logo.svg"
				alt="FLC"
				class="size-8" />
			<h1 class="text-xl font-bold">FLC</h1>

			{#await getVersion() then version}
				<Badge
					variant="outline"
					class="font-mono">
					{version}
				</Badge>
			{/await}
		</button>

		<div class="flex items-center space-x-2">
			<Button
				variant="link"
				href="/"
				class={page.url.pathname === "/" ? "bg-accent" : ""}>Join Server</Button>
			<Button
				variant="link"
				href="/node"
				class={page.url.pathname === "/node" ? "bg-accent" : ""}>Launch Server</Button>
		</div>

		<div class="flex items-center space-x-2">
			<FoundryControls />
			<LightSwitch />
			<WebGl />
			{#if page.url.pathname === "/"}
				<ServerAdd />
			{:else}
				<NodeserverAdd />
			{/if}
		</div>
	</div>
</header>
