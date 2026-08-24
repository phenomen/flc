<script lang="ts">
	import { FileCodeCornerIcon, FileDownIcon, FileUpIcon } from "@lucide/svelte";

	import * as Dialog from "$ui/dialog/index.js";
	import * as Tooltip from "$ui/tooltip/index.js";
	import * as Alert from "$ui/alert/index.js";
	import { Button } from "$ui/button/index.js";

	import {
		applyServerList,
		exportServerList,
		importServerList,
		type ImportMode,
		type ServerList
	} from "$scripts/server-list.svelte.js";

	let open = $state(false);
	let step = $state<"choose" | "import">("choose");
	let error = $state("");
	let pending = $state<ServerList | null>(null);

	function reset() {
		step = "choose";
		error = "";
		pending = null;
	}

	function openDialog() {
		reset();
		open = true;
	}

	async function handleExport() {
		error = "";
		open = false;
		const result = await exportServerList();

		if (result.success) {
			reset();
			return;
		}

		open = true;
		if ("cancelled" in result) return;
		error = result.error;
	}

	async function handleImportPick() {
		error = "";
		open = false;
		const result = await importServerList();

		open = true;
		if (!result.success) {
			if ("cancelled" in result) return;
			error = result.error;
			pending = null;
			return;
		}

		pending = result.data;
		step = "import";
	}

	function handleImport(mode: ImportMode) {
		if (!pending) return;
		applyServerList(pending, mode);
		open = false;
		reset();
	}
</script>

<Tooltip.Root>
	<Tooltip.Trigger>
		<Button
			onclick={openDialog}
			variant="outline"
			size="icon"
			aria-label="Import/Export Servers">
			<FileCodeCornerIcon class="block size-5" />
		</Button>
	</Tooltip.Trigger>
	<Tooltip.Content>
		<p class="font-semibold">Import/Export Servers</p>
	</Tooltip.Content>
</Tooltip.Root>

<Dialog.Root bind:open>
	<Dialog.Content class="sm:max-w-md">
		{#if step === "choose"}
			<Dialog.Header>
				<Dialog.Title>Import / Export Servers</Dialog.Title>
				<Dialog.Description>Save or load your server list.</Dialog.Description>
			</Dialog.Header>

			<div class="grid gap-2">
				<Button
					variant="outline"
					class="h-auto w-full flex-col items-start gap-0.5 py-3"
					onclick={handleImportPick}>
					<span class="flex items-center gap-1"
						><FileDownIcon class="block size-5" /> Import from JSON</span>
					<span class="text-muted-foreground font-normal">Load servers from a file into FLC</span>
				</Button>
				<Button
					variant="outline"
					class="h-auto w-full flex-col items-start gap-0.5 py-3"
					onclick={handleExport}>
					<span class="flex items-center gap-1"
						><FileUpIcon class="block size-5" /> Export to JSON</span>
					<span class="text-muted-foreground font-normal">Save your current servers to a file</span>
				</Button>
			</div>
		{:else if pending}
			<Dialog.Header>
				<Dialog.Title>Import Servers</Dialog.Title>
				<Dialog.Description>
					This file contains {pending.servers.length} remote
					{pending.servers.length === 1 ? "server" : "servers"} and
					{pending.nodeservers.length} local
					{pending.nodeservers.length === 1 ? "server" : "servers"}.
				</Dialog.Description>
			</Dialog.Header>

			<div class="grid gap-2">
				<Button
					class="h-auto w-full flex-col items-start gap-0.5 py-3"
					onclick={() => handleImport("append")}>
					<span>Append</span>
					<span class="text-primary-foreground/80 font-normal"
						>Keep your current lists and add new servers</span>
				</Button>
				<Button
					variant="destructive"
					class="h-auto w-full flex-col items-start gap-0.5 py-3"
					onclick={() => handleImport("replace")}>
					<span>Replace</span>
					<span class="font-normal opacity-80">Overwrite your current servers</span>
				</Button>
			</div>
		{/if}

		{#if error}
			<Alert.Root variant="destructive">
				<Alert.Title>Something went wrong</Alert.Title>
				<Alert.Description class="whitespace-pre-wrap">{error}</Alert.Description>
			</Alert.Root>
		{/if}
	</Dialog.Content>
</Dialog.Root>
