<script lang="ts">
	import ServerGrid from "$components/ServerGrid.svelte";
	import NodeserverGrid from "$components/NodeserverGrid.svelte";
	import NodeserverLauncher from "$components/NodeserverLauncher.svelte";
	import * as Tabs from "$lib/components/ui/tabs/index.js";
	import ServerAdd from "$components/ServerAdd.svelte";
	import NodeserverAdd from "$components/NodeserverAdd.svelte";
</script>

<main class="container mx-auto flex max-w-3xl flex-col space-y-4 py-4">
	<Tabs.Content
		value="join"
		class="space-y-4">
		<ServerAdd />
		<ServerGrid />
	</Tabs.Content>
	<Tabs.Content
		value="launch"
		class="space-y-4">
		<NodeserverAdd />
		<NodeserverLauncher />
		<NodeserverGrid />
	</Tabs.Content>
</main>
