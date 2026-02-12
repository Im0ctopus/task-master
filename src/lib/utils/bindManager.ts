import { tabs } from '$lib/components/tabSelector/tabSelector.svelte';
import type { Status } from '$lib/types/status';

export type BindActions = {
	toggleIsTyping: (val: boolean) => void;
	onTabChange: (tab: Status) => void;
};

export const bindManager = (e: KeyboardEvent, actions: BindActions) => {
	const { key, ctrlKey } = e;
	const { toggleIsTyping, onTabChange } = actions;

	console.log(key);

	if (ctrlKey) {
		switch (key) {
			case 'Enter':
				toggleIsTyping(true);
				break;
		}
	} else {
		const tabIndex = Number(key);
		const tab = tabs[tabIndex - 1];
		if (tab) return onTabChange(tab.value);
	}
};
