import React, { useState, useEffect } from 'react';
import { useModel, useLocation } from 'umi';
import TableStaticData from '@/components/Table/TableStaticData';
import { IColumn } from '@/components/Table/typing';
import { Button, Space, Modal, Select, message, Tag } from 'antd';
import { SwapOutlined } from '@ant-design/icons';

const MemberManagementPage: React.FC = () => {
	const { registrations, setRegistrations, clubs } = useModel('clubManagement');
	const location = useLocation();
	const queryParams = new URLSearchParams(location.search);
	const initialClubId = queryParams.get('clubId');

	const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
	const [moveModalVisible, setMoveModalVisible] = useState(false);
	const [targetClubId, setTargetClubId] = useState<string | undefined>();

	// Filter only Approved members
	const approvedMembers = registrations.filter((r) => r.status === 'Approved');

	const handleMoveMembers = () => {
		if (!targetClubId) {
			message.error('Vui lòng chọn câu lạc bộ muốn chuyển đến');
			return;
		}

		const newRegs = registrations.map((r) => {
			if (selectedRowKeys.includes(r.id)) {
				const historyEntry: ClubManagement.HistoryEntry = {
					actor: 'Admin',
					action: 'Moved',
					time: new Date().toISOString(),
					note: `Chuyển từ CLB ${clubs.find((c) => c.id === r.clubId)?.name} sang ${
						clubs.find((c) => c.id === targetClubId)?.name
					}`,
				};
				return {
					...r,
					clubId: targetClubId,
					history: [...(r.history || []), historyEntry],
				};
			}
			return r;
		});

		setRegistrations(newRegs);
		setSelectedRowKeys([]);
		setMoveModalVisible(false);
		setTargetClubId(undefined);
		message.success(`Đã chuyển ${selectedRowKeys.length} thành viên sang câu lạc bộ mới`);
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
		},
		{
			title: 'SĐT',
			dataIndex: 'phone',
			width: 120,
		},
		{
			title: 'Câu lạc bộ hiện tại',
			dataIndex: 'clubId',
			width: 200,
			render: (val) => <Tag color='blue'>{clubs.find((c) => c.id === val)?.name || 'N/A'}</Tag>,
			filterType: 'select',
			filterData: clubs.map((c) => ({ label: c.name, value: c.id })),
			defaultFilteredValue: initialClubId ? [initialClubId] : undefined,
		},
		{
			title: 'Sở trường',
			dataIndex: 'strengths',
			width: 150,
		},
	];

	return (
		<div style={{ padding: 24 }}>
			<div style={{ marginBottom: 16 }}>
				{selectedRowKeys.length > 0 && (
					<Button type='primary' icon={<SwapOutlined />} onClick={() => setMoveModalVisible(true)}>
						Chuyển CLB cho {selectedRowKeys.length} thành viên đã chọn
					</Button>
				)}
			</div>
			<TableStaticData
				title='Quản lý thành viên câu lạc bộ'
				columns={columns}
				data={approvedMembers}
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
				title={`Chuyển CLB cho ${selectedRowKeys.length} thành viên`}
				visible={moveModalVisible}
				onOk={handleMoveMembers}
				onCancel={() => {
					setMoveModalVisible(false);
					setTargetClubId(undefined);
				}}
			>
				<p>Chọn câu lạc bộ muốn chuyển đến:</p>
				<Select style={{ width: '100%' }} placeholder='Chọn câu lạc bộ' value={targetClubId} onChange={setTargetClubId}>
					{clubs.map((club) => (
						<Select.Option key={club.id} value={club.id}>
							{club.name}
						</Select.Option>
					))}
				</Select>
			</Modal>
		</div>
	);
};

export default MemberManagementPage;
