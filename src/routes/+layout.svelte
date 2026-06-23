<script lang="ts">
	import { onMount } from "svelte";
	import "../app.css";

	import { ModeWatcher } from "mode-watcher";
	import { registerShortcuts } from "$scripts/shortcuts.svelte.js";
	import Header from "$components/Header.svelte";
	import Updater from "$components/Updater.svelte";
	import * as Tabs from "$lib/components/ui/tabs/index.js";

	onMount(async () => {
		await registerShortcuts();
	});

	let { children } = $props();
	let tab = $state<"join" | "launch">("join");
</script>

<ModeWatcher />

<Tabs.Root bind:value={tab}>
	<Header />
	{@render children?.()}
</Tabs.Root>

<Updater />
