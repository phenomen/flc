/* i18n */
import { get } from 'svelte/store';
import { preferences } from '$lib/stores';
import type { I18n } from '$lib/types';
import i18nJson from '$lib/i18n.json';

class Localization {
	private i18n: I18n;

	constructor() {
		this.i18n = i18nJson;
	}

	s(key: string): string {
		const lang = get(preferences).language.value;
		return this.i18n[key][lang];
	}
}

export const lc = new Localization();
