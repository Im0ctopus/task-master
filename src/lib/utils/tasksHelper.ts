import type { Status } from '$lib/types/status';
import type { SelectedTask } from '$lib/types/taskContext';
import type { Task } from '../../routes/+page.svelte';

export const filterTasks = (tasks: Task[], tab: Status, searchValue: string): Task[] => {
	const filteredSubtasksTasks = tasks.map((t) => ({
		...t,
		subTasks: t.subTasks.filter(
			(st) =>
				(t.status === 'canceled' || st.status === tab) &&
				st.name.toLowerCase().includes(searchValue.toLowerCase())
		)
	}));

	return filteredSubtasksTasks.filter(
		(t) =>
			(t.status === tab && t.name.toLowerCase().includes(searchValue.toLowerCase())) ||
			(t.status !== 'canceled' && t.subTasks.some((s) => s.status === tab))
	);
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
