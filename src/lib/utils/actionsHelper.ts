import type { SubTask, Task } from '../../routes/+page.svelte';

export type Action = {
	type: 'edit' | 'createSub';
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
			console.error('Invalid edit format, use /e{taskId} or /e{taskId}.{subTaskId}');
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
	} else if (action === 't') {
		const id = Number(subject);
		if (isNaN(id)) {
			console.error('Invalid taskId, to create a subtask use /t{taskId}');
			return;
		}

		const task = getTask(filteredTasks, id);
		if (!task) {
			console.error('Task not found');
			return;
		}

		return {
			type: 'createSub',
			task
		};
	} else {
		console.error('No matching action found');
		return;
	}
};

const getTask = (tasks: Task[], taskId: number): Task | null => {
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

export type ActionActions = {
	editTask: (id: number, task: Pick<Task, 'name' | 'urgency'>) => void;
	addSubTask: (taskId: number, subTask: Pick<Task, 'name' | 'urgency'>) => void;
	editSubTask: (taskId: number, subTaskId: number, subTask: Pick<Task, 'name' | 'urgency'>) => void;
};

export const onAction = (
	trimmedValue: string,
	action: Action | null,
	urgency: string | null,
	actions: ActionActions
) => {
	if (!action) return;

	const { editTask, addSubTask, editSubTask } = actions;
	const { type, task, subTask } = action;

	const newTask: Pick<Task, 'name' | 'urgency'> = {
		name: trimmedValue,
		urgency
	};

	switch (type) {
		case 'edit': {
			if (!subTask) editTask(task.id, newTask);
			else editSubTask(task.id, subTask.id, newTask);
			break;
		}
		case 'createSub': {
			addSubTask(task.id, newTask);
			break;
		}
		default:
			return;
	}
};

type UrgencyEditActions = Pick<ActionActions, 'editTask' | 'editSubTask'>;

export const onUrgencyEdit = (
	action: Action,
	urgency: string | null,
	actions: UrgencyEditActions
) => {
	const { task, subTask } = action;
	const { editTask, editSubTask } = actions;

	const newTask: Pick<Task, 'name' | 'urgency'> = {
		name: subTask ? subTask.name : task.name,
		urgency
	};

	if (!subTask) editTask(task.id, newTask);
	else editSubTask(task.id, subTask.id, newTask);
};
