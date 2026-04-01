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
		path: '/todo-list',
		name: 'TodoList',
		icon: 'OrderedListOutlined',
		component: './TodoList',
	},

	{
		path: '/danh-muc-san-pham',
		name: 'Danh mục sản phẩm',
		icon: 'OrderedListOutlined',
		component: './DanhMucSanPham',
	},

	{
		path: '/order-product-management',
		name: 'Order & Product Management',
		icon: 'ShoppingOutlined',
		component: './OrderProductManagement',
	},
	{
		path: '/guess-number-game',
		name: 'Trò chơi đoán số',
		icon: 'QuestionCircleOutlined',
		component: './GuessNumberGame',
	},
	{
		path: '/study-tracking',
		name: 'Quản lý học tập',
		icon: 'BookOutlined',
		component: './StudyTracking',
	},
	{
		path: '/club-management',
		name: 'Quản lý câu lạc bộ',
		icon: 'TeamOutlined',
		routes: [
			{
				path: '/club-management/list',
				name: 'Danh sách câu lạc bộ',
				component: './ClubManagement',
			},
			{
				path: '/club-management/registrations',
				name: 'Quản lý đơn đăng ký',
				component: './RegistrationManagement',
			},
			{
				path: '/club-management/members',
				name: 'Quản lý thành viên',
				component: './MemberManagement',
			},
			{
				path: '/club-management/reports',
				name: 'Báo cáo thống kê',
				component: './ClubReports',
			},
		],
	},
	{
		path: '/club-members',
		component: './MemberManagement',
		hideInMenu: true,
	},
	{
		path: '/booking-system',
		name: 'Booking System',
		icon: 'ScheduleOutlined',
		routes: [
			{
				path: '/booking-system/employees',
				name: 'Employees',
				component: './BookingSystem/EmployeeManagement',
			},
			{
				path: '/booking-system/services',
				name: 'Services',
				component: './BookingSystem/ServiceManagement',
			},
			{
				path: '/booking-system/appointments',
				name: 'Appointments',
				component: './BookingSystem/AppointmentBooking',
			},
			{
				path: '/booking-system/reviews',
				name: 'Reviews',
				component: './BookingSystem/ReviewManagement',
			},
			{
				path: '/booking-system/statistics',
				name: 'Statistics',
				component: './BookingSystem/Statistics',
			},
		],
	},
	{
		path: '/rock-paper-scissors',
		name: 'Trò chơi Oẳn Tù Tì',
		icon: 'ThunderboltOutlined',
		component: './RockPaperScissors',
	},
	{
		path: '/ngan-hang-cau-hoi',
		name: 'Ngân hàng câu hỏi',
		icon: 'DatabaseOutlined',
		routes: [
			{
				path: '/ngan-hang-cau-hoi/danh-muc',
				name: 'Danh mục',
				component: './NganHangCauHoi/DanhMuc',
			},
			{
				path: '/ngan-hang-cau-hoi/cau-hoi',
				name: 'Câu hỏi',
				component: './NganHangCauHoi/CauHoi',
			},
			{
				path: '/ngan-hang-cau-hoi/de-thi',
				name: 'Đề thi',
				component: './NganHangCauHoi/DeThi',
			},
		],
	},
	{
		path: '/notification',
		routes: [
			{
				path: './subscribe',
				exact: true,
				component: './ThongBao/Subscribe',
			},
			{
				path: './check',
				exact: true,
				component: './ThongBao/Check',
			},
			{
				path: './',
				exact: true,
				component: './ThongBao/NotifOneSignal',
			},
		],
		layout: false,
		hideInMenu: true,
	},
	{
		path: '/',
	},
	{
		path: '/van-bang',
		name: 'Quản lý Văn bằng',
		icon: 'SolutionOutlined',
		routes: [
			{
				path: '/van-bang/tra-cuu',
				name: 'Tra cứu văn bằng',
				component: './VanBang/TraCuu',
			},
			{
				path: '/van-bang/cau-hinh',
				name: 'Cấu hình biểu mẫu',
				component: './VanBang/CauHinh',
			},
			{
				path: '/van-bang/so-van-bang',
				name: 'Sổ văn bằng',
				component: './VanBang/SoVanBang',
			},
			{
				path: '/van-bang/quyet-dinh',
				name: 'Quyết định tốt nghiệp',
				component: './VanBang/QuyetDinh',
			},
			{
				path: '/van-bang/thong-tin',
				name: 'Thông tin văn bằng',
				component: './VanBang/ThongTin',
			},
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
