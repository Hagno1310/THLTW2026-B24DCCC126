declare namespace TaskTracking {
	type TaskStatus = 'todo' | 'inProgress' | 'done';
	type TaskPriority = 'High' | 'Medium' | 'Low';

	interface Task {
		id: string;
		title: string;
		description: string;
		status: TaskStatus;
		priority: TaskPriority;
		tags: string[];
		deadline: string;
		createdAt: string;
		updatedAt: string;
	}
}
