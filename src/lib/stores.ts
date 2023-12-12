import { persisted } from 'svelte-persisted-store';
import type { Server, NodeServer } from '$lib/types';

export const preferences = persisted('preferences', {
	streamMode: false,
	language: { value: 'en', label: 'EN-US' }
});

// Kept the name 'storage' for backwards compatibility; TODO: migration
export const servers = persisted('storage', [] as Server[]);

export const nodeservers = persisted('nodeservers', [] as NodeServer[]);
