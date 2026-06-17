import { PersistedStore, STORE_FILES } from "$scripts/storage.svelte.js";

export const incognito = new PersistedStore<boolean>(STORE_FILES.settings, "incognito", false);
