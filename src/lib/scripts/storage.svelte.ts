import { tick } from "svelte";

export class LocalStorage<T extends object> {
	#key: string;
	#version = $state(0);
	#listeners = 0;
	#value: T | undefined;

	#handler = (e: StorageEvent) => {
		if (e.storageArea !== localStorage) return;
		if (e.key !== this.#key) return;

		this.#version += 1;
	};

	constructor(key: string, initial?: T) {
		this.#key = key;
		this.#value = initial;

		if (typeof localStorage !== "undefined") {
			if (localStorage.getItem(key) === null) {
				localStorage.setItem(key, JSON.stringify(initial));
			}
		}
	}

	get current(): T {
		this.#version;

		const root =
			typeof localStorage !== "undefined"
				? (JSON.parse(localStorage.getItem(this.#key)!) as T)
				: (this.#value as T);

		const proxies = new WeakMap<object, T>();

		const proxy = (value: T | unknown): T | unknown => {
			if (typeof value !== "object" || value === null) {
				return value;
			}

			let p = proxies.get(value as object);

			if (!p) {
				p = new Proxy(value as T, {
					get: (target, property) => {
						this.#version;
						return proxy(Reflect.get(target, property));
					},
					set: (target, property, value) => {
						this.#version += 1;
						Reflect.set(target, property, value);

						if (typeof localStorage !== "undefined") {
							localStorage.setItem(this.#key, JSON.stringify(root));
						}

						return true;
					}
				}) as T;

				proxies.set(value as object, p);
			}

			return p;
		};

		if ($effect.tracking()) {
			$effect(() => {
				if (this.#listeners === 0) {
					window.addEventListener("storage", this.#handler);
				}

				this.#listeners += 1;

				return () => {
					tick().then(() => {
						this.#listeners -= 1;
						if (this.#listeners === 0) {
							window.removeEventListener("storage", this.#handler);
						}
					});
				};
			});
		}

		return proxy(root) as T;
	}

	set current(value: T) {
		if (typeof localStorage !== "undefined") {
			localStorage.setItem(this.#key, JSON.stringify(value));
		}

		this.#version += 1;
	}
}
