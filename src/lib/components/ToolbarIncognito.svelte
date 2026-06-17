<script lang="ts">
	import * as Tooltip from "$lib/components/ui/tooltip/index.js";
	import { HatGlassesIcon } from "@lucide/svelte";

	import { Button } from "$ui/button/index.js";
	import { incognito } from "$scripts/settings.svelte.js";
</script>

<Tooltip.Root>
	<Tooltip.Trigger>
		<Button
			onclick={() => (incognito.current = !incognito.current)}
			class={[incognito.current && "border-primary text-primary"]}
			variant="outline"
			size="icon">
			<HatGlassesIcon class="block size-5" />
		</Button>
	</Tooltip.Trigger>
	<Tooltip.Content>
		<div>
			<p class="font-semibold">Toggle Incognito Mode</p>
			<p>
				New Foundry windows will open with a fresh non-shared cache. This will allow you to log in
				as different users on the same server. You may use non-incognito for GM window and incognito
				for Player.
			</p>
		</div>
	</Tooltip.Content>
</Tooltip.Root>
