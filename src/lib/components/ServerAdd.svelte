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

		if ("error" in result) {
			error = result.error as string;
			return;
		}

		url = "";
		label = "";
		notes = "";
		error = "";
		open = false;
	}
</script>

<Sheet.Root bind:open>
	<Sheet.Trigger class={buttonVariants({ variant: "outline", class: "w-full" })}
		>Add Server</Sheet.Trigger>
	<Sheet.Content
		side="right"
		class="px-2 py-4">
		<ServerForm
			mode="add"
			bind:label
			bind:url
			bind:notes
			bind:error
			onSubmit={handleAddServer} />
	</Sheet.Content>
</Sheet.Root>
