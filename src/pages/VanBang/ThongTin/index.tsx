import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Tooltip } from 'antd';
import moment from 'moment';
import { useModel } from 'umi';
import Form from './components/Form';

const ThongTinVanBangPage = () => {
	const { getModel, page, limit, deleteModel, handleEdit, handleView } = useModel('vanbang.thongtin');

	const columns: IColumn<VanBang.IThongTinVanBang>[] = [
		{
			title: 'Số vào sổ',
			dataIndex: 'soVaoSo',
			width: 100,
			align: 'center',
			filterType: 'string',
		},
		{
			title: 'Số hiệu văn bằng',
			dataIndex: 'soHieuVanBang',
			width: 150,
			filterType: 'string',
		},
		{
			title: 'MSV',
			dataIndex: 'maSV',
			width: 100,
			filterType: 'string',
		},
		{
			title: 'Họ và tên',
			dataIndex: 'hoTen',
			width: 200,
			filterType: 'string',
		},
		{
			title: 'Ngày sinh',
			dataIndex: 'ngaySinh',
			width: 120,
			align: 'center',
			render: (val) => moment(val).format('DD/MM/YYYY'),
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 120,
			fixed: 'right',
			render: (record: VanBang.IThongTinVanBang) => (
				<>
					<Tooltip title='Xem chi tiết'>
						<Button onClick={() => handleView(record)} type='link' icon={<EyeOutlined />} />
					</Tooltip>
					<Tooltip title='Chỉnh sửa'>
						<Button onClick={() => handleEdit(record)} type='link' icon={<EditOutlined />} />
					</Tooltip>
					<Tooltip title='Xóa'>
						<Popconfirm
							onConfirm={() => deleteModel(record._id, getModel)}
							title='Bạn có chắc chắn muốn xóa văn bằng này?'
							placement='topLeft'
						>
							<Button danger type='link' icon={<DeleteOutlined />} />
						</Popconfirm>
					</Tooltip>
				</>
			),
		},
	];

	return (
		<TableBase
			columns={columns}
			dependencies={[page, limit]}
			modelName='vanbang.thongtin'
			title='Thông tin văn bằng'
			Form={Form}
		/>
	);
};

export default ThongTinVanBangPage;
