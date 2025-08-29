<script lang="ts">
	import { getVersion } from "@tauri-apps/api/app";

	import { Badge } from "$ui/badge/index.js";
	import * as Tabs from "$lib/components/ui/tabs/index.js";
	import ToolbarLightSwitch from "$components/ToolbarLightSwitch.svelte";
	import ToolbarWebGl from "$components/ToolbarWebGL.svelte";
	import ToolbarControls from "$components/ToolbarControls.svelte";
	import ToolbarIncognito from "$components/ToolbarIncognito.svelte";
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

		<Tabs.List>
			<Tabs.Trigger
				value="join"
				class="w-48">Join Server</Tabs.Trigger>
			<Tabs.Trigger
				value="launch"
				class="w-48">Launch Server</Tabs.Trigger>
		</Tabs.List>

		<div class="flex items-center space-x-2">
			<ToolbarIncognito />
			<ToolbarLightSwitch />
			<ToolbarWebGl />
			<ToolbarControls />
		</div>
	</div>
</header>
