import React from 'react';
import { Modal, Table, Tag } from 'antd';
import moment from 'moment';

interface HistoryModalProps {
	visible: boolean;
	onCancel: () => void;
	history?: ClubManagement.HistoryEntry[];
}

const HistoryModal: React.FC<HistoryModalProps> = ({ visible, onCancel, history }) => {
	const columns = [
		{
			title: 'Người thực hiện',
			dataIndex: 'actor',
			key: 'actor',
		},
		{
			title: 'Thao tác',
			dataIndex: 'action',
			key: 'action',
			render: (val: string) => {
				const colors = {
					Created: 'blue',
					Updated: 'orange',
					Approved: 'green',
					Rejected: 'red',
					Moved: 'purple',
				};
				return <Tag color={colors[val] || 'default'}>{val}</Tag>;
			},
		},
		{
			title: 'Thời gian',
			dataIndex: 'time',
			key: 'time',
			render: (val: string) => moment(val).format('HH:mm DD/MM/YYYY'),
		},
		{
			title: 'Ghi chú',
			dataIndex: 'note',
			key: 'note',
		},
	];

	return (
		<Modal title='Lịch sử thao tác' visible={visible} onCancel={onCancel} footer={null} width={700}>
			<Table
				dataSource={history || []}
				columns={columns}
				rowKey={(record) => record.time}
				pagination={{ pageSize: 5 }}
			/>
		</Modal>
	);
};

export default HistoryModal;
