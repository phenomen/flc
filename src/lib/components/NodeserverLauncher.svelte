<script lang="ts">
	import { Button } from "$ui/button/index.js";
	import * as Alert from "$ui/alert/index.js";
	import { ScrollArea } from "$ui/scroll-area/index.js";

	import Info from "lucide-svelte/icons/info";

	import {
		nodeLauncher,
		nodeStatus,
		stopNodeserver,
		launchNodeserver
	} from "$scripts/nodelauncher.svelte.js";

	let { launched, status, stdoutData, stderrData } = $derived(nodeStatus?.value);
</script>

<div class="flex flex-col space-y-2 p-2 border dark:border-primary/10 rounded-md bg-accent">
	<Alert.Root>
		<Info class="size-5" />

		<Alert.Description
			><p class="font-medium">
				<span class="font-semibold">Node.js 20+</span> is required to launch a Foundry VTT server.
				Download it at <span class="text-blue-500">nodejs.org</span>
			</p></Alert.Description
		>
	</Alert.Root>

	{#if launched}
		<Button
			onclick={async () => await stopNodeserver()}
			variant="destructive">Stop Server</Button
		>
	{:else}
		<Button
			onclick={async () => await launchNodeserver()}
			disabled={!nodeLauncher?.value?.id}
			>{!nodeLauncher?.value?.id
				? "No Server Settings Loaded"
				: `Launch Server: ${nodeLauncher?.value?.label}`}</Button
		>
	{/if}

	{#if status}
		<div class="font-mono text-sm bg-black text-lime-500 p-2 rounded-md">
			<pre>{status}</pre>
		</div>
	{/if}

	{#if launched}
		{#if stdoutData}
			<ScrollArea class="font-mono text-sm bg-black text-white p-2 rounded-md max-h-48 h-48">
				<pre>{stdoutData}</pre>
			</ScrollArea>
		{/if}
	{/if}
	{#if stderrData}
		<ScrollArea class="font-mono text-sm bg-black text-red-500 p-2 rounded-md max-h-48 h-48">
			<pre>{stderrData}</pre>
		</ScrollArea>
	{/if}
</div>
