import React, { useState } from 'react';
import {
	Table,
	Button,
	Modal,
	Form,
	Input,
	InputNumber,
	DatePicker,
	Select,
	Space,
	Popconfirm,
	message,
	Tag,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import moment from 'moment';

interface Subject {
	id: string;
	name: string;
}

interface StudyLog {
	id: string;
	subjectId: string;
	dateTime: string;
	duration: number;
	content: string;
	note?: string;
}

interface Props {
	logs: StudyLog[];
	setLogs: (logs: StudyLog[]) => void;
	subjects: Subject[];
}

const StudyLogTable: React.FC<Props> = ({ logs, setLogs, subjects }) => {
	const [visible, setVisible] = useState(false);
	const [editingLog, setEditingLog] = useState<StudyLog | null>(null);
	const [form] = Form.useForm();

	const handleOpenModal = (log?: StudyLog) => {
		if (log) {
			setEditingLog(log);
			form.setFieldsValue({
				...log,
				dateTime: moment(log.dateTime),
			});
		} else {
			setEditingLog(null);
			form.resetFields();
		}
		setVisible(true);
	};

	const handleSubmit = () => {
		form.validateFields().then((values) => {
			const logData = {
				...values,
				dateTime: values.dateTime.toISOString(),
			};

			if (editingLog) {
				setLogs(logs.map((l) => (l.id === editingLog.id ? { ...logData, id: l.id } : l)));
				message.success('Cập nhật lịch học thành công');
			} else {
				setLogs([...logs, { ...logData, id: Date.now().toString() }]);
				message.success('Thêm lịch học thành công');
			}
			setVisible(false);
		});
	};

	const handleDelete = (id: string) => {
		setLogs(logs.filter((l) => l.id !== id));
		message.success('Xóa lịch học thành công');
	};

	const columns = [
		{
			title: 'Ngày giờ',
			dataIndex: 'dateTime',
			key: 'dateTime',
			align: 'center' as const,
			render: (text: string) => moment(text).format('DD/MM/YYYY HH:mm'),
			sorter: (a: StudyLog, b: StudyLog) => moment(a.dateTime).unix() - moment(b.dateTime).unix(),
		},
		{
			title: 'Môn học',
			dataIndex: 'subjectId',
			key: 'subjectId',
			align: 'center' as const,
			render: (id: string) => {
				const subject = subjects.find((s) => s.id === id);
				return <Tag color='blue'>{subject ? subject.name : 'N/A'}</Tag>;
			},
		},
		{
			title: 'Thời lượng (phút)',
			dataIndex: 'duration',
			key: 'duration',
			align: 'right' as const,
			render: (val: number) => `${val} phút`,
		},
		{
			title: 'Nội dung',
			dataIndex: 'content',
			key: 'content',
			ellipsis: true,
		},
		{
			title: 'Hành động',
			key: 'action',
			align: 'center' as const,
			render: (_: any, record: StudyLog) => (
				<Space size='middle'>
					<Button icon={<EditOutlined />} onClick={() => handleOpenModal(record)} type='link' />
					<Popconfirm title='Xóa lịch học này?' onConfirm={() => handleDelete(record.id)}>
						<Button icon={<DeleteOutlined />} type='link' danger />
					</Popconfirm>
				</Space>
			),
		},
	];

	return (
		<div className='study-log'>
			<div style={{ marginBottom: 16 }}>
				<Button
					type='primary'
					icon={<PlusOutlined />}
					onClick={() => handleOpenModal()}
					disabled={subjects.length === 0}
				>
					Thêm buổi học
				</Button>
			</div>

			<Table dataSource={logs} columns={columns} rowKey='id' pagination={{ pageSize: 10 }} bordered size='middle' />

			<Modal
				title={editingLog ? 'Sửa lịch học' : 'Thêm buổi học mới'}
				visible={visible}
				onOk={handleSubmit}
				onCancel={() => setVisible(false)}
				width={600}
				destroyOnClose
			>
				<Form form={form} layout='vertical' className='log-form'>
					<Form.Item name='subjectId' label='Môn học' rules={[{ required: true, message: 'Chọn môn học' }]}>
						<Select placeholder='Chọn môn học'>
							{subjects.map((s) => (
								<Select.Option key={s.id} value={s.id}>
									{s.name}
								</Select.Option>
							))}
						</Select>
					</Form.Item>

					<Space style={{ display: 'flex' }} align='baseline'>
						<Form.Item name='dateTime' label='Ngày giờ học' rules={[{ required: true, message: 'Chọn ngày giờ' }]}>
							<DatePicker showTime format='DD/MM/YYYY HH:mm' />
						</Form.Item>
						<Form.Item
							name='duration'
							label='Thời lượng (phút)'
							rules={[{ required: true, message: 'Nhập thời lượng' }]}
						>
							<InputNumber min={1} style={{ width: '100%' }} />
						</Form.Item>
					</Space>

					<Form.Item name='content' label='Nội dung đã học' rules={[{ required: true, message: 'Nhập nội dung' }]}>
						<Input.TextArea rows={3} placeholder='Mô tả nội dung bài học...' />
					</Form.Item>

					<Form.Item name='note' label='Ghi chú'>
						<Input placeholder='Ghi chú thêm nếu có...' />
					</Form.Item>
				</Form>
			</Modal>
		</div>
	);
};

export default StudyLogTable;
