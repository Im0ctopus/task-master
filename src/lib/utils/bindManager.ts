import { type Tab, tabs } from '$lib/components/tabSelector/tabSelector.svelte';

export type BindActions = {
	toggleIsTyping: (val: boolean) => void;
	onTabChange: (tab: Tab) => void;
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
