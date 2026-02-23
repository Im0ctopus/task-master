import type { Status } from '$lib/types/status';
import type { SelectedTask } from '$lib/types/taskContext';
import type { Task } from '../../routes/+page.svelte';

export const filterTasks = (tasks: Task[], tab: Status, searchValue: string): Task[] => {
	const filteredSubtasksTasks = tasks.map((t) => ({
		...t,
		subTasks: t.subTasks.filter((st) => {
			let res = false;

			switch (true) {
				case st.status === 'done' && t.status !== 'canceled' && st.status === tab:
				case st.status === 'canceled' && t.status !== 'done' && st.status === tab:
				case st.status === 'blocked' &&
					st.status === tab &&
					t.status !== 'canceled' &&
					t.status !== 'done':
				case (st.status === 'none' || st.status === 'started') &&
					t.status === tab &&
					t.status !== 'done' &&
					t.status !== 'canceled' &&
					t.status !== 'blocked':
				case (t.status === 'canceled' || t.status === 'done') && t.status === tab: {
					res = true;
					break;
				}
			}

			return res && st.name.toLowerCase().includes(searchValue.toLowerCase());
		})
	}));

	const filteredTasks = filteredSubtasksTasks.filter(
		(t) =>
			(t.status === tab && t.name.toLowerCase().includes(searchValue.toLowerCase())) ||
			t.subTasks.some((s) => s.status === tab)
	);

	return tab === 'done'
		? filteredTasks.sort(
				(a, b) => Number(b.statusDate || 177777777777777) - Number(a.statusDate || 177777777777777)
			)
		: filteredTasks;
};

export const verifyNewSelection = (tasks: Task[], selectedTask: SelectedTask): SelectedTask => {
	const { taskIndex, subTaskIndex } = selectedTask;

	const task = tasks[taskIndex];
	if (!task) return { taskIndex: taskIndex === 0 ? taskIndex : taskIndex - 1 };

	if (subTaskIndex === undefined) return { taskIndex };

	const subTask = task.subTasks[subTaskIndex];
	if (!subTask)
		return { taskIndex, subTaskIndex: subTaskIndex === 0 ? undefined : subTaskIndex - 1 };

	return selectedTask;
};
