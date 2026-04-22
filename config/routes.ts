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
