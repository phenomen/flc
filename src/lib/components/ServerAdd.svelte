<script lang="ts">
	import { Button } from "$ui/button/index.js";
	import { Input } from "$ui/input/index.js";
	import { Textarea } from "$ui/textarea/index.js";
	import { Label } from "$ui/label/index.js";
	import * as Sheet from "$ui/sheet/index.js";
	import * as Alert from "$ui/alert/index.js";
	import { buttonVariants } from "$ui/button/index.js";

	import { addServer } from "$scripts/servers.svelte.js";

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
		<form class="grid gap-3 py-2">
			<div class="grid gap-1.5">
				<Label for="label">Label</Label>
				<Input
					id="label"
					bind:value={label}
					placeholder="Server name" />
			</div>
			<div class="grid gap-1.5">
				<Label for="url">URL</Label>
				<Input
					id="url"
					bind:value={url}
					placeholder="URL or IP" />
			</div>
			<div class="grid gap-1.5">
				<Label for="notes"
					>Notes <span class="text-xs text-muted-foreground">(optional)</span></Label>
				<Textarea
					id="notes"
					bind:value={notes}
					rows={2}
					placeholder="Notes, passwords, etc." />
			</div>
			<Button
				type="submit"
				onclick={handleAddServer}
				class="w-full">Add Server</Button>

			{#if error}
				<Alert.Root variant="destructive">
					<Alert.Description>{error}</Alert.Description>
				</Alert.Root>
			{/if}
		</form>
	</Sheet.Content>
</Sheet.Root>
