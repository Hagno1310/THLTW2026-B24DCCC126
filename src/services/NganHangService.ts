export const STORAGE_KEYS = {
	KHOI_KIEN_THUC: 'NHCH_KHOI_KIEN_THUC',
	MON_HOC: 'NHCH_MON_HOC',
	CAU_HOI: 'NHCH_CAU_HOI',
	DE_THI: 'NHCH_DE_THI',
	CAU_TRUC_DE: 'NHCH_CAU_TRUC_DE',
};

export interface KhoiKienThuc {
	id: string;
	tenKhoi: string;
}

export interface MonHoc {
	id: string;
	maMon: string;
	tenMon: string;
	soTinChi: number;
}

export interface CauHoi {
	id: string;
	maCauHoi: string;
	idMonHoc: string;
	idKhoiKienThuc: string;
	noiDung: string;
	mucDo: 'Dễ' | 'Trung bình' | 'Khó' | 'Rất khó';
}

export interface CauTrucDe {
	id: string;
	tenCauTruc: string;
	idMonHoc: string;
	cauHinh: {
		idKhoiKienThuc: string;
		mucDo: string;
		soLuong: number;
	}[];
}

export interface DeThi {
	id: string;
	tenDeThi: string;
	idMonHoc: string;
	idCauTrucDe?: string;
	danhSachCauHoi: string[]; // IDs of CauHoi
	ngayTao: string;
}

const getLocal = (key: string) => {
	const data = localStorage.getItem(key);
	return data ? JSON.parse(data) : [];
};

const setLocal = (key: string, data: any) => {
	localStorage.setItem(key, JSON.stringify(data));
};

export const NganHangService = {
	// Khoi Kien Thuc
	getKhoiKienThuc: () => getLocal(STORAGE_KEYS.KHOI_KIEN_THUC),
	saveKhoiKienThuc: (data: KhoiKienThuc[]) => setLocal(STORAGE_KEYS.KHOI_KIEN_THUC, data),

	// Mon Hoc
	getMonHoc: () => getLocal(STORAGE_KEYS.MON_HOC),
	saveMonHoc: (data: MonHoc[]) => setLocal(STORAGE_KEYS.MON_HOC, data),

	// Cau Hoi
	getCauHoi: () => getLocal(STORAGE_KEYS.CAU_HOI),
	saveCauHoi: (data: CauHoi[]) => setLocal(STORAGE_KEYS.CAU_HOI, data),

	// Cau Truc De
	getCauTrucDe: () => getLocal(STORAGE_KEYS.CAU_TRUC_DE),
	saveCauTrucDe: (data: CauTrucDe[]) => setLocal(STORAGE_KEYS.CAU_TRUC_DE, data),

	// De Thi
	getDeThi: () => getLocal(STORAGE_KEYS.DE_THI),
	saveDeThi: (data: DeThi[]) => setLocal(STORAGE_KEYS.DE_THI, data),
};
