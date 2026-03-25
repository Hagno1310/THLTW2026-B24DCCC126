import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Tooltip } from 'antd';
import moment from 'moment';
import { useModel } from 'umi';
import Form from './components/Form';

const QuyetDinhPage = () => {
	const { getModel, page, limit, deleteModel, handleEdit } = useModel('vanbang.quyetdinh');

	const columns: IColumn<VanBang.IQuyetDinh>[] = [
		{
			title: 'Số QĐ',
			dataIndex: 'soQD',
			width: 150,
			filterType: 'string',
		},
		{
			title: 'Ngày ban hành',
			dataIndex: 'ngayBanHanh',
			width: 120,
			align: 'center',
			render: (val) => moment(val).format('DD/MM/YYYY'),
		},
		{
			title: 'Trích yếu',
			dataIndex: 'trichYeu',
			width: 300,
			filterType: 'string',
		},
		{
			title: 'Số lượt tra cứu',
			dataIndex: 'soLuotTraCuu',
			width: 120,
			align: 'center',
			render: (val) => val || 0,
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 90,
			fixed: 'right',
			render: (record: VanBang.IQuyetDinh) => (
				<>
					<Tooltip title='Chỉnh sửa'>
						<Button onClick={() => handleEdit(record)} type='link' icon={<EditOutlined />} />
					</Tooltip>
					<Tooltip title='Xóa'>
						<Popconfirm
							onConfirm={() => deleteModel(record._id, getModel)}
							title='Bạn có chắc chắn muốn xóa quyết định này?'
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
			modelName='vanbang.quyetdinh'
			title='Quyết định tốt nghiệp'
			Form={Form}
		/>
	);
};

export default QuyetDinhPage;
