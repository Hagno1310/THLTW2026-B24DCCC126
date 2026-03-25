declare namespace VanBang {
	export interface ISoVanBang {
		_id: string;
		nam: number;
		ten: string;
		soVaoSoHienTai: number;
		createdAt?: string;
		updatedAt?: string;
	}

	export interface IQuyetDinh {
		_id: string;
		soQD: string;
		ngayBanHanh: string;
		trichYeu: string;
		idSoVanBang: string; // FK
		soLuotTraCuu?: number;
		createdAt?: string;
		updatedAt?: string;
		// Expanded fields
		soVanBang?: ISoVanBang;
	}

	export interface ICauHinh {
		_id: string;
		ma: string;
		ten: string;
		kieuDuLieu: 'String' | 'Number' | 'Date';
		createdAt?: string;
		updatedAt?: string;
	}

	export interface IThongTinVanBang {
		_id: string;
		soVaoSo: number;
		soHieuVanBang: string;
		maSV: string;
		hoTen: string;
		ngaySinh: string;
		idQuyetDinh: string; // FK
		phuLuc: Record<string, any>; // Dynamic fields
		createdAt?: string;
		updatedAt?: string;
		// Expanded fields
		quyetDinh?: IQuyetDinh;
	}
}
