import { tabs } from '$lib/components/tabSelector/tabSelector.svelte';
import type { Status } from '$lib/types/status';
import type { SelectedTask } from '$lib/types/taskContext';

export type BindActions = {
	toggleIsTyping: (val: boolean) => void;
	onTabChange: (tab: Status) => void;
	onStatusChange: (status: Status, taskIndex: number, subTaskIndex?: number) => void;
	onTaskChange: (goto: -1 | 1, skip?: boolean) => void;
	toggleTaskOpen: (index: number) => void;
	toggleSearch: (value: boolean) => void;
};

export const bindManager = (e: KeyboardEvent, selectedTask: SelectedTask, actions: BindActions) => {
	const { key, ctrlKey } = e;
	const {
		toggleIsTyping,
		onTabChange,
		onStatusChange,
		onTaskChange,
		toggleTaskOpen,
		toggleSearch
	} = actions;

	// console.log(key);

	if (ctrlKey) {
		switch (key) {
			case ' ':
			case 'Enter': {
				toggleIsTyping(true);
				break;
			}
			case 'ArrowUp': {
				e.preventDefault();
				onTaskChange(-1, true);
				break;
			}
			case 'ArrowDown': {
				e.preventDefault();
				onTaskChange(1, true);
				break;
			}
			case 'f': {
				e.preventDefault();
				toggleSearch(true);
				break;
			}
		}
	} else {
		switch (key) {
			case 'ArrowUp': {
				e.preventDefault();
				onTaskChange(-1);
				break;
			}
			case 'ArrowDown': {
				e.preventDefault();
				onTaskChange(1);
				break;
			}
			case ' ':
			case 'Enter': {
				toggleTaskOpen(selectedTask.taskIndex);
				break;
			}
			case 'n': {
				onStatusChange('none', selectedTask.taskIndex, selectedTask.subTaskIndex);
				break;
			}
			case 's': {
				onStatusChange('started', selectedTask.taskIndex, selectedTask.subTaskIndex);
				break;
			}
			case 'd': {
				onStatusChange('done', selectedTask.taskIndex, selectedTask.subTaskIndex);
				break;
			}
			case 'c': {
				onStatusChange('canceled', selectedTask.taskIndex, selectedTask.subTaskIndex);
				break;
			}
			case 'Escape': {
				toggleSearch(false);
				break;
			}
			default: {
				const tabIndex = Number(key);
				const tab = tabs[tabIndex - 1];
				if (tab) return onTabChange(tab.value);

				break;
			}
		}
	}
};
