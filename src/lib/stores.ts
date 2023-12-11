import { persisted } from 'svelte-persisted-store';
import type { Server } from '$lib/types';

export const preferences = persisted('preferences', {
	streamMode: false,
	language: { value: 'en', label: 'EN-US' }
});

export const servers = persisted('storage', [] as Server[]);
