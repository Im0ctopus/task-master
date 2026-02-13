import { tabs } from '$lib/components/tabSelector/tabSelector.svelte';
import type { Status } from '$lib/types/status';
import type { SelectedTask } from '$lib/types/taskContext';

export type BindActions = {
	toggleIsTyping: (val: boolean) => void;
	onTabChange: (tab: Status) => void;
	onStatusChange: (status: Status, taskId: number, subTaskId?: number) => void;
	onTaskChange: (goto: -1 | 1, skip?: boolean) => void;
	toggleTaskOpen: (index: number) => void;
};

export const bindManager = (e: KeyboardEvent, selectedTask: SelectedTask, actions: BindActions) => {
	const { key, ctrlKey } = e;
	const { toggleIsTyping, onTabChange, onStatusChange, onTaskChange, toggleTaskOpen } = actions;

	// console.log(key);

	if (ctrlKey) {
		switch (key) {
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
			case 'Enter': {
				toggleTaskOpen(selectedTask.taskIndex);
				break;
			}
			case 's': {
				// FIXME: Not working at all
				onStatusChange('started', selectedTask.taskIndex, selectedTask.subTaskIndex);
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
