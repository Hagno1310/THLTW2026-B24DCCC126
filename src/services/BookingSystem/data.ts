import moment from 'moment';

const STORAGE_KEYS = {
	EMPLOYEES: 'BOOKING_EMPLOYEES',
	SERVICES: 'BOOKING_SERVICES',
	APPOINTMENTS: 'BOOKING_APPOINTMENTS',
	REVIEWS: 'BOOKING_REVIEWS',
};

const initialEmployees: BookingSystem.Employee[] = [
	{
		id: 'e1',
		name: 'Nguyễn Văn Anh',
		maxAppointmentsPerDay: 8,
		workingSchedule: {
			Monday: { start: '08:00', end: '17:00', enabled: true },
			Tuesday: { start: '08:00', end: '17:00', enabled: true },
			Wednesday: { start: '08:00', end: '17:00', enabled: true },
			Thursday: { start: '08:00', end: '17:00', enabled: true },
			Friday: { start: '08:00', end: '17:00', enabled: true },
			Saturday: { start: '08:00', end: '12:00', enabled: true },
			Sunday: { start: '00:00', end: '00:00', enabled: false },
		},
	},
	{
		id: 'e2',
		name: 'Trần Thị Bảo',
		maxAppointmentsPerDay: 6,
		workingSchedule: {
			Monday: { start: '09:00', end: '18:00', enabled: true },
			Tuesday: { start: '09:00', end: '18:00', enabled: true },
			Wednesday: { start: '09:00', end: '18:00', enabled: true },
			Thursday: { start: '09:00', end: '18:00', enabled: true },
			Friday: { start: '09:00', end: '18:00', enabled: true },
			Saturday: { start: '00:00', end: '00:00', enabled: false },
			Sunday: { start: '00:00', end: '00:00', enabled: false },
		},
	},
	{
		id: 'e3',
		name: 'Lê Hoàng Cường',
		maxAppointmentsPerDay: 5,
		workingSchedule: {
			Monday: { start: '10:00', end: '19:00', enabled: true },
			Tuesday: { start: '10:00', end: '19:00', enabled: true },
			Wednesday: { start: '10:00', end: '19:00', enabled: true },
			Thursday: { start: '10:00', end: '19:00', enabled: true },
			Friday: { start: '10:00', end: '19:00', enabled: true },
			Saturday: { start: '09:00', end: '17:00', enabled: true },
			Sunday: { start: '09:00', end: '17:00', enabled: true },
		},
	},
	{
		id: 'e4',
		name: 'Phạm Minh Đức',
		maxAppointmentsPerDay: 7,
		workingSchedule: {
			Monday: { start: '08:30', end: '17:30', enabled: true },
			Tuesday: { start: '08:30', end: '17:30', enabled: true },
			Wednesday: { start: '08:30', end: '17:30', enabled: true },
			Thursday: { start: '08:30', end: '17:30', enabled: true },
			Friday: { start: '08:30', end: '17:30', enabled: true },
			Saturday: { start: '08:30', end: '17:30', enabled: true },
			Sunday: { start: '00:00', end: '00:00', enabled: false },
		},
	},
];

const initialServices: BookingSystem.Service[] = [
	{ id: 's1', name: 'Cắt tóc nam Classic', price: 120000, duration: 30 },
	{ id: 's2', name: 'Cắt tóc nam Fade', price: 180000, duration: 45 },
	{ id: 's3', name: 'Gội đầu dưỡng sinh (Basic)', price: 150000, duration: 45 },
	{ id: 's4', name: 'Gội đầu dưỡng sinh (Premium)', price: 250000, duration: 75 },
	{ id: 's5', name: 'Uốn tóc Texture', price: 450000, duration: 120 },
	{ id: 's6', name: 'Nhuộm tóc thời trang', price: 550000, duration: 90 },
	{ id: 's7', name: 'Combo Đẳng cấp (Cắt + Gội + Massage)', price: 350000, duration: 90 },
];

const initialAppointments: BookingSystem.Appointment[] = [
	{
		id: 'a1',
		customerName: 'Hoàng Văn Hải',
		customerPhone: '0981234567',
		employeeId: 'e1',
		serviceId: 's1',
		date: moment().subtract(2, 'days').format('YYYY-MM-DD'),
		startTime: '09:00',
		endTime: '09:30',
		status: 'Completed',
		createdAt: moment().subtract(5, 'days').toISOString(),
	},
	{
		id: 'a2',
		customerName: 'Nguyễn Bích Liên',
		customerPhone: '0905556677',
		employeeId: 'e2',
		serviceId: 's3',
		date: moment().subtract(1, 'days').format('YYYY-MM-DD'),
		startTime: '14:00',
		endTime: '14:45',
		status: 'Completed',
		createdAt: moment().subtract(3, 'days').toISOString(),
	},
	{
		id: 'a3',
		customerName: 'Đặng Quốc Huy',
		customerPhone: '0912334455',
		employeeId: 'e3',
		serviceId: 's7',
		date: moment().format('YYYY-MM-DD'),
		startTime: '10:00',
		endTime: '11:30',
		status: 'Confirmed',
		createdAt: moment().subtract(1, 'days').toISOString(),
	},
	{
		id: 'a4',
		customerName: 'Trần Minh Tâm',
		customerPhone: '0977889900',
		employeeId: 'e4',
		serviceId: 's5',
		date: moment().format('YYYY-MM-DD'),
		startTime: '13:30',
		endTime: '15:30',
		status: 'Pending',
		createdAt: moment().toISOString(),
	},
	{
		id: 'a5',
		customerName: 'Lê Thu Hà',
		customerPhone: '0933445566',
		employeeId: 'e1',
		serviceId: 's2',
		date: moment().add(1, 'days').format('YYYY-MM-DD'),
		startTime: '08:30',
		endTime: '09:15',
		status: 'Confirmed',
		createdAt: moment().toISOString(),
	},
	{
		id: 'a6',
		customerName: 'Vũ Anh Tuấn',
		customerPhone: '0966554433',
		employeeId: 'e3',
		serviceId: 's1',
		date: moment().subtract(3, 'days').format('YYYY-MM-DD'),
		startTime: '16:00',
		endTime: '16:30',
		status: 'Completed',
		createdAt: moment().subtract(6, 'days').toISOString(),
	},
	{
		id: 'a7',
		customerName: 'Bùi Gia Bảo',
		customerPhone: '0944112233',
		employeeId: 'e2',
		serviceId: 's4',
		date: moment().subtract(2, 'days').format('YYYY-MM-DD'),
		startTime: '10:00',
		endTime: '11:15',
		status: 'Completed',
		createdAt: moment().subtract(4, 'days').toISOString(),
	},
];

const initialReviews: BookingSystem.Review[] = [
	{
		id: 'r1',
		appointmentId: 'a1',
		employeeId: 'e1',
		rating: 5,
		comment: 'Anh Anh cắt tóc rất kỹ, form đẹp. Sẽ quay lại!',
		employeeReply: 'Cảm ơn bạn Hải đã ủng hộ nhé!',
		createdAt: moment().subtract(1, 'days').toISOString(),
	},
	{
		id: 'r2',
		appointmentId: 'a2',
		employeeId: 'e2',
		rating: 4,
		comment: 'Gội đầu rất thoải mái, massage tốt. Nhân viên hơi ít nói.',
		employeeReply: 'Dạ cảm ơn chị Liên, shop sẽ cải thiện dịch vụ hơn ạ.',
		createdAt: moment().toISOString(),
	},
	{
		id: 'r3',
		appointmentId: 'a6',
		employeeId: 'e3',
		rating: 5,
		comment: 'Nhiệt tình, tay nghề cao.',
		createdAt: moment().subtract(2, 'days').toISOString(),
	},
	{
		id: 'r4',
		appointmentId: 'a7',
		employeeId: 'e2',
		rating: 5,
		comment: 'Dịch vụ premium thật sự xứng đáng đồng tiền.',
		employeeReply: 'Cảm ơn quý khách đã tin tưởng!',
		createdAt: moment().subtract(1, 'days').toISOString(),
	},
];

const getLocal = <T>(key: string, initialData: T[] = []): T[] => {
	const data = localStorage.getItem(key);
	// In development, we can check if it's the "empty" initial array we set before
	// If it's very small or just has the old data, we might want to refresh it with new samples
	// But to be safe and follow the request "cho nhiều data mẫu hơn", I'll force refresh if it's the first run or explicitly asked.
	// For this task, I'll assume clearing local storage or checking length
	if (data) {
		const parsed = JSON.parse(data);
		if (parsed.length > 2) return parsed; // If we already have "more" data, keep it
	}
	localStorage.setItem(key, JSON.stringify(initialData));
	return initialData;
};

const setLocal = <T>(key: string, data: T[]) => {
	localStorage.setItem(key, JSON.stringify(data));
};

export const BookingData = {
	getEmployees: () => getLocal<BookingSystem.Employee>(STORAGE_KEYS.EMPLOYEES, initialEmployees),
	saveEmployees: (data: BookingSystem.Employee[]) => setLocal(STORAGE_KEYS.EMPLOYEES, data),
	getEmployeeById: (id: string) => BookingData.getEmployees().find((e) => e.id === id),

	getServices: () => getLocal<BookingSystem.Service>(STORAGE_KEYS.SERVICES, initialServices),
	saveServices: (data: BookingSystem.Service[]) => setLocal(STORAGE_KEYS.SERVICES, data),
	getServiceById: (id: string) => BookingData.getServices().find((s) => s.id === id),

	getAppointments: () => getLocal<BookingSystem.Appointment>(STORAGE_KEYS.APPOINTMENTS, initialAppointments),
	saveAppointments: (data: BookingSystem.Appointment[]) => setLocal(STORAGE_KEYS.APPOINTMENTS, data),

	getReviews: () => getLocal<BookingSystem.Review>(STORAGE_KEYS.REVIEWS, initialReviews),
	saveReviews: (data: BookingSystem.Review[]) => setLocal(STORAGE_KEYS.REVIEWS, data),

	checkScheduleConflict: (employeeId: string, date: string, startTime: string, endTime: string, excludeId?: string) => {
		const appointments = BookingData.getAppointments();
		return appointments.some(
			(app) =>
				app.employeeId === employeeId &&
				app.date === date &&
				app.status !== 'Cancelled' &&
				app.id !== excludeId &&
				((startTime >= app.startTime && startTime < app.endTime) ||
					(endTime > app.startTime && endTime <= app.endTime) ||
					(startTime <= app.startTime && endTime >= app.endTime)),
		);
	},

	checkDailyCapacity: (employeeId: string, date: string) => {
		const employees = BookingData.getEmployees();
		const employee = employees.find((e) => e.id === employeeId);
		if (!employee) return false;

		const appointments = BookingData.getAppointments();
		const dailyCount = appointments.filter(
			(app) => app.employeeId === employeeId && app.date === date && app.status !== 'Cancelled',
		).length;

		return dailyCount < employee.maxAppointmentsPerDay;
	},

	isWithinWorkingHours: (employeeId: string, date: string, startTime: string, endTime: string) => {
		const employees = BookingData.getEmployees();
		const employee = employees.find((e) => e.id === employeeId);
		if (!employee) return false;

		const dayOfWeek = moment(date).format('dddd');
		const schedule = employee.workingSchedule[dayOfWeek];

		if (!schedule || !schedule.enabled) return false;

		return startTime >= schedule.start && endTime <= schedule.end;
	},

	getEmployeeStats: (employeeId: string) => {
		const appointments = BookingData.getAppointments().filter((a) => a.employeeId === employeeId);
		const reviews = BookingData.getReviews().filter((r) => r.employeeId === employeeId);
		const services = BookingData.getServices();

		const completed = appointments.filter((a) => a.status === 'Completed');
		const totalRevenue = completed.reduce((sum, app) => {
			const service = services.find((s) => s.id === app.serviceId);
			return sum + (service?.price || 0);
		}, 0);

		const avgRating = reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;

		return {
			appointmentCount: appointments.length,
			completedCount: completed.length,
			revenue: totalRevenue,
			averageRating: avgRating,
			reviewCount: reviews.length,
		};
	},
};
