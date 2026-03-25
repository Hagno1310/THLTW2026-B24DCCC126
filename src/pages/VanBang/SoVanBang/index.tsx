import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Tooltip } from 'antd';
import { useModel } from 'umi';
import Form from './components/Form';

const SoVanBangPage = () => {
	const { getModel, page, limit, deleteModel, handleEdit } = useModel('vanbang.sovanbang');

	const columns: IColumn<VanBang.ISoVanBang>[] = [
		{
			title: 'Năm',
			dataIndex: 'nam',
			width: 100,
			align: 'center',
			filterType: 'string',
		},
		{
			title: 'Tên sổ',
			dataIndex: 'ten',
			width: 250,
			filterType: 'string',
		},
		{
			title: 'Số vào sổ hiện tại',
			dataIndex: 'soVaoSoHienTai',
			width: 150,
			align: 'center',
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 90,
			fixed: 'right',
			render: (record: VanBang.ISoVanBang) => (
				<>
					<Tooltip title='Chỉnh sửa'>
						<Button onClick={() => handleEdit(record)} type='link' icon={<EditOutlined />} />
					</Tooltip>
					<Tooltip title='Xóa'>
						<Popconfirm
							onConfirm={() => deleteModel(record._id, getModel)}
							title='Bạn có chắc chắn muốn xóa sổ này?'
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
			modelName='vanbang.sovanbang'
			title='Quản lý Sổ văn bằng'
			Form={Form}
		/>
	);
};

export default SoVanBangPage;
