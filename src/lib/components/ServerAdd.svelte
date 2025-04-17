<script lang="ts">
	import * as Sheet from "$ui/sheet/index.js";
	import { buttonVariants } from "$ui/button/index.js";

	import { addServer } from "$scripts/servers.svelte.js";
	import ServerForm from "$lib/components/ServerForm.svelte";

	let open = $state<boolean>(false);
	let error = $state<string>("");

	let label = $state<string>("");
	let url = $state<string>("");
	let notes = $state<string>("");

	function handleAddServer() {
		const result = addServer({
			label,
			url,
			notes
		});

		if (result.success) {
			url = "";
			label = "";
			notes = "";
			error = "";
			open = false;
		} else {
			error = result.issues[0].message;
		}
	}
</script>

<Sheet.Root bind:open>
	<Sheet.Trigger class={buttonVariants({ variant: "default" })}>Add Server</Sheet.Trigger>
	<Sheet.Content side="right">
		<ServerForm
			mode="add"
			bind:label
			bind:url
			bind:notes
			bind:error
			onSubmit={handleAddServer} />
	</Sheet.Content>
</Sheet.Root>
