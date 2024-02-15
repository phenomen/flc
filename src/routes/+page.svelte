<script lang="ts">
	import { lc } from '$lib/tools';

	import * as Tabs from '$lib/components/ui/tabs';

	import AddServer from '$lib/components/AddServer.svelte';
	import ServerList from '$lib/components/ServerList.svelte';

	import AddServerNode from '$lib/components/AddServerNode.svelte';
	import ServerListNode from '$lib/components/ServerListNode.svelte';
</script>

<Tabs.Root value="join">
	<Tabs.List>
		<Tabs.Trigger value="join">{lc.s('joinServer')}</Tabs.Trigger>
		<Tabs.Trigger value="launch">{lc.s('launchServer')}</Tabs.Trigger>
	</Tabs.List>
	<Tabs.Content value="join">
		<AddServer />
		<ServerList />
	</Tabs.Content>
	<Tabs.Content value="launch">
		<AddServerNode />
		<ServerListNode />
	</Tabs.Content>
</Tabs.Root>
