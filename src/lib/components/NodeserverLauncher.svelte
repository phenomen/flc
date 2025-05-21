<script lang="ts">
	import { Button } from "$ui/button/index.js";
	import * as Alert from "$ui/alert/index.js";
	import { ScrollArea } from "$ui/scroll-area/index.js";

	import { InfoIcon } from "@lucide/svelte";

	import {
		nodeLauncher,
		nodeStatus,
		stopNodeserver,
		launchNodeserver
	} from "$scripts/nodelauncher.svelte.js";

	let { launched, status, stdoutData, stderrData } = $derived(nodeStatus?.value);
</script>

<div class="bg-accent dark:border-primary/10 flex flex-col space-y-2 rounded-md border p-2">
	<Alert.Root>
		<InfoIcon class="size-5" />

		<Alert.Description
			><p class="font-medium">
				<span class="font-semibold">Node.js 22+</span> is required to launch a Foundry VTT server.
				Download it at <span class="text-blue-500">nodejs.org</span>
			</p></Alert.Description>
	</Alert.Root>

	{#if launched}
		<Button
			onclick={async () => await stopNodeserver()}
			variant="destructive">Stop Server</Button>
	{:else}
		<Button
			onclick={async () => await launchNodeserver()}
			disabled={!nodeLauncher?.value?.id}
			>{!nodeLauncher?.value?.id
				? "No Server Settings Loaded"
				: `Launch Server: ${nodeLauncher?.value?.label}`}</Button>
	{/if}

	{#if status}
		<div class="rounded-md bg-black p-2 font-mono text-sm text-lime-500">
			<pre>{status}</pre>
		</div>
	{/if}

	{#if launched}
		{#if stdoutData}
			<ScrollArea class="h-48 max-h-48 rounded-md bg-black p-2 font-mono text-sm text-white">
				<pre>{stdoutData}</pre>
			</ScrollArea>
		{/if}
	{/if}
	{#if stderrData}
		<ScrollArea class="h-48 max-h-48 rounded-md bg-black p-2 font-mono text-sm text-red-500">
			<pre>{stderrData}</pre>
		</ScrollArea>
	{/if}
</div>
