import { useState } from 'react';
import { message } from 'antd';

const useLocalModel = <T extends { _id?: string }>(key: string, initFilter: any[] = []) => {
	const [danhSach, setDanhSach] = useState<T[]>([]);
	const [record, setRecord] = useState<T>();
	const [page, setPage] = useState<number>(1);
	const [limit, setLimit] = useState<number>(10);
	const [loading, setLoading] = useState<boolean>(false);
	const [total, setTotal] = useState<number>(0);
	const [edit, setEdit] = useState<boolean>(false);
	const [isView, setIsView] = useState<boolean>(true);
	const [visibleForm, setVisibleForm] = useState<boolean>(false);
	const [formSubmiting, setFormSubmiting] = useState<boolean>(false);

	const [filters, setFilters] = useState<any[]>(initFilter);
	const [condition, setCondition] = useState<any>({});
	const [sort, setSort] = useState<any>();
	const [selectedIds, setSelectedIds] = useState<string[] | undefined>();

	const _getRawData = (): T[] => {
		const data = localStorage.getItem(`vb_local_${key}`);
		return data ? JSON.parse(data) : [];
	};

	const _saveRawData = (data: T[]) => {
		localStorage.setItem(`vb_local_${key}`, JSON.stringify(data));
	};

	// Cập nhật getModel để khớp signature với useInitModel (10 tham số)
	const getModel = async (
		paramCondition?: any,
		filterParams?: any[],
		sortParam?: any,
		paramPage?: number,
		paramLimit?: number,
		path?: string,
		otherQuery?: Record<string, any>,
		isSetDanhSach?: boolean,
		isAbsolutePath?: boolean,
		selectParams?: string[],
	): Promise<T[]> => {
		setLoading(true);
		let data = _getRawData();

		const activeCondition = { ...condition, ...paramCondition };
		if (Object.keys(activeCondition).length > 0) {
			data = data.filter((item) => {
				return Object.keys(activeCondition).every((k) => {
					let searchVal = activeCondition[k];
					if (searchVal === undefined || searchVal === '' || searchVal === null) return true;
					if (typeof searchVal === 'string') searchVal = searchVal.trim();

					return String(item[k] ?? '')
						.toLowerCase()
						.includes(String(searchVal).toLowerCase());
				});
			});
		}

		const currentPage = paramPage || page;
		const currentLimit = paramLimit || limit;

		setTotal(data.length);
		const start = (currentPage - 1) * currentLimit;
		const paginatedData = data.slice(start, start + currentLimit);

		if (isSetDanhSach !== false) setDanhSach(paginatedData);
		setLoading(false);
		return paginatedData;
	};

	const getAllModel = async (): Promise<T[]> => {
		const data = _getRawData();
		setDanhSach(data);
		return data;
	};

	// Cập nhật getByIdModel để khớp signature (2 tham số)
	const getByIdModel = async (id: string | number, isSetRecord?: boolean): Promise<T> => {
		const data = _getRawData();
		const item = data.find((i) => i._id === String(id));
		if (item && isSetRecord !== false) setRecord(item);
		return item as T;
	};

	const postModel = async (payload: T): Promise<T> => {
		setFormSubmiting(true);
		const data = _getRawData();
		const newRecord = { ...payload, _id: Date.now().toString() };
		data.unshift(newRecord);
		_saveRawData(data);
		message.success('Thêm mới thành công (Local)');
		setFormSubmiting(false);
		setVisibleForm(false);
		getModel();
		return newRecord;
	};

	const putModel = async (id: string | number, payload: T): Promise<any> => {
		setFormSubmiting(true);
		let data = _getRawData();
		data = data.map((item) => (item._id === String(id) ? { ...item, ...payload } : item));
		_saveRawData(data);
		message.success('Cập nhật thành công (Local)');
		setFormSubmiting(false);
		setVisibleForm(false);
		getModel();
	};

	const deleteModel = async (id: string | number): Promise<any> => {
		setLoading(true);
		let data = _getRawData();
		data = data.filter((item) => item._id !== String(id));
		_saveRawData(data);
		message.success('Xóa thành công (Local)');
		getModel();
		setLoading(false);
	};

	const handleEdit = (rec?: T) => {
		if (rec) setRecord(rec);
		setEdit(true);
		setIsView(false);
		setVisibleForm(true);
	};

	const handleView = (rec?: T) => {
		if (rec) setRecord(rec);
		setEdit(false);
		setIsView(true);
		setVisibleForm(true);
	};

	return {
		danhSach,
		setDanhSach,
		record,
		setRecord,
		page,
		setPage,
		limit,
		setLimit,
		loading,
		setLoading,
		total,
		setTotal,
		edit,
		setEdit,
		isView,
		setIsView,
		visibleForm,
		setVisibleForm,
		formSubmiting,
		setFormSubmiting,
		filters,
		setFilters,
		condition,
		setCondition,
		sort,
		setSort,
		selectedIds,
		setSelectedIds,
		initFilter,
		getModel,
		getAllModel,
		getByIdModel,
		postModel,
		putModel,
		deleteModel,
		handleEdit,
		handleView,
	};
};

export default useLocalModel;
