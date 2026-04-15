import React, { useState, useMemo } from 'react';
import {
	Table,
	Button,
	Input,
	Select,
	Modal,
	Form,
	InputNumber,
	Popconfirm,
	Space,
	Card,
	Row,
	Col,
	Typography,
	message,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { Option } = Select;

// ======== Enums & Types ========

enum RoomType {
	Theory = 'Theory',
	Practice = 'Practice',
	Auditorium = 'Auditorium',
}

interface Classroom {
	roomId: string;
	roomName: string;
	capacity: number;
	roomType: RoomType;
	personInCharge: string;
}

// ======== Mock Data ========

const MOCK_TEACHERS = ['Nguyen Van A', 'Tran Thi B', 'Le Van C', 'Pham Thi D', 'Hoang Van E'];

const INITIAL_CLASSROOMS: Classroom[] = [
	{ roomId: 'R001', roomName: 'Room 101', capacity: 40, roomType: RoomType.Theory, personInCharge: 'Nguyen Van A' },
	{ roomId: 'R002', roomName: 'Lab A1', capacity: 25, roomType: RoomType.Practice, personInCharge: 'Tran Thi B' },
	{ roomId: 'R003', roomName: 'Hall 01', capacity: 150, roomType: RoomType.Auditorium, personInCharge: 'Le Van C' },
	{ roomId: 'R004', roomName: 'Room 202', capacity: 35, roomType: RoomType.Theory, personInCharge: 'Pham Thi D' },
	{ roomId: 'R005', roomName: 'Lab B2', capacity: 20, roomType: RoomType.Practice, personInCharge: 'Hoang Van E' },
	{ roomId: 'R006', roomName: 'Room 303', capacity: 50, roomType: RoomType.Theory, personInCharge: 'Nguyen Van A' },
	{ roomId: 'R007', roomName: 'Small Room', capacity: 15, roomType: RoomType.Theory, personInCharge: 'Tran Thi B' },
];

// ======== Component ========

const ClassroomManagement: React.FC = () => {
	const [classrooms, setClassrooms] = useState<Classroom[]>(INITIAL_CLASSROOMS);
	const [modalVisible, setModalVisible] = useState(false);
	const [editingRecord, setEditingRecord] = useState<Classroom | null>(null);
	const [form] = Form.useForm();

	// Search & Filter state
	const [searchRoomId, setSearchRoomId] = useState('');
	const [searchRoomName, setSearchRoomName] = useState('');
	const [filterRoomType, setFilterRoomType] = useState<string | undefined>(undefined);
	const [filterPerson, setFilterPerson] = useState<string | undefined>(undefined);

	// Filtered data
	const filteredData = useMemo(() => {
		return classrooms.filter((item) => {
			const matchId = item.roomId.toLowerCase().includes(searchRoomId.toLowerCase());
			const matchName = item.roomName.toLowerCase().includes(searchRoomName.toLowerCase());
			const matchType = !filterRoomType || item.roomType === filterRoomType;
			const matchPerson = !filterPerson || item.personInCharge === filterPerson;
			return matchId && matchName && matchType && matchPerson;
		});
	}, [classrooms, searchRoomId, searchRoomName, filterRoomType, filterPerson]);

	// Open modal for Add
	const handleAdd = () => {
		setEditingRecord(null);
		form.resetFields();
		setModalVisible(true);
	};

	// Open modal for Edit
	const handleEdit = (record: Classroom) => {
		setEditingRecord(record);
		form.setFieldsValue(record);
		setModalVisible(true);
	};

	// Delete
	const handleDelete = (roomId: string) => {
		setClassrooms((prev) => prev.filter((item) => item.roomId !== roomId));
		message.success('Deleted successfully');
	};

	// Submit form (Add or Edit)
	const handleSubmit = async () => {
		try {
			const values = await form.validateFields();
			if (editingRecord) {
				// Edit
				setClassrooms((prev) =>
					prev.map((item) => (item.roomId === editingRecord.roomId ? { ...item, ...values } : item)),
				);
				message.success('Updated successfully');
			} else {
				// Add
				setClassrooms((prev) => [...prev, values]);
				message.success('Added successfully');
			}
			setModalVisible(false);
			form.resetFields();
		} catch {
			// validation failed
		}
	};

	// Table columns
	const columns = [
		{
			title: 'Room ID',
			dataIndex: 'roomId',
			key: 'roomId',
		},
		{
			title: 'Room Name',
			dataIndex: 'roomName',
			key: 'roomName',
		},
		{
			title: 'Capacity',
			dataIndex: 'capacity',
			key: 'capacity',
			sorter: (a: Classroom, b: Classroom) => a.capacity - b.capacity,
		},
		{
			title: 'Room Type',
			dataIndex: 'roomType',
			key: 'roomType',
		},
		{
			title: 'Person in Charge',
			dataIndex: 'personInCharge',
			key: 'personInCharge',
		},
		{
			title: 'Actions',
			key: 'actions',
			render: (_: any, record: Classroom) => (
				<Space>
					<Button type='link' icon={<EditOutlined />} onClick={() => handleEdit(record)}>
						Edit
					</Button>
					{record.capacity < 30 ? (
						<Popconfirm
							title='Are you sure you want to delete this classroom?'
							onConfirm={() => handleDelete(record.roomId)}
							okText='Yes'
							cancelText='No'
						>
							<Button type='link' danger icon={<DeleteOutlined />}>
								Delete
							</Button>
						</Popconfirm>
					) : (
						<Button type='link' danger icon={<DeleteOutlined />} disabled>
							Delete
						</Button>
					)}
				</Space>
			),
		},
	];

	return (
		<div style={{ padding: 24 }}>
			<Title level={3}>Classroom Management</Title>

			{/* Search & Filter Bar */}
			<Card style={{ marginBottom: 16 }}>
				<Row gutter={[16, 16]} align='middle'>
					<Col xs={24} sm={12} md={6}>
						<Input
							placeholder='Search by Room ID'
							prefix={<SearchOutlined />}
							value={searchRoomId}
							onChange={(e) => setSearchRoomId(e.target.value)}
							allowClear
						/>
					</Col>
					<Col xs={24} sm={12} md={6}>
						<Input
							placeholder='Search by Room Name'
							prefix={<SearchOutlined />}
							value={searchRoomName}
							onChange={(e) => setSearchRoomName(e.target.value)}
							allowClear
						/>
					</Col>
					<Col xs={24} sm={12} md={5}>
						<Select
							placeholder='Filter by Room Type'
							value={filterRoomType}
							onChange={(val) => setFilterRoomType(val)}
							allowClear
							style={{ width: '100%' }}
						>
							{Object.values(RoomType).map((type) => (
								<Option key={type} value={type}>
									{type}
								</Option>
							))}
						</Select>
					</Col>
					<Col xs={24} sm={12} md={5}>
						<Select
							placeholder='Filter by Person in Charge'
							value={filterPerson}
							onChange={(val) => setFilterPerson(val)}
							allowClear
							style={{ width: '100%' }}
						>
							{MOCK_TEACHERS.map((t) => (
								<Option key={t} value={t}>
									{t}
								</Option>
							))}
						</Select>
					</Col>
					<Col xs={24} sm={24} md={2}>
						<Button type='primary' icon={<PlusOutlined />} onClick={handleAdd}>
							Add
						</Button>
					</Col>
				</Row>
			</Card>

			{/* Data Table */}
			<Table columns={columns} dataSource={filteredData} rowKey='roomId' bordered pagination={{ pageSize: 5 }} />

			{/* Add/Edit Modal */}
			<Modal
				title={editingRecord ? 'Edit Classroom' : 'Add Classroom'}
				visible={modalVisible}
				onOk={handleSubmit}
				onCancel={() => {
					setModalVisible(false);
					form.resetFields();
				}}
				okText={editingRecord ? 'Update' : 'Add'}
				destroyOnClose
			>
				<Form form={form} layout='vertical'>
					<Form.Item
						label='Room ID'
						name='roomId'
						rules={[
							{ required: true, message: 'Room ID is required' },
							{ max: 10, message: 'Room ID must be at most 10 characters' },
							{
								validator: (_, value) => {
									if (!value) return Promise.resolve();
									const isDuplicate = classrooms.some((c) => c.roomId === value && c.roomId !== editingRecord?.roomId);
									return isDuplicate ? Promise.reject(new Error('Room ID already exists')) : Promise.resolve();
								},
							},
						]}
					>
						<Input maxLength={10} disabled={!!editingRecord} placeholder='Enter Room ID' />
					</Form.Item>

					<Form.Item
						label='Room Name'
						name='roomName'
						rules={[
							{ required: true, message: 'Room Name is required' },
							{ max: 50, message: 'Room Name must be at most 50 characters' },
							{
								validator: (_, value) => {
									if (!value) return Promise.resolve();
									const isDuplicate = classrooms.some(
										(c) => c.roomName === value && c.roomId !== editingRecord?.roomId,
									);
									return isDuplicate ? Promise.reject(new Error('Room Name already exists')) : Promise.resolve();
								},
							},
						]}
					>
						<Input maxLength={50} placeholder='Enter Room Name' />
					</Form.Item>

					<Form.Item
						label='Capacity'
						name='capacity'
						rules={[
							{ required: true, message: 'Capacity is required' },
							{ type: 'number', min: 10, message: 'Capacity must be at least 10' },
							{ type: 'number', max: 200, message: 'Capacity must be at most 200' },
						]}
					>
						<InputNumber min={10} max={200} style={{ width: '100%' }} placeholder='Enter Capacity' />
					</Form.Item>

					<Form.Item label='Room Type' name='roomType' rules={[{ required: true, message: 'Room Type is required' }]}>
						<Select placeholder='Select Room Type'>
							{Object.values(RoomType).map((type) => (
								<Option key={type} value={type}>
									{type}
								</Option>
							))}
						</Select>
					</Form.Item>

					<Form.Item
						label='Person in Charge'
						name='personInCharge'
						rules={[{ required: true, message: 'Person in Charge is required' }]}
					>
						<Select placeholder='Select Person in Charge'>
							{MOCK_TEACHERS.map((t) => (
								<Option key={t} value={t}>
									{t}
								</Option>
							))}
						</Select>
					</Form.Item>
				</Form>
			</Modal>
		</div>
	);
};

export default ClassroomManagement;
