<script lang="ts">
	import * as Tooltip from "$lib/components/ui/tooltip/index.js";
	import { PersistedState } from "runed";
	import { ScanEyeIcon } from "@lucide/svelte";

	import { Button } from "$ui/button/index.js";

	let incognito = new PersistedState("incognito", false);
</script>

<Tooltip.Provider>
	<Tooltip.Root>
		<Tooltip.Trigger>
			<Button
				onclick={() => (incognito.current = !incognito.current)}
				class={[incognito.current && "border-primary text-primary"]}
				variant="outline"
				size="icon">
				<ScanEyeIcon class="size-5" />
			</Button>
		</Tooltip.Trigger>
		<Tooltip.Content
			arrowClasses="bg-secondary"
			class="bg-secondary text-secondary-foreground text-center text-sm">
			<p class="font-semibold">Toggle Incognito Mode</p>
			<p>New Foundry windows will open with a fresh non-shared cache.</p>
			<p>This will allow you to log in as different users on the same server.</p>
			<p>You may use non-incognito for GM window and incognito for Player.</p>
		</Tooltip.Content>
	</Tooltip.Root>
</Tooltip.Provider>
