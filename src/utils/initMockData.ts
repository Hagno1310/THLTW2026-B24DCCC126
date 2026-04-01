export * from './initClubMockData';

export const initVanBangMockData = () => {
	const keys = {
		cauhinh: 'vb_local_cau-hinh',
		sovanbang: 'vb_local_so-van-bang',
		quyetdinh: 'vb_local_quyet-dinh',
		thongtin: 'vb_local_thong-tin',
	};

	// 1. Mock Cấu hình biểu mẫu
	if (!localStorage.getItem(keys.cauhinh)) {
		const mockCauHinh = [
			{ _id: 'ch1', ma: 'noiSinh', ten: 'Nơi sinh', kieuDuLieu: 'String' },
			{ _id: 'ch2', ma: 'danToc', ten: 'Dân tộc', kieuDuLieu: 'String' },
			{ _id: 'ch3', ma: 'diemTB', ten: 'Điểm trung bình', kieuDuLieu: 'Number' },
			{ _id: 'ch4', ma: 'xepLoai', ten: 'Xếp loại tốt nghiệp', kieuDuLieu: 'String' },
		];
		localStorage.setItem(keys.cauhinh, JSON.stringify(mockCauHinh));
	}

	// 2. Mock Sổ văn bằng
	if (!localStorage.getItem(keys.sovanbang)) {
		const mockSoVanBang = [
			{ _id: 's1', nam: 2023, ten: 'Sổ văn bằng chính quy năm 2023', soVaoSoHienTai: 2 },
			{ _id: 's2', nam: 2024, ten: 'Sổ văn bằng chính quy năm 2024', soVaoSoHienTai: 0 },
		];
		localStorage.setItem(keys.sovanbang, JSON.stringify(mockSoVanBang));
	}

	// 3. Mock Quyết định tốt nghiệp
	if (!localStorage.getItem(keys.quyetdinh)) {
		const mockQuyetDinh = [
			{
				_id: 'qd1',
				soQD: '123/QĐ-ĐHPT',
				ngayBanHanh: '2023-06-15T00:00:00.000Z',
				trichYeu: 'Quyết định công nhận tốt nghiệp đợt 1 năm 2023',
				idSoVanBang: 's1',
				soLuotTraCuu: 15,
			},
			{
				_id: 'qd2',
				soQD: '456/QĐ-ĐHPT',
				ngayBanHanh: '2023-12-20T00:00:00.000Z',
				trichYeu: 'Quyết định công nhận tốt nghiệp đợt 2 năm 2023',
				idSoVanBang: 's1',
				soLuotTraCuu: 5,
			},
		];
		localStorage.setItem(keys.quyetdinh, JSON.stringify(mockQuyetDinh));
	}

	// 4. Mock Thông tin văn bằng
	if (!localStorage.getItem(keys.thongtin)) {
		const mockThongTin = [
			{
				_id: 'tt1',
				soVaoSo: 1,
				soHieuVanBang: 'B2023-0001',
				maSV: 'SV001',
				hoTen: 'Nguyễn Văn Anh',
				ngaySinh: '2001-05-15T00:00:00.000Z',
				idQuyetDinh: 'qd1',
				phuLuc: {
					noiSinh: 'Hà Nội',
					danToc: 'Kinh',
					diemTB: 8.5,
					xepLoai: 'Giỏi',
				},
			},
			{
				_id: 'tt2',
				soVaoSo: 2,
				soHieuVanBang: 'B2023-0002',
				maSV: 'SV002',
				hoTen: 'Trần Thị Bình',
				ngaySinh: '2001-08-22T00:00:00.000Z',
				idQuyetDinh: 'qd1',
				phuLuc: {
					noiSinh: 'Hải Phòng',
					danToc: 'Kinh',
					diemTB: 7.8,
					xepLoai: 'Khá',
				},
			},
		];
		localStorage.setItem(keys.thongtin, JSON.stringify(mockThongTin));
	}
};
