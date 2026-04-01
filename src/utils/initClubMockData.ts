export const initClubMockData = () => {
	const clubsKey = 'clubs';
	const registrationsKey = 'registrations';

	if (!localStorage.getItem(clubsKey)) {
		const mockClubs: ClubManagement.Club[] = [
			{
				id: 'club_1',
				name: 'CLB Âm nhạc (Music Club)',
				chairman: 'Nguyễn Văn A',
				foundedDate: '2022-01-15T00:00:00.000Z',
				description: '<p>Nơi giao lưu và phát triển tài năng âm nhạc cho sinh viên.</p>',
				isActive: true,
				avatar: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=200&h=200&fit=crop',
			},
			{
				id: 'club_2',
				name: 'CLB Bóng đá (Football Club)',
				chairman: 'Trần Văn B',
				foundedDate: '2021-05-20T00:00:00.000Z',
				description: '<p>Rèn luyện sức khỏe và đam mê với môn thể thao vua.</p>',
				isActive: true,
				avatar: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=200&h=200&fit=crop',
			},
			{
				id: 'club_3',
				name: 'CLB Lập trình (IT Club)',
				chairman: 'Lê Thị C',
				foundedDate: '2023-03-10T00:00:00.000Z',
				description: '<p>Chia sẻ kiến thức về lập trình và công nghệ mới.</p>',
				isActive: true,
				avatar: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=200&h=200&fit=crop',
			},
			{
				id: 'club_4',
				name: 'CLB Kỹ năng mềm',
				chairman: 'Phạm Văn D',
				foundedDate: '2022-11-11T00:00:00.000Z',
				description: '<p>Phát triển kỹ năng giao tiếp, làm việc nhóm và lãnh đạo.</p>',
				isActive: false,
				avatar: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=200&h=200&fit=crop',
			},
		];
		localStorage.setItem(clubsKey, JSON.stringify(mockClubs));
	}

	if (!localStorage.getItem(registrationsKey)) {
		const now = new Date().toISOString();
		const mockRegistrations: ClubManagement.Registration[] = [
			{
				id: 'reg_1',
				fullName: 'Nguyễn Hoàng Nam',
				email: 'nam.nh@gmail.com',
				phone: '0987654321',
				gender: 'Male',
				address: 'Hà Nội',
				strengths: 'Chơi guitar, hát',
				clubId: 'club_1',
				reason: 'Em rất yêu thích âm nhạc và muốn tham gia biểu diễn.',
				status: 'Approved',
				history: [
					{ actor: 'Admin', action: 'Created', time: '2024-03-01T09:00:00.000Z' },
					{ actor: 'Admin', action: 'Approved', time: '2024-03-02T14:30:00.000Z', note: 'Phù hợp với đội văn nghệ' },
				],
			},
			{
				id: 'reg_2',
				fullName: 'Trần Minh Tuấn',
				email: 'tuan.tm@yahoo.com',
				phone: '0912345678',
				gender: 'Male',
				address: 'Hải Phòng',
				strengths: 'Tiền đạo, tốc độ tốt',
				clubId: 'club_2',
				reason: 'Muốn rèn luyện thể lực và tham gia các giải đấu.',
				status: 'Pending',
				history: [{ actor: 'Admin', action: 'Created', time: '2024-03-15T10:00:00.000Z' }],
			},
			{
				id: 'reg_3',
				fullName: 'Lê Thu Hà',
				email: 'ha.lt@gmail.com',
				phone: '0944556677',
				gender: 'Female',
				address: 'Đà Nẵng',
				strengths: 'Logic tốt, biết Python',
				clubId: 'club_3',
				reason: 'Học hỏi kinh nghiệm từ các anh chị khóa trên.',
				status: 'Approved',
				history: [
					{ actor: 'Admin', action: 'Created', time: '2024-03-10T08:30:00.000Z' },
					{ actor: 'Admin', action: 'Approved', time: '2024-03-11T16:00:00.000Z' },
				],
			},
			{
				id: 'reg_4',
				fullName: 'Phạm Minh Đức',
				email: 'duc.pm@outlook.com',
				phone: '0977889900',
				gender: 'Male',
				address: 'Cần Thơ',
				strengths: 'Giao tiếp tốt',
				clubId: 'club_4',
				reason: 'Muốn cải thiện kỹ năng thuyết trình.',
				status: 'Rejected',
				notes: 'Hiện tại CLB đang ngừng hoạt động.',
				history: [
					{ actor: 'Admin', action: 'Created', time: '2024-03-20T11:00:00.000Z' },
					{ actor: 'Admin', action: 'Rejected', time: '2024-03-21T09:15:00.000Z', note: 'CLB đang tạm dừng' },
				],
			},
			{
				id: 'reg_5',
				fullName: 'Vũ Thùy Linh',
				email: 'linh.vt@gmail.com',
				phone: '0901234567',
				gender: 'Female',
				address: 'TP. HCM',
				strengths: 'Múa, nhảy hiện đại',
				clubId: 'club_1',
				reason: 'Muốn tham gia đội nhảy của CLB.',
				status: 'Pending',
				history: [{ actor: 'Admin', action: 'Created', time: '2024-03-25T15:45:00.000Z' }],
			},
			{
				id: 'reg_6',
				fullName: 'Đỗ Anh Dũng',
				email: 'dung.da@gmail.com',
				phone: '0966554433',
				gender: 'Male',
				address: 'Hà Nam',
				strengths: 'Thủ môn',
				clubId: 'club_2',
				reason: 'Đam mê bóng đá từ nhỏ.',
				status: 'Approved',
				history: [
					{ actor: 'Admin', action: 'Created', time: '2024-03-05T09:00:00.000Z' },
					{ actor: 'Admin', action: 'Approved', time: '2024-03-06T10:00:00.000Z' },
				],
			},
		];
		localStorage.setItem(registrationsKey, JSON.stringify(mockRegistrations));
	}
};
