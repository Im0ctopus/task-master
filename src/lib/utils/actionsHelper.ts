import type { SubTask, Task } from '../../routes/+page.svelte';

export type Action = {
	type: 'edit';
	task: Task;
	subTask?: SubTask;
};

export const enterAction = (trimmedValue: string, filteredTasks: Task[]): Action | undefined => {
	const cleanedUpVal = trimmedValue.substring(1);
	const action = cleanedUpVal[0];
	const subject = cleanedUpVal.substring(1);

	if (action === 'e') {
		const ids = subject.split('.');
		const taskId = Number(ids[0]);
		const subTaskId = Number(ids[1]);
		if (isNaN(taskId) || !taskId || ids.length > 2) {
			console.error('Invalid edit format');
			return;
		}

		if (isNaN(subTaskId)) {
			const task = getTask(filteredTasks, taskId);
			if (!task) return;

			return {
				type: 'edit',
				task
			};
		} else {
			const tasksInfo = getSubTask(filteredTasks, taskId, subTaskId);
			if (!tasksInfo) return;

			return {
				type: 'edit',
				task: tasksInfo.task,
				subTask: tasksInfo.subTask
			};
		}
	} else {
		console.error('No matching action found');
		return;
	}
};

const getTask = (tasks: Task[], taskId: number): Task | null => {
	console.log(taskId);
	const task = tasks[taskId > 0 ? taskId - 1 : tasks.length + taskId];
	if (!task) {
		console.error('Task not found');
		return null;
	}

	return task;
};

const getSubTask = (
	tasks: Task[],
	taskId: number,
	subTaskId: number
): { task: Task; subTask: SubTask } | null => {
	const task = getTask(tasks, taskId);
	if (!task) return null;

	const subTask = task.subTasks[subTaskId > 0 ? subTaskId - 1 : task.subTasks.length + subTaskId];
	if (!subTask) {
		console.error('SubTask not found');
		return null;
	}

	return { task, subTask };
};
