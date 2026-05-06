export default [
	{
		path: '/user',
		layout: false,
		routes: [
			{
				path: '/user/login',
				layout: false,
				name: 'login',
				component: './user/Login',
			},
			{
				path: '/user',
				redirect: '/user/login',
			},
		],
	},

	///////////////////////////////////
	// DEFAULT MENU
	{
		path: '/dashboard',
		name: 'Dashboard',
		component: './TrangChu',
		icon: 'HomeOutlined',
	},
	{
		path: '/gioi-thieu',
		name: 'About',
		component: './TienIch/GioiThieu',
		hideInMenu: true,
	},
	{
		path: '/random-user',
		name: 'RandomUser',
		component: './RandomUser',
		icon: 'ArrowsAltOutlined',
	},
	{
		path: '/classroom-management',
		name: 'Classroom Management',
		icon: 'BankOutlined',
		component: './ClassroomManagement',
	},
	{
		path: '/personal-blog',
		name: 'Personal Blog',
		icon: 'ReadOutlined',
		routes: [
			{ path: '/personal-blog', redirect: '/personal-blog/home' },
			{ path: '/personal-blog/home', name: 'Home', component: './PersonalBlog/Home' },
			{ path: '/personal-blog/article/:slug', component: './PersonalBlog/ArticleDetail', hideInMenu: true },
			{ path: '/personal-blog/about', name: 'About', component: './PersonalBlog/About' },
			{ path: '/personal-blog/admin/posts', name: 'Post Management', component: './PersonalBlog/PostManagement' },
			{ path: '/personal-blog/admin/tags', name: 'Tag Management', component: './PersonalBlog/TagManagement' },
		],
	},
	{
		path: '/task-tracking',
		name: 'Task Tracking',
		icon: 'ProjectOutlined',
		routes: [
			{ path: '/task-tracking', redirect: '/task-tracking/dashboard' },
			{ path: '/task-tracking/dashboard', name: 'Dashboard', component: './TaskTracking/Dashboard' },
			{ path: '/task-tracking/board', name: 'Kanban Board', component: './TaskTracking/Board' },
			{ path: '/task-tracking/list', name: 'Task List', component: './TaskTracking/TaskList' },
		],
	},
	{
		path: '/fitness-health',
		name: 'Fitness & Health',
		icon: 'HeartOutlined',
		routes: [
			{ path: '/fitness-health', redirect: '/fitness-health/dashboard' },
			{ path: '/fitness-health/dashboard', name: 'Dashboard', component: './FitnessHealth/Dashboard' },
			{ path: '/fitness-health/workouts', name: 'Workout Log', component: './FitnessHealth/WorkoutLog' },
			{ path: '/fitness-health/health-metrics', name: 'Health Metrics', component: './FitnessHealth/HealthMetrics' },
			{ path: '/fitness-health/goals', name: 'Goals', component: './FitnessHealth/GoalManagement' },
			{ path: '/fitness-health/exercises', name: 'Exercise Library', component: './FitnessHealth/ExerciseLibrary' },
		],
	},
	{
		path: '/403',
		component: './exception/403/403Page',
		layout: false,
	},
	{
		path: '/hold-on',
		component: './exception/DangCapNhat',
		layout: false,
	},
	{
		component: './exception/404',
	},
];
