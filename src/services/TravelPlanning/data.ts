const STORAGE_KEYS = {
	DESTINATIONS: 'TRAVEL_DESTINATIONS',
	ITINERARIES: 'TRAVEL_ITINERARIES',
};

const initialDestinations: TravelPlanning.Destination[] = [
	// Beach (4)
	{
		id: 'd1',
		name: 'Phú Quốc',
		description: 'Đảo ngọc với bãi biển cát trắng, nước trong xanh và hệ sinh thái san hô phong phú.',
		image:
			'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Bai-sao-phu-quoc-tuonglamphotos.jpg/500px-Bai-sao-phu-quoc-tuonglamphotos.jpg',
		location: 'Kiên Giang',
		type: 'beach',
		rating: 5,
		visitDuration: 8,
		cost: { dining: 500000, accommodation: 1200000, transport: 300000 },
	},
	{
		id: 'd2',
		name: 'Nha Trang',
		description: 'Thành phố biển nổi tiếng với vịnh đẹp, đảo hoang sơ và cuộc sống về đêm sôi động.',
		image:
			'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Nha_Trang%2C_Kh%C3%A1nh_H%C3%B2a.png/500px-Nha_Trang%2C_Kh%C3%A1nh_H%C3%B2a.png',
		location: 'Khánh Hòa',
		type: 'beach',
		rating: 4,
		visitDuration: 6,
		cost: { dining: 400000, accommodation: 800000, transport: 250000 },
	},
	{
		id: 'd3',
		name: 'Đà Nẵng',
		description: 'Thành phố đáng sống với bãi biển Mỹ Khê, cầu Rồng và ẩm thực đường phố tuyệt vời.',
		image:
			'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Dragon_Bridge%2C_Da_Nang_during_day_-_20230819_%28cropped%29.jpg/500px-Dragon_Bridge%2C_Da_Nang_during_day_-_20230819_%28cropped%29.jpg',
		location: 'Đà Nẵng',
		type: 'beach',
		rating: 5,
		visitDuration: 6,
		cost: { dining: 350000, accommodation: 700000, transport: 200000 },
	},
	{
		id: 'd4',
		name: 'Quy Nhơn',
		description: 'Vùng biển hoang sơ với Eo Gió, Kỳ Co và nền ẩm thực hải sản tươi ngon.',
		image:
			'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Skyline_of_Quy_Nhon.jpg/500px-Skyline_of_Quy_Nhon.jpg',
		location: 'Bình Định',
		type: 'beach',
		rating: 4,
		visitDuration: 5,
		cost: { dining: 300000, accommodation: 600000, transport: 200000 },
	},
	// Mountain (4)
	{
		id: 'd5',
		name: 'Sa Pa',
		description: 'Thị trấn trong sương với ruộng bậc thang, đỉnh Fansipan và văn hóa dân tộc đặc sắc.',
		image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Thacbac3.jpg/500px-Thacbac3.jpg',
		location: 'Lào Cai',
		type: 'mountain',
		rating: 5,
		visitDuration: 8,
		cost: { dining: 300000, accommodation: 500000, transport: 350000 },
	},
	{
		id: 'd6',
		name: 'Đà Lạt',
		description: 'Thành phố ngàn hoa với khí hậu mát mẻ, thác nước và vườn dâu tây.',
		image:
			'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Xuan_Huong_Lake_11.jpg/500px-Xuan_Huong_Lake_11.jpg',
		location: 'Lâm Đồng',
		type: 'mountain',
		rating: 5,
		visitDuration: 6,
		cost: { dining: 250000, accommodation: 450000, transport: 200000 },
	},
	{
		id: 'd7',
		name: 'Hà Giang',
		description: 'Cao nguyên đá hùng vĩ với đèo Mã Pí Lèng, sông Nho Quế và bản làng dân tộc.',
		image:
			'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/%C4%90%C3%A8o_M%C3%A3_P%C3%AC_L%C3%A8ng.jpg/500px-%C4%90%C3%A8o_M%C3%A3_P%C3%AC_L%C3%A8ng.jpg',
		location: 'Hà Giang',
		type: 'mountain',
		rating: 5,
		visitDuration: 10,
		cost: { dining: 200000, accommodation: 350000, transport: 400000 },
	},
	{
		id: 'd8',
		name: 'Tam Đảo',
		description: 'Khu nghỉ dưỡng gần Hà Nội với rừng nguyên sinh, thác bạc và khí hậu mát lạnh.',
		image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Tam_Dao_peaks.jpg/500px-Tam_Dao_peaks.jpg',
		location: 'Vĩnh Phúc',
		type: 'mountain',
		rating: 3,
		visitDuration: 4,
		cost: { dining: 200000, accommodation: 400000, transport: 150000 },
	},
	// City (4)
	{
		id: 'd9',
		name: 'Hà Nội',
		description: 'Thủ đô ngàn năm văn hiến với phố cổ, hồ Hoàn Kiếm và ẩm thực đường phố.',
		image:
			'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Hanoi_skyline_with_Ba_Vi_Mountain.jpg/500px-Hanoi_skyline_with_Ba_Vi_Mountain.jpg',
		location: 'Hà Nội',
		type: 'city',
		rating: 4,
		visitDuration: 8,
		cost: { dining: 300000, accommodation: 600000, transport: 150000 },
	},
	{
		id: 'd10',
		name: 'TP. Hồ Chí Minh',
		description: 'Thành phố năng động nhất Việt Nam với nhà thờ Đức Bà, chợ Bến Thành và ẩm thực đa dạng.',
		image:
			'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/Ho_Chi_Minh_City_panorama_2019_%28cropped2%29.jpg/500px-Ho_Chi_Minh_City_panorama_2019_%28cropped2%29.jpg',
		location: 'TP.HCM',
		type: 'city',
		rating: 4,
		visitDuration: 8,
		cost: { dining: 350000, accommodation: 700000, transport: 200000 },
	},
	{
		id: 'd11',
		name: 'Huế',
		description: 'Cố đô với Đại Nội, lăng tẩm, sông Hương và nền ẩm thực cung đình tinh tế.',
		image:
			'https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Th%C3%A0nh_ph%E1%BB%91_Hu%E1%BA%BF_nh%C3%ACn_t%E1%BB%AB_tr%C3%AAn_cao_%282%29.jpg/500px-Th%C3%A0nh_ph%E1%BB%91_Hu%E1%BA%BF_nh%C3%ACn_t%E1%BB%AB_tr%C3%AAn_cao_%282%29.jpg',
		location: 'Thừa Thiên Huế',
		type: 'city',
		rating: 4,
		visitDuration: 6,
		cost: { dining: 250000, accommodation: 500000, transport: 150000 },
	},
	{
		id: 'd12',
		name: 'Hội An',
		description: 'Phố cổ di sản UNESCO với đèn lồng rực rỡ, may đo nổi tiếng và ẩm thực đặc sắc.',
		image:
			'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/H%E1%BB%99i_An%2C_Ancient_Town%2C_2020-01_CN-10.jpg/500px-H%E1%BB%99i_An%2C_Ancient_Town%2C_2020-01_CN-10.jpg',
		location: 'Quảng Nam',
		type: 'city',
		rating: 5,
		visitDuration: 6,
		cost: { dining: 300000, accommodation: 550000, transport: 100000 },
	},
];

const initialItineraries: TravelPlanning.Itinerary[] = [
	{
		id: 'it1',
		name: 'Du lịch biển Phú Quốc 3 ngày',
		budgetLimit: 8000000,
		days: [
			{ id: 'day1-1', dayNumber: 1, destinations: ['d1'] },
			{ id: 'day1-2', dayNumber: 2, destinations: ['d1', 'd4'] },
			{ id: 'day1-3', dayNumber: 3, destinations: ['d1'] },
		],
		createdAt: '2026-01-15T08:00:00.000Z',
	},
	{
		id: 'it2',
		name: 'Khám phá Tây Bắc 4 ngày',
		budgetLimit: 6000000,
		days: [
			{ id: 'day2-1', dayNumber: 1, destinations: ['d9'] },
			{ id: 'day2-2', dayNumber: 2, destinations: ['d5'] },
			{ id: 'day2-3', dayNumber: 3, destinations: ['d7'] },
			{ id: 'day2-4', dayNumber: 4, destinations: ['d5', 'd9'] },
		],
		createdAt: '2026-02-10T08:00:00.000Z',
	},
	{
		id: 'it3',
		name: 'Miền Trung 3 ngày',
		budgetLimit: 5000000,
		days: [
			{ id: 'day3-1', dayNumber: 1, destinations: ['d3'] },
			{ id: 'day3-2', dayNumber: 2, destinations: ['d12', 'd11'] },
			{ id: 'day3-3', dayNumber: 3, destinations: ['d3'] },
		],
		createdAt: '2026-03-20T08:00:00.000Z',
	},
	{
		id: 'it4',
		name: 'Đà Lạt - Nha Trang 5 ngày',
		budgetLimit: 10000000,
		days: [
			{ id: 'day4-1', dayNumber: 1, destinations: ['d6'] },
			{ id: 'day4-2', dayNumber: 2, destinations: ['d6'] },
			{ id: 'day4-3', dayNumber: 3, destinations: ['d2'] },
			{ id: 'day4-4', dayNumber: 4, destinations: ['d2'] },
			{ id: 'day4-5', dayNumber: 5, destinations: ['d2'] },
		],
		createdAt: '2026-04-05T08:00:00.000Z',
	},
];

const getLocal = <T>(key: string, initialData: T[]): T[] => {
	const data = localStorage.getItem(key);
	if (data) {
		try {
			const parsed = JSON.parse(data);
			if (Array.isArray(parsed) && parsed.length > 0) return parsed;
		} catch {
			// ignore
		}
	}
	localStorage.setItem(key, JSON.stringify(initialData));
	return initialData;
};

const setLocal = <T>(key: string, data: T[]) => {
	localStorage.setItem(key, JSON.stringify(data));
};

export const TravelData = {
	getDestinations: () => getLocal<TravelPlanning.Destination>(STORAGE_KEYS.DESTINATIONS, initialDestinations),
	saveDestinations: (data: TravelPlanning.Destination[]) => setLocal(STORAGE_KEYS.DESTINATIONS, data),
	getDestinationById: (id: string) => TravelData.getDestinations().find((d) => d.id === id),

	getItineraries: () => getLocal<TravelPlanning.Itinerary>(STORAGE_KEYS.ITINERARIES, initialItineraries),
	saveItineraries: (data: TravelPlanning.Itinerary[]) => setLocal(STORAGE_KEYS.ITINERARIES, data),
	getItineraryById: (id: string) => TravelData.getItineraries().find((it) => it.id === id),

	calculateItineraryBudget: (itinerary: TravelPlanning.Itinerary) => {
		const destinations = TravelData.getDestinations();
		let dining = 0;
		let accommodation = 0;
		let transport = 0;

		itinerary.days.forEach((day) => {
			day.destinations.forEach((destId) => {
				const dest = destinations.find((d) => d.id === destId);
				if (dest) {
					dining += dest.cost.dining;
					accommodation += dest.cost.accommodation;
					transport += dest.cost.transport;
				}
			});
			// Travel time cost between destinations (estimated 2h travel = 100k VND per connection)
			if (day.destinations.length > 1) {
				transport += (day.destinations.length - 1) * 100000;
			}
		});

		return { dining, accommodation, transport, total: dining + accommodation + transport };
	},

	getMonthlyStats: () => {
		const itineraries = TravelData.getItineraries();
		const monthMap: Record<string, number> = {};

		itineraries.forEach((it) => {
			const month = it.createdAt.substring(0, 7); // YYYY-MM
			monthMap[month] = (monthMap[month] || 0) + 1;
		});

		return Object.entries(monthMap)
			.sort(([a], [b]) => a.localeCompare(b))
			.map(([month, count]) => ({ month, count }));
	},

	getPopularDestinations: () => {
		const itineraries = TravelData.getItineraries();
		const destinations = TravelData.getDestinations();
		const countMap: Record<string, number> = {};

		itineraries.forEach((it) => {
			it.days.forEach((day) => {
				day.destinations.forEach((destId) => {
					countMap[destId] = (countMap[destId] || 0) + 1;
				});
			});
		});

		return destinations
			.map((d) => ({ ...d, usageCount: countMap[d.id] || 0 }))
			.sort((a, b) => b.usageCount - a.usageCount);
	},

	getCategoryRevenue: () => {
		const itineraries = TravelData.getItineraries();
		let dining = 0;
		let accommodation = 0;
		let transport = 0;

		itineraries.forEach((it) => {
			const budget = TravelData.calculateItineraryBudget(it);
			dining += budget.dining;
			accommodation += budget.accommodation;
			transport += budget.transport;
		});

		return { dining, accommodation, transport };
	},
};

export const initTravelPlanningMockData = () => {
	if (!localStorage.getItem(STORAGE_KEYS.DESTINATIONS)) {
		localStorage.setItem(STORAGE_KEYS.DESTINATIONS, JSON.stringify(initialDestinations));
	}
	if (!localStorage.getItem(STORAGE_KEYS.ITINERARIES)) {
		localStorage.setItem(STORAGE_KEYS.ITINERARIES, JSON.stringify(initialItineraries));
	}
};
