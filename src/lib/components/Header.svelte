<script lang="ts">
	import { page } from "$app/stores";

	import { Button } from "$ui/button/index.js";

	import LightSwitch from "$components/LightSwitch.svelte";
	import ServerAdd from "$components/ServerAdd.svelte";
	import NodeserverAdd from "$components/NodeserverAdd.svelte";
	import WebGl from "$components/WebGL.svelte";
	import FoundryControls from "$components/FoundryControls.svelte";
</script>

<header class="sticky top-0 z-10 bg-background border-b w-full">
	<div class="flex items-center justify-between w-full container py-2">
		<button
			class="items-center flex space-x-1"
			onclick={() => open("https://flc.ruleplaying.com")}
		>
			<img
				src="/logo.svg"
				alt="FLC"
				class="h-8 w-8"
			/>
			<h1 class="text-xl font-bold">FLC</h1>
		</button>

		<div class="flex items-center space-x-2">
			<Button
				variant="ghost"
				href="/"
				class={$page.url.pathname === "/" ? "bg-secondary" : ""}>Join Server</Button
			>
			<Button
				variant="ghost"
				href="/node"
				class={$page.url.pathname === "/node" ? "bg-secondary" : ""}>Launch Server</Button
			>
		</div>

		<div class="flex items-center space-x-2">
			<FoundryControls />
			<LightSwitch />
			<WebGl />
			{#if $page.url.pathname === "/"}
				<ServerAdd />
			{:else}
				<NodeserverAdd />
			{/if}
		</div>
	</div>
</header>
