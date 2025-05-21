<script lang="ts">
	import { Button } from "$ui/button/index.js";
	import { Input } from "$ui/input/index.js";
	import { Textarea } from "$ui/textarea/index.js";
	import { Label } from "$ui/label/index.js";
	import * as Alert from "$ui/alert/index.js";

	let {
		mode = "add",
		label = $bindable(""),
		url = $bindable(""),
		notes = $bindable(""),
		order = $bindable(0),
		error = $bindable(""),
		onSubmit
	} = $props<{
		mode?: "add" | "edit";
		label?: string;
		url?: string;
		notes?: string;
		order?: number;
		error?: string;
		onSubmit: () => void;
	}>();
</script>

<form class="grid gap-3 py-2">
	<div class="grid gap-1.5">
		<Label for="label">Label</Label>
		<Input
			id="label"
			autocomplete="off"
			bind:value={label}
			placeholder="Server name" />
	</div>
	<div class="grid gap-1.5">
		<Label for="url">URL</Label>
		<Input
			id="url"
			autocomplete="off"
			bind:value={url}
			placeholder="URL or IP" />
	</div>
	<div class="grid gap-1.5">
		<Label for="notes">Notes <span class="text-muted-foreground text-xs">(optional)</span></Label>
		<Textarea
			id="notes"
			bind:value={notes}
			rows={2}
			placeholder="Notes, passwords, etc." />
	</div>
	{#if mode === "edit"}
		<div class="grid gap-1.5">
			<Label for="order">Order <span class="text-muted-foreground text-xs">(optional)</span></Label>
			<Input
				id="order"
				type="number"
				min={0}
				bind:value={order}
				placeholder="Lower number is higher order" />
		</div>
	{/if}
	<Button
		type="submit"
		onclick={onSubmit}
		class="w-full">{mode === "add" ? "Add" : "Update"} Server</Button>

	{#if error}
		<Alert.Root variant="destructive">
			<Alert.Description>{error}</Alert.Description>
		</Alert.Root>
	{/if}
</form>
