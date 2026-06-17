import { load, type Store } from "@tauri-apps/plugin-store";

/**
 * Store files persisted in the app data directory by the Tauri Store plugin.
 * Each concern lives in its own file so they can be backed up / inspected
 * independently.
 */
export const STORE_FILES = {
	settings: "settings.json",
	servers: "servers.json",
	nodeservers: "nodeservers.json"
} as const;

/**
 * Reads and removes a legacy value written by `runed`'s `PersistedState`
 * (browser `localStorage`). Returns `undefined` when there is nothing to migrate.
 */
function migrateFromLocalStorage<T>(key: string): T | undefined {
	if (typeof localStorage === "undefined") return undefined;

	const raw = localStorage.getItem(key);
	if (raw === null) return undefined;

	try {
		const parsed = JSON.parse(raw) as T;
		localStorage.removeItem(key);
		return parsed;
	} catch {
		// Corrupted legacy value — drop it so we don't keep retrying.
		localStorage.removeItem(key);
		return undefined;
	}
}

/**
 * A reactive value persisted with the Tauri Store plugin.
 *
 * Mirrors the ergonomics of `runed`'s `PersistedState` (`.current` getter/setter)
 * so existing call sites keep working, but the data is stored on disk via the
 * backend instead of in `localStorage`.
 *
 * Loading from disk is asynchronous; until it resolves the `initial` value is
 * used. The first time a key is missing on disk we transparently migrate any
 * legacy `localStorage` value written by the previous implementation.
 */
export class PersistedStore<T> {
	#key: string;
	#ready: Promise<Store>;
	#value = $state<T>() as T;

	constructor(file: string, key: string, initial: T) {
		this.#key = key;
		this.#value = initial;
		this.#ready = this.#init(file);
	}

	async #init(file: string): Promise<Store> {
		const store = await load(file, { defaults: {}, autoSave: false });

		let value: T | undefined = await store.get<T>(this.#key);

		if (value === undefined || value === null) {
			const migrated = migrateFromLocalStorage<T>(this.#key);
			if (migrated !== undefined && migrated !== null) {
				value = migrated;
				await store.set(this.#key, migrated);
				await store.save();
			}
		}

		if (value !== undefined && value !== null) {
			this.#value = value;
		}

		return store;
	}

	async #persist(value: T): Promise<void> {
		const store = await this.#ready;
		await store.set(this.#key, $state.snapshot(value));
		await store.save();
	}

	get current(): T {
		return this.#value;
	}

	set current(value: T) {
		this.#value = value;
		void this.#persist(value);
	}
}
