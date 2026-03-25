import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Tag, Tooltip } from 'antd';
import { useModel } from 'umi';
import Form from './components/Form';

const CauHinhPage = () => {
	const { getModel, page, limit, deleteModel, handleEdit } = useModel('vanbang.cauhinh');

	const columns: IColumn<VanBang.ICauHinh>[] = [
		{
			title: 'Mã trường',
			dataIndex: 'ma',
			width: 150,
			filterType: 'string',
		},
		{
			title: 'Tên trường thông tin',
			dataIndex: 'ten',
			width: 250,
			filterType: 'string',
		},
		{
			title: 'Kiểu dữ liệu',
			dataIndex: 'kieuDuLieu',
			width: 120,
			align: 'center',
			render: (val) => {
				const color = val === 'String' ? 'blue' : val === 'Number' ? 'green' : 'orange';
				return <Tag color={color}>{val}</Tag>;
			},
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 90,
			fixed: 'right',
			render: (record: VanBang.ICauHinh) => (
				<>
					<Tooltip title='Chỉnh sửa'>
						<Button onClick={() => handleEdit(record)} type='link' icon={<EditOutlined />} />
					</Tooltip>
					<Tooltip title='Xóa'>
						<Popconfirm
							onConfirm={() => deleteModel(record._id, getModel)}
							title='Bạn có chắc chắn muốn xóa trường thông tin này?'
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
			modelName='vanbang.cauhinh'
			title='Cấu hình biểu mẫu phụ lục'
			Form={Form}
		/>
	);
};

export default CauHinhPage;
