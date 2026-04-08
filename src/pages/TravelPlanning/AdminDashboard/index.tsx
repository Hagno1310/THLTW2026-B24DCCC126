import ColumnChart from '@/components/Chart/ColumnChart';
import DonutChart from '@/components/Chart/DonutChart';
import { TravelData } from '@/services/TravelPlanning/data';
import {
	CoffeeOutlined,
	CompassOutlined,
	DeleteOutlined,
	DollarOutlined,
	EditOutlined,
	EnvironmentOutlined,
	FileImageOutlined,
	HomeOutlined,
	PictureOutlined,
	PlusOutlined,
	SettingOutlined,
	StarOutlined,
} from '@ant-design/icons';
import {
	Button,
	Card,
	Col,
	Divider,
	Form,
	Image,
	Input,
	InputNumber,
	message,
	Modal,
	Popconfirm,
	Rate,
	Row,
	Select,
	Space,
	Statistic,
	Table,
	Tabs,
	Tag,
} from 'antd';
import { useEffect, useMemo, useState } from 'react';
import './index.less';

const { TabPane } = Tabs;
const { Option } = Select;

const formatVND = (val: number) => new Intl.NumberFormat('vi-VN').format(val) + 'đ';

const typeLabels: Record<string, string> = { beach: 'Biển', mountain: 'Núi', city: 'Thành phố' };
const typeColors: Record<string, string> = { beach: 'blue', mountain: 'green', city: 'orange' };

const AdminDashboard: React.FC = () => {
	const [destinations, setDestinations] = useState<TravelPlanning.Destination[]>([]);
	const [itineraries, setItineraries] = useState<TravelPlanning.Itinerary[]>([]);
	const [modalVisible, setModalVisible] = useState(false);
	const [editingDest, setEditingDest] = useState<TravelPlanning.Destination | null>(null);
	const [imagePreview, setImagePreview] = useState<string>('');
	const [form] = Form.useForm();

	useEffect(() => {
		setDestinations(TravelData.getDestinations());
		setItineraries(TravelData.getItineraries());
	}, []);

	const handleDelete = (id: string) => {
		const newDests = destinations.filter((d) => d.id !== id);
		setDestinations(newDests);
		TravelData.saveDestinations(newDests);
		message.success('Đã xóa điểm đến!');
	};

	const handleOpenModal = (dest?: TravelPlanning.Destination) => {
		if (dest) {
			setEditingDest(dest);
			setImagePreview(dest.image);
			form.setFieldsValue({
				...dest,
				costDining: dest.cost.dining,
				costAccommodation: dest.cost.accommodation,
				costTransport: dest.cost.transport,
			});
		} else {
			setEditingDest(null);
			setImagePreview('');
			form.resetFields();
		}
		setModalVisible(true);
	};

	const handleOk = () => {
		form.validateFields().then((values) => {
			const dest: TravelPlanning.Destination = {
				id: editingDest ? editingDest.id : Date.now().toString(),
				name: values.name,
				description: values.description,
				image: values.image,
				location: values.location,
				type: values.type,
				rating: values.rating,
				visitDuration: values.visitDuration,
				cost: {
					dining: values.costDining,
					accommodation: values.costAccommodation,
					transport: values.costTransport,
				},
			};

			let newDests: TravelPlanning.Destination[];
			if (editingDest) {
				newDests = destinations.map((d) => (d.id === editingDest.id ? dest : d));
				message.success('Đã cập nhật điểm đến!');
			} else {
				newDests = [...destinations, dest];
				message.success('Đã thêm điểm đến mới!');
			}

			setDestinations(newDests);
			TravelData.saveDestinations(newDests);
			setModalVisible(false);
			form.resetFields();
			setEditingDest(null);
		});
	};

	// Stats
	const monthlyStats = useMemo(() => TravelData.getMonthlyStats(), [itineraries]);
	const popularDests = useMemo(() => TravelData.getPopularDestinations().slice(0, 6), [itineraries, destinations]);
	const categoryRevenue = useMemo(() => TravelData.getCategoryRevenue(), [itineraries]);

	const columns = [
		{ title: 'Tên', dataIndex: 'name', key: 'name', width: 150 },
		{ title: 'Vị trí', dataIndex: 'location', key: 'location', width: 120 },
		{
			title: 'Loại',
			dataIndex: 'type',
			key: 'type',
			width: 100,
			render: (type: string) => <Tag color={typeColors[type]}>{typeLabels[type]}</Tag>,
		},
		{
			title: 'Đánh giá',
			dataIndex: 'rating',
			key: 'rating',
			width: 150,
			render: (val: number) => <Rate disabled value={val} style={{ fontSize: 14 }} />,
		},
		{
			title: 'Tổng chi phí',
			key: 'cost',
			width: 130,
			render: (_: any, record: TravelPlanning.Destination) =>
				formatVND(record.cost.dining + record.cost.accommodation + record.cost.transport),
		},
		{
			title: 'Thao tác',
			key: 'actions',
			width: 120,
			render: (_: any, record: TravelPlanning.Destination) => (
				<Space>
					<Button type='link' icon={<EditOutlined />} onClick={() => handleOpenModal(record)} />
					<Popconfirm title='Xác nhận xóa?' onConfirm={() => handleDelete(record.id)}>
						<Button type='link' danger icon={<DeleteOutlined />} />
					</Popconfirm>
				</Space>
			),
		},
	];

	return (
		<div className='admin-container'>
			<div className='header-section'>
				<h2>
					<SettingOutlined /> Quản trị hệ thống
				</h2>
			</div>

			<Tabs defaultActiveKey='crud' type='card'>
				<TabPane tab='Quản lý điểm đến' key='crud'>
					<Button type='primary' icon={<PlusOutlined />} onClick={() => handleOpenModal()} style={{ marginBottom: 16 }}>
						Thêm điểm đến
					</Button>

					<Table
						dataSource={destinations}
						columns={columns}
						rowKey='id'
						scroll={{ x: 800 }}
						pagination={{ pageSize: 10 }}
					/>
				</TabPane>

				<TabPane tab='Thống kê' key='stats'>
					<Row gutter={16} className='stat-cards'>
						<Col xs={12} sm={6}>
							<Card>
								<Statistic title='Tổng điểm đến' value={destinations.length} />
							</Card>
						</Col>
						<Col xs={12} sm={6}>
							<Card>
								<Statistic title='Tổng lịch trình' value={itineraries.length} />
							</Card>
						</Col>
						<Col xs={12} sm={6}>
							<Card>
								<Statistic
									title='Biển / Núi / TP'
									value={`${destinations.filter((d) => d.type === 'beach').length} / ${
										destinations.filter((d) => d.type === 'mountain').length
									} / ${destinations.filter((d) => d.type === 'city').length}`}
								/>
							</Card>
						</Col>
						<Col xs={12} sm={6}>
							<Card>
								<Statistic
									title='Tổng chi phí ước tính'
									value={categoryRevenue.dining + categoryRevenue.accommodation + categoryRevenue.transport}
									formatter={(val) => formatVND(val as number)}
								/>
							</Card>
						</Col>
					</Row>

					<Row gutter={16} className='chart-row'>
						<Col xs={24} lg={12}>
							<Card title='Lịch trình theo tháng'>
								<ColumnChart
									xAxis={monthlyStats.map((s) => s.month)}
									yAxis={[monthlyStats.map((s) => s.count)]}
									yLabel={['Số lịch trình']}
									height={300}
									formatY={(val) => val.toString()}
								/>
							</Card>
						</Col>
						<Col xs={24} lg={12}>
							<Card title='Điểm đến phổ biến'>
								<ColumnChart
									xAxis={popularDests.map((d) => d.name)}
									yAxis={[popularDests.map((d) => d.usageCount)]}
									yLabel={['Số lần sử dụng']}
									height={300}
									colors={['#52c41a']}
									formatY={(val) => val.toString()}
								/>
							</Card>
						</Col>
					</Row>

					<Row gutter={16}>
						<Col xs={24} lg={12}>
							<Card title='Phân bổ chi phí theo hạng mục'>
								<DonutChart
									xAxis={['Ăn uống', 'Lưu trú', 'Di chuyển']}
									yAxis={[[categoryRevenue.dining, categoryRevenue.accommodation, categoryRevenue.transport]]}
									yLabel={['Chi phí']}
									height={300}
									colors={['#1890ff', '#52c41a', '#faad14']}
									showTotal
									formatY={formatVND}
								/>
							</Card>
						</Col>
					</Row>
				</TabPane>
			</Tabs>

			<Modal
				title={
					<span>
						{editingDest ? <EditOutlined /> : <PlusOutlined />}{' '}
						{editingDest ? 'Chỉnh sửa điểm đến' : 'Thêm điểm đến mới'}
					</span>
				}
				visible={modalVisible}
				onOk={handleOk}
				onCancel={() => {
					setModalVisible(false);
					form.resetFields();
					setEditingDest(null);
					setImagePreview('');
				}}
				okText={editingDest ? 'Cập nhật' : 'Thêm'}
				cancelText='Hủy'
				width={720}
				className='dest-modal'
				bodyStyle={{ padding: '16px 24px' }}
			>
				<Form form={form} layout='vertical' size='middle'>
					<Row gutter={24}>
						{/* Left: Image preview */}
						<Col span={8}>
							<div className='modal-image-preview'>
								{imagePreview ? (
									<Image
										src={imagePreview}
										alt='Preview'
										style={{ width: '100%', height: 180, objectFit: 'cover', borderRadius: 8 }}
										fallback='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE4MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE4MCIgZmlsbD0iI2YwZjBmMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjYmZiZmJmIiBmb250LXNpemU9IjE0Ij5ObyBJbWFnZTwvdGV4dD48L3N2Zz4='
									/>
								) : (
									<div className='modal-image-placeholder'>
										<PictureOutlined style={{ fontSize: 40, color: '#d9d9d9' }} />
										<div style={{ color: '#bfbfbf', marginTop: 8 }}>Xem trước hình ảnh</div>
									</div>
								)}
							</div>
							<Form.Item name='image' rules={[{ required: true, message: 'Nhập URL!' }]} style={{ marginTop: 12 }}>
								<Input
									prefix={<FileImageOutlined style={{ color: '#bfbfbf' }} />}
									placeholder='URL hình ảnh...'
									onChange={(e) => setImagePreview(e.target.value)}
								/>
							</Form.Item>
						</Col>

						{/* Right: Basic info */}
						<Col span={16}>
							<Row gutter={12}>
								<Col span={14}>
									<Form.Item name='name' label='Tên điểm đến' rules={[{ required: true, message: 'Nhập tên!' }]}>
										<Input prefix={<CompassOutlined style={{ color: '#bfbfbf' }} />} placeholder='VD: Phú Quốc' />
									</Form.Item>
								</Col>
								<Col span={10}>
									<Form.Item name='location' label='Vị trí' rules={[{ required: true, message: 'Nhập vị trí!' }]}>
										<Input prefix={<EnvironmentOutlined style={{ color: '#bfbfbf' }} />} placeholder='VD: Kiên Giang' />
									</Form.Item>
								</Col>
							</Row>
							<Form.Item name='description' label='Mô tả' rules={[{ required: true, message: 'Nhập mô tả!' }]}>
								<Input.TextArea rows={3} placeholder='Mô tả ngắn gọn về điểm đến...' />
							</Form.Item>
							<Row gutter={12}>
								<Col span={8}>
									<Form.Item name='type' label='Loại' rules={[{ required: true, message: 'Chọn loại!' }]}>
										<Select placeholder='Chọn...'>
											<Option value='beach'>🏖️ Biển</Option>
											<Option value='mountain'>🏔️ Núi</Option>
											<Option value='city'>🏙️ Thành phố</Option>
										</Select>
									</Form.Item>
								</Col>
								<Col span={8}>
									<Form.Item name='rating' label='Đánh giá' rules={[{ required: true, message: 'Chọn sao!' }]}>
										<Rate />
									</Form.Item>
								</Col>
								<Col span={8}>
									<Form.Item
										name='visitDuration'
										label='Thời gian tham quan'
										rules={[{ required: true, message: 'Nhập giờ!' }]}
									>
										<InputNumber min={1} max={24} addonAfter='giờ' style={{ width: '100%' }} />
									</Form.Item>
								</Col>
							</Row>
						</Col>
					</Row>

					<Divider style={{ margin: '8px 0 16px' }}>
						<DollarOutlined /> Chi phí ước tính (VND/ngày)
					</Divider>

					<Row gutter={16}>
						<Col span={8}>
							<Form.Item
								name='costDining'
								label={
									<span>
										<CoffeeOutlined /> Ăn uống
									</span>
								}
								rules={[{ required: true, message: 'Nhập chi phí!' }]}
							>
								<InputNumber
									min={0}
									step={50000}
									style={{ width: '100%' }}
									formatter={(val) => `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
									parser={(val) => val?.replace(/,/g, '') as unknown as number}
									addonAfter='đ'
								/>
							</Form.Item>
						</Col>
						<Col span={8}>
							<Form.Item
								name='costAccommodation'
								label={
									<span>
										<HomeOutlined /> Lưu trú
									</span>
								}
								rules={[{ required: true, message: 'Nhập chi phí!' }]}
							>
								<InputNumber
									min={0}
									step={50000}
									style={{ width: '100%' }}
									formatter={(val) => `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
									parser={(val) => val?.replace(/,/g, '') as unknown as number}
									addonAfter='đ'
								/>
							</Form.Item>
						</Col>
						<Col span={8}>
							<Form.Item
								name='costTransport'
								label={
									<span>
										<CompassOutlined /> Di chuyển
									</span>
								}
								rules={[{ required: true, message: 'Nhập chi phí!' }]}
							>
								<InputNumber
									min={0}
									step={50000}
									style={{ width: '100%' }}
									formatter={(val) => `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
									parser={(val) => val?.replace(/,/g, '') as unknown as number}
									addonAfter='đ'
								/>
							</Form.Item>
						</Col>
					</Row>
				</Form>
			</Modal>
		</div>
	);
};

export default AdminDashboard;
