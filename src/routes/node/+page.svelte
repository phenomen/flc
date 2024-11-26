<script lang="ts">
	import NodeserverGrid from "$components/NodeserverGrid.svelte";
	import NodeserverLauncher from "$components/NodeserverLauncher.svelte";
</script>

<main class="container flex flex-col space-y-4 py-4">
	<NodeserverLauncher />
	<NodeserverGrid />
</main>
