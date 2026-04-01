import React, { useState } from 'react';
import { useModel, useHistory } from 'umi';
import TableStaticData from '@/components/Table/TableStaticData';
import { IColumn } from '@/components/Table/typing';
import { Button, Tooltip, Popconfirm, Image, Tag } from 'antd';
import { EditOutlined, DeleteOutlined, TeamOutlined } from '@ant-design/icons';
import moment from 'moment';
import ClubForm from './components/ClubForm';

const ClubManagementPage: React.FC = () => {
	const { clubs, setClubs } = useModel('clubManagement');
	const [visible, setVisible] = useState(false);
	const [currentRecord, setCurrentRecord] = useState<ClubManagement.Club | undefined>();
	const history = useHistory();

	const handleSave = (record: ClubManagement.Club) => {
		const index = clubs.findIndex((c) => c.id === record.id);
		if (index > -1) {
			const newClubs = [...clubs];
			newClubs[index] = record;
			setClubs(newClubs);
		} else {
			setClubs([...clubs, record]);
		}
		setVisible(false);
	};

	const handleDelete = (id: string) => {
		setClubs(clubs.filter((c) => c.id !== id));
	};

	const columns: IColumn<ClubManagement.Club>[] = [
		{
			title: 'Ảnh đại diện',
			dataIndex: 'avatar',
			width: 100,
			align: 'center',
			render: (val) => (
				<Image
					src={val || 'https://via.placeholder.com/50'}
					width={50}
					height={50}
					style={{ objectFit: 'cover', borderRadius: '50%' }}
				/>
			),
		},
		{
			title: 'Tên câu lạc bộ',
			dataIndex: 'name',
			width: 200,
			filterType: 'string',
			sortable: true,
		},
		{
			title: 'Chủ nhiệm',
			dataIndex: 'chairman',
			width: 150,
			filterType: 'string',
		},
		{
			title: 'Ngày thành lập',
			dataIndex: 'foundedDate',
			width: 150,
			align: 'center',
			render: (val) => (val ? moment(val).format('DD/MM/YYYY') : '-'),
			sortable: true,
		},
		{
			title: 'Hoạt động',
			dataIndex: 'isActive',
			width: 120,
			align: 'center',
			render: (val) => (val ? <Tag color='green'>Hoạt động</Tag> : <Tag color='red'>Ngừng hoạt động</Tag>),
			filterType: 'select',
			filterData: [
				{ label: 'Hoạt động', value: true },
				{ label: 'Ngừng hoạt động', value: false },
			],
		},
		{
			title: 'Thao tác',
			width: 150,
			align: 'center',
			fixed: 'right',
			render: (record) => (
				<>
					<Tooltip title='Danh sách thành viên'>
						<Button
							type='link'
							icon={<TeamOutlined />}
							onClick={() => history.push(`/club-members?clubId=${record.id}`)}
						/>
					</Tooltip>
					<Tooltip title='Chỉnh sửa'>
						<Button
							type='link'
							icon={<EditOutlined />}
							onClick={() => {
								setCurrentRecord(record);
								setVisible(true);
							}}
						/>
					</Tooltip>
					<Tooltip title='Xóa'>
						<Popconfirm title='Bạn có chắc chắn muốn xóa CLB này?' onConfirm={() => handleDelete(record.id)}>
							<Button type='link' danger icon={<DeleteOutlined />} />
						</Popconfirm>
					</Tooltip>
				</>
			),
		},
	];

	return (
		<div style={{ padding: 24 }}>
			<TableStaticData
				title='Danh sách câu lạc bộ'
				columns={columns}
				data={clubs}
				hasCreate
				showEdit={visible}
				setShowEdit={(val) => {
					setVisible(val);
					if (!val) setCurrentRecord(undefined);
				}}
				Form={ClubForm}
				formProps={{
					record: currentRecord,
					onSave: handleSave,
					onCancel: () => setVisible(false),
				}}
				addStt
			/>
		</div>
	);
};

export default ClubManagementPage;
