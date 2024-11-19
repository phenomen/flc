<script lang="ts">
	import { Button } from "$ui/button/index.js";
	import { Input } from "$ui/input/index.js";
	import { Textarea } from "$ui/textarea/index.js";
	import { Label } from "$ui/label/index.js";
	import * as Sheet from "$ui/sheet/index.js";
	import * as Alert from "$lib/components/ui/alert/index.js";
	import { buttonVariants } from "$ui/button/index.js";

	import { addServer } from "$scripts/servers.svelte.js";

	let open = $state<boolean>(false);
	let error = $state<string>("");

	let label = $state<string>("");
	let url = $state<string>("");
	let notes = $state<string>("");

	function handleAddServer() {
		if (!label) {
			error = "Server label is required.";
			return;
		}

		if (!url) {
			error = "URL is required.";
			return;
		}

		if (!url.startsWith("http://") && !url.startsWith("https://")) {
			error = "URL must start with http:// or https://";
			return;
		}

		addServer({
			id: "",
			label,
			url,
			notes
		});

		url = "";
		label = "";
		notes = "";
		error = "";
		open = false;
	}
</script>

<Sheet.Root bind:open>
	<Sheet.Trigger class={buttonVariants({ variant: "default" })}>Add Server</Sheet.Trigger>
	<Sheet.Content side="right">
		<Sheet.Header>
			<Sheet.Title>Add a new server</Sheet.Title>
		</Sheet.Header>
		<div>
			<form class="grid gap-4 py-4">
				<div class="grid grid-cols-4 items-center gap-4">
					<Label
						for="label"
						class="text-left">Label</Label
					>
					<Input
						id="label"
						bind:value={label}
						class="col-span-3"
						placeholder="Server name"
						required
					/>
				</div>
				<div class="grid grid-cols-4 items-center gap-4">
					<Label
						for="url"
						class="text-left">URL</Label
					>
					<Input
						id="url"
						bind:value={url}
						class="col-span-3"
						placeholder="URL or IP"
						required
					/>
				</div>
				<div class="grid grid-cols-4 items-center gap-4">
					<Label
						for="url"
						class="text-left">Notes</Label
					>
					<Textarea
						id="notes"
						bind:value={notes}
						class="col-span-3"
						placeholder="Notes, passwords, etc."
					/>
				</div>
				<Button
					type="submit"
					onclick={handleAddServer}>Add Server</Button
				>
			</form>

			{#if error}
				<Alert.Root variant="destructive">
					<Alert.Description>{error}</Alert.Description>
				</Alert.Root>
			{/if}
		</div>
	</Sheet.Content>
</Sheet.Root>
