const STORAGE_KEY = 'TASK_TRACKING_TASKS';

export const genId = (): string => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

export const getTasks = (): TaskTracking.Task[] => {
	const raw = localStorage.getItem(STORAGE_KEY);
	return raw ? JSON.parse(raw) : [];
};

export const saveTasks = (tasks: TaskTracking.Task[]) => {
	localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
};

const seedTasks: TaskTracking.Task[] = [
	{
		id: 't1',
		title: 'Design homepage layout',
		description: 'Create wireframes and mockups for the new homepage',
		status: 'done',
		priority: 'High',
		tags: ['design', 'ui'],
		deadline: '2026-04-20',
		createdAt: '2026-04-01T08:00:00.000Z',
		updatedAt: '2026-04-18T10:00:00.000Z',
	},
	{
		id: 't2',
		title: 'Implement authentication',
		description: 'Set up login/register with JWT tokens',
		status: 'inProgress',
		priority: 'High',
		tags: ['backend', 'security'],
		deadline: '2026-05-10',
		createdAt: '2026-04-05T09:00:00.000Z',
		updatedAt: '2026-04-28T14:00:00.000Z',
	},
	{
		id: 't3',
		title: 'Write unit tests',
		description: 'Add tests for utility functions and components',
		status: 'todo',
		priority: 'Medium',
		tags: ['testing'],
		deadline: '2026-05-15',
		createdAt: '2026-04-10T10:00:00.000Z',
		updatedAt: '2026-04-10T10:00:00.000Z',
	},
	{
		id: 't4',
		title: 'Fix responsive issues',
		description: 'Fix layout breakpoints on mobile devices',
		status: 'todo',
		priority: 'Low',
		tags: ['bug', 'css'],
		deadline: '2026-05-01',
		createdAt: '2026-04-12T11:00:00.000Z',
		updatedAt: '2026-04-12T11:00:00.000Z',
	},
	{
		id: 't5',
		title: 'Set up CI/CD pipeline',
		description: 'Configure GitHub Actions for automated deployment',
		status: 'inProgress',
		priority: 'Medium',
		tags: ['devops'],
		deadline: '2026-05-08',
		createdAt: '2026-04-15T08:30:00.000Z',
		updatedAt: '2026-04-25T16:00:00.000Z',
	},
	{
		id: 't6',
		title: 'Database migration',
		description: 'Migrate user data to new schema',
		status: 'todo',
		priority: 'High',
		tags: ['backend', 'database'],
		deadline: '2026-05-03',
		createdAt: '2026-04-18T07:00:00.000Z',
		updatedAt: '2026-04-18T07:00:00.000Z',
	},
];

export const initTaskTrackingData = () => {
	if (!localStorage.getItem(STORAGE_KEY)) {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(seedTasks));
	}
};
