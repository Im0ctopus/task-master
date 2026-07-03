import type { Status } from '$lib/types/status';

export type Task = {
	id: number;
	name: string;
	urgency: string | null;
	status: Status;
	statusDate?: number;
	subTasks: SubTask[];
};

export type SubTask = Omit<Task, 'subTasks'>;
