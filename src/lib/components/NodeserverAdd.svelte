<script lang="ts">
	import * as Sheet from "$ui/sheet/index.js";
	import { buttonVariants } from "$ui/button/index.js";

	import { addServer } from "$scripts/nodeservers.svelte.js";
	import NodeServerForm from "$lib/components/NodeServerForm.svelte";

	import { z } from "zod/v4";

	let open = $state<boolean>(false);
	let error = $state<string>("");

	let label = $state<string>("");
	let notes = $state<string>("");
	let foundryPath = $state<string>("");
	let dataPath = $state<string>("");
	let port = $state<number>(30000);
	let args = $state<string>("");

	function handleAddServer() {
		const result = addServer({
			label,
			notes,
			foundryPath,
			dataPath,
			port,
			args
		});

		if (result.success) {
			label = "";
			notes = "";
			foundryPath = "";
			dataPath = "";
			port = 30000;
			args = "";
			error = "";
			open = false;
		} else {
			error = z.prettifyError(result.error);
		}
	}
</script>

<Sheet.Root bind:open>
	<Sheet.Trigger class={buttonVariants({ variant: "default" })}>Add Server</Sheet.Trigger>
	<Sheet.Content
		side="right"
		class="px-2 py-4">
		<NodeServerForm
			mode="add"
			bind:label
			bind:notes
			bind:foundryPath
			bind:dataPath
			bind:port
			bind:args
			bind:error
			onSubmit={handleAddServer} />
	</Sheet.Content>
</Sheet.Root>
