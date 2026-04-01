import React, { useState } from 'react';
import { useModel } from 'umi';
import TableStaticData from '@/components/Table/TableStaticData';
import { IColumn } from '@/components/Table/typing';
import { Button, Tooltip, Popconfirm, Tag, Modal, Input, Space, message } from 'antd';
import {
	EditOutlined,
	DeleteOutlined,
	EyeOutlined,
	CheckOutlined,
	CloseOutlined,
	HistoryOutlined,
} from '@ant-design/icons';
import RegistrationForm from './components/RegistrationForm';
import HistoryModal from './components/HistoryModal';

const RegistrationManagementPage: React.FC = () => {
	const { registrations, setRegistrations, clubs } = useModel('clubManagement');
	const [visible, setVisible] = useState(false);
	const [isView, setIsView] = useState(false);
	const [currentRecord, setCurrentRecord] = useState<ClubManagement.Registration | undefined>();
	const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
	const [rejectModalVisible, setRejectModalVisible] = useState(false);
	const [rejectNote, setRejectNote] = useState('');
	const [historyVisible, setHistoryVisible] = useState(false);
	const [historyData, setHistoryData] = useState<ClubManagement.HistoryEntry[]>([]);

	const handleSave = (record: ClubManagement.Registration) => {
		const index = registrations.findIndex((r) => r.id === record.id);
		if (index > -1) {
			const newRegs = [...registrations];
			newRegs[index] = record;
			setRegistrations(newRegs);
		} else {
			setRegistrations([...registrations, record]);
		}
		setVisible(false);
	};

	const handleDelete = (id: string) => {
		setRegistrations(registrations.filter((r) => r.id !== id));
	};

	const updateStatus = (ids: string[], status: 'Approved' | 'Rejected', note?: string) => {
		const newRegs = registrations.map((r) => {
			if (ids.includes(r.id)) {
				const historyEntry: ClubManagement.HistoryEntry = {
					actor: 'Admin',
					action: status,
					time: new Date().toISOString(),
					note,
				};
				return {
					...r,
					status,
					notes: note,
					history: [...(r.history || []), historyEntry],
				};
			}
			return r;
		});
		setRegistrations(newRegs);
		setSelectedRowKeys([]);
		setRejectModalVisible(false);
		setRejectNote('');
		message.success(`Đã ${status === 'Approved' ? 'duyệt' : 'từ chối'} ${ids.length} đơn đăng ký`);
	};

	const columns: IColumn<ClubManagement.Registration>[] = [
		{
			title: 'Họ tên',
			dataIndex: 'fullName',
			width: 180,
			filterType: 'string',
			sortable: true,
		},
		{
			title: 'Email',
			dataIndex: 'email',
			width: 180,
			filterType: 'string',
		},
		{
			title: 'SĐT',
			dataIndex: 'phone',
			width: 120,
		},
		{
			title: 'Câu lạc bộ',
			dataIndex: 'clubId',
			width: 180,
			render: (val) => clubs.find((c) => c.id === val)?.name || 'N/A',
			filterType: 'select',
			filterData: clubs.map((c) => ({ label: c.name, value: c.id })),
		},
		{
			title: 'Trạng thái',
			dataIndex: 'status',
			width: 120,
			align: 'center',
			render: (val) => {
				const colors = { Pending: 'orange', Approved: 'green', Rejected: 'red' };
				const labels = { Pending: 'Chờ duyệt', Approved: 'Đã duyệt', Rejected: 'Từ chối' };
				return <Tag color={colors[val]}>{labels[val]}</Tag>;
			},
			filterType: 'select',
			filterData: [
				{ label: 'Chờ duyệt', value: 'Pending' },
				{ label: 'Đã duyệt', value: 'Approved' },
				{ label: 'Từ chối', value: 'Rejected' },
			],
		},
		{
			title: 'Thao tác',
			width: 220,
			align: 'center',
			fixed: 'right',
			render: (record) => (
				<Space>
					<Tooltip title='Xem chi tiết'>
						<Button
							type='link'
							icon={<EyeOutlined />}
							onClick={() => {
								setCurrentRecord(record);
								setIsView(true);
								setVisible(true);
							}}
						/>
					</Tooltip>
					{record.status === 'Pending' && (
						<>
							<Tooltip title='Duyệt'>
								<Popconfirm title='Duyệt đơn này?' onConfirm={() => updateStatus([record.id], 'Approved')}>
									<Button type='link' icon={<CheckOutlined />} style={{ color: 'green' }} />
								</Popconfirm>
							</Tooltip>
							<Tooltip title='Từ chối'>
								<Button
									type='link'
									danger
									icon={<CloseOutlined />}
									onClick={() => {
										setCurrentRecord(record);
										setRejectModalVisible(true);
									}}
								/>
							</Tooltip>
						</>
					)}
					<Tooltip title='Lịch sử'>
						<Button
							type='link'
							icon={<HistoryOutlined />}
							onClick={() => {
								setHistoryData(record.history || []);
								setHistoryVisible(true);
							}}
						/>
					</Tooltip>
					<Tooltip title='Chỉnh sửa'>
						<Button
							type='link'
							icon={<EditOutlined />}
							onClick={() => {
								setCurrentRecord(record);
								setIsView(false);
								setVisible(true);
							}}
						/>
					</Tooltip>
					<Tooltip title='Xóa'>
						<Popconfirm title='Xóa đơn này?' onConfirm={() => handleDelete(record.id)}>
							<Button type='link' danger icon={<DeleteOutlined />} />
						</Popconfirm>
					</Tooltip>
				</Space>
			),
		},
	];

	return (
		<div style={{ padding: 24 }}>
			<div style={{ marginBottom: 16 }}>
				{selectedRowKeys.length > 0 && (
					<Space>
						<Button
							type='primary'
							icon={<CheckOutlined />}
							onClick={() => updateStatus(selectedRowKeys as string[], 'Approved')}
						>
							Duyệt {selectedRowKeys.length} đơn đã chọn
						</Button>
						<Button danger icon={<CloseOutlined />} onClick={() => setRejectModalVisible(true)}>
							Từ chối {selectedRowKeys.length} đơn đã chọn
						</Button>
					</Space>
				)}
			</div>
			<TableStaticData
				title='Quản lý đơn đăng ký'
				columns={columns}
				data={registrations}
				hasCreate
				showEdit={visible}
				setShowEdit={(val) => {
					setVisible(val);
					if (!val) {
						setCurrentRecord(undefined);
						setIsView(false);
					}
				}}
				Form={RegistrationForm}
				formProps={{
					record: currentRecord,
					onSave: handleSave,
					onCancel: () => setVisible(false),
					isView,
				}}
				otherProps={{
					rowSelection: {
						selectedRowKeys,
						onChange: setSelectedRowKeys,
					},
					rowKey: 'id',
				}}
				addStt
			/>

			<Modal
				title='Lý do từ chối'
				visible={rejectModalVisible}
				onOk={() => {
					if (!rejectNote) {
						message.error('Vui lòng nhập lý do từ chối');
						return;
					}
					const ids = currentRecord ? [currentRecord.id] : (selectedRowKeys as string[]);
					updateStatus(ids, 'Rejected', rejectNote);
					setCurrentRecord(undefined);
				}}
				onCancel={() => {
					setRejectModalVisible(false);
					setRejectNote('');
					setCurrentRecord(undefined);
				}}
			>
				<Input.TextArea
					rows={4}
					placeholder='Nhập lý do từ chối (bắt buộc)...'
					value={rejectNote}
					onChange={(e) => setRejectNote(e.target.value)}
				/>
			</Modal>

			<HistoryModal visible={historyVisible} onCancel={() => setHistoryVisible(false)} history={historyData} />
		</div>
	);
};

export default RegistrationManagementPage;
