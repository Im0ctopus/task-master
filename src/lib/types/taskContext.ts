export type TaskContext = {
	getSelectedTask: () => SelectedTask;
	setSelectedTask: (index: SelectedTask) => void;
};

export type SelectedTask = {
	taskIndex: number;
	subTaskIndex?: number;
};

export const defaultSelectedTask: SelectedTask = {
	taskIndex: 0
};
