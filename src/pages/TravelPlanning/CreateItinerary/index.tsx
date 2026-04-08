import { TravelData } from '@/services/TravelPlanning/data';
import {
	CalendarOutlined,
	DeleteOutlined,
	DollarOutlined,
	DragOutlined,
	EnvironmentOutlined,
	PlusOutlined,
	RocketOutlined,
	SearchOutlined,
	StarFilled,
} from '@ant-design/icons';
import {
	Alert,
	Avatar,
	Button,
	Card,
	Col,
	Divider,
	Empty,
	Form,
	Input,
	InputNumber,
	List,
	message,
	Modal,
	Rate,
	Row,
	Select,
	Tag,
	Typography,
} from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { DragDropContext, Draggable, Droppable, type DropResult } from 'react-beautiful-dnd';
import './index.less';

const { Text, Title } = Typography;

const { Option } = Select;

const formatVND = (val: number) => new Intl.NumberFormat('vi-VN').format(val) + 'đ';

const CreateItinerary: React.FC = () => {
	const [itineraries, setItineraries] = useState<TravelPlanning.Itinerary[]>([]);
	const [selectedId, setSelectedId] = useState<string | undefined>(undefined);
	const [destinations, setDestinations] = useState<TravelPlanning.Destination[]>([]);
	const [modalVisible, setModalVisible] = useState(false);
	const [addDestModalVisible, setAddDestModalVisible] = useState(false);
	const [activeDayId, setActiveDayId] = useState<string | null>(null);
	const [destSearch, setDestSearch] = useState('');
	const [destTypeFilter, setDestTypeFilter] = useState<string | undefined>(undefined);
	const [form] = Form.useForm();

	useEffect(() => {
		setItineraries(TravelData.getItineraries());
		setDestinations(TravelData.getDestinations());
	}, []);

	const currentItinerary = useMemo(() => itineraries.find((it) => it.id === selectedId), [itineraries, selectedId]);

	const budget = useMemo(() => {
		if (!currentItinerary) return { dining: 0, accommodation: 0, transport: 0, total: 0 };
		return TravelData.calculateItineraryBudget(currentItinerary);
	}, [currentItinerary]);

	const isOverBudget = currentItinerary ? budget.total > currentItinerary.budgetLimit : false;

	const saveAndUpdate = (updated: TravelPlanning.Itinerary[]) => {
		setItineraries(updated);
		TravelData.saveItineraries(updated);
	};

	const handleCreateNew = () => {
		form.validateFields().then((values) => {
			const newItinerary: TravelPlanning.Itinerary = {
				id: Date.now().toString(),
				name: values.name,
				budgetLimit: values.budgetLimit,
				days: [],
				createdAt: new Date().toISOString(),
			};
			const updated = [...itineraries, newItinerary];
			saveAndUpdate(updated);
			setSelectedId(newItinerary.id);
			setModalVisible(false);
			form.resetFields();
			message.success('Đã tạo lịch trình mới!');
		});
	};

	const handleAddDay = () => {
		if (!currentItinerary) return;
		const newDay: TravelPlanning.ItineraryDay = {
			id: `day-${Date.now()}`,
			dayNumber: currentItinerary.days.length + 1,
			destinations: [],
		};
		const updated = itineraries.map((it) => (it.id === selectedId ? { ...it, days: [...it.days, newDay] } : it));
		saveAndUpdate(updated);
	};

	const handleRemoveDay = (dayId: string) => {
		if (!currentItinerary) return;
		const newDays = currentItinerary.days.filter((d) => d.id !== dayId).map((d, i) => ({ ...d, dayNumber: i + 1 }));
		const updated = itineraries.map((it) => (it.id === selectedId ? { ...it, days: newDays } : it));
		saveAndUpdate(updated);
	};

	const handleAddDestToDay = (destId: string) => {
		if (!currentItinerary || !activeDayId) return;
		const updated = itineraries.map((it) => {
			if (it.id !== selectedId) return it;
			return {
				...it,
				days: it.days.map((day) =>
					day.id === activeDayId ? { ...day, destinations: [...day.destinations, destId] } : day,
				),
			};
		});
		saveAndUpdate(updated);
		setAddDestModalVisible(false);
		message.success('Đã thêm điểm đến!');
	};

	const handleRemoveDest = (dayId: string, destIndex: number) => {
		if (!currentItinerary) return;
		const updated = itineraries.map((it) => {
			if (it.id !== selectedId) return it;
			return {
				...it,
				days: it.days.map((day) => {
					if (day.id !== dayId) return day;
					const newDests = [...day.destinations];
					newDests.splice(destIndex, 1);
					return { ...day, destinations: newDests };
				}),
			};
		});
		saveAndUpdate(updated);
	};

	const onDragEnd = (result: DropResult) => {
		if (!result.destination || !currentItinerary) return;

		const sourceDayId = result.source.droppableId;
		const destDayId = result.destination.droppableId;
		const sourceIndex = result.source.index;
		const destIndex = result.destination.index;

		const updated = itineraries.map((it) => {
			if (it.id !== selectedId) return it;

			const newDays = it.days.map((day) => ({ ...day, destinations: [...day.destinations] }));

			if (sourceDayId === destDayId) {
				const day = newDays.find((d) => d.id === sourceDayId);
				if (day) {
					const [removed] = day.destinations.splice(sourceIndex, 1);
					day.destinations.splice(destIndex, 0, removed);
				}
			} else {
				const sourceDay = newDays.find((d) => d.id === sourceDayId);
				const destDay = newDays.find((d) => d.id === destDayId);
				if (sourceDay && destDay) {
					const [removed] = sourceDay.destinations.splice(sourceIndex, 1);
					destDay.destinations.splice(destIndex, 0, removed);
				}
			}

			return { ...it, days: newDays };
		});

		saveAndUpdate(updated);
	};

	const getDest = (id: string) => destinations.find((d) => d.id === id);
	const getDestName = (id: string) => getDest(id)?.name || id;
	const getDestType = (id: string) => getDest(id)?.type || 'city';

	const typeLabels: Record<string, string> = { beach: 'Biển', mountain: 'Núi', city: 'TP' };
	const typeColors: Record<string, string> = { beach: 'blue', mountain: 'green', city: 'orange' };

	const filteredDestinations = useMemo(() => {
		let result = [...destinations];
		if (destSearch) {
			const q = destSearch.toLowerCase();
			result = result.filter((d) => d.name.toLowerCase().includes(q) || d.location.toLowerCase().includes(q));
		}
		if (destTypeFilter) {
			result = result.filter((d) => d.type === destTypeFilter);
		}
		return result;
	}, [destinations, destSearch, destTypeFilter]);

	return (
		<div className='create-itinerary-container'>
			<div className='header-section'>
				<h2>
					<CalendarOutlined /> Tạo lịch trình
				</h2>
				<Button type='primary' icon={<PlusOutlined />} onClick={() => setModalVisible(true)}>
					Tạo mới
				</Button>
			</div>

			<div className='itinerary-selector'>
				<Select
					placeholder='Chọn lịch trình...'
					value={selectedId}
					onChange={setSelectedId}
					style={{ width: '100%', maxWidth: 400 }}
					allowClear
				>
					{itineraries.map((it) => (
						<Option key={it.id} value={it.id}>
							{it.name}
						</Option>
					))}
				</Select>
			</div>

			{currentItinerary && (
				<>
					{isOverBudget ? (
						<Alert
							className='budget-alert'
							type='error'
							showIcon
							message={`Vượt ngân sách! Chi phí ${formatVND(budget.total)} / Giới hạn ${formatVND(
								currentItinerary.budgetLimit,
							)}`}
						/>
					) : (
						<Alert
							className='budget-alert'
							type='success'
							showIcon
							message={`Trong ngân sách: ${formatVND(budget.total)} / ${formatVND(currentItinerary.budgetLimit)}`}
						/>
					)}

					<div className='content-row'>
						<div className='days-column'>
							<Button type='dashed' block icon={<PlusOutlined />} onClick={handleAddDay} style={{ marginBottom: 16 }}>
								Thêm ngày mới
							</Button>

							<DragDropContext onDragEnd={onDragEnd}>
								{currentItinerary.days.map((day) => (
									<Card
										key={day.id}
										className='day-card'
										size='small'
										title={
											<div className='day-header'>
												<span>Ngày {day.dayNumber}</span>
												<span>
													<Button
														size='small'
														type='link'
														onClick={() => {
															setActiveDayId(day.id);
															setAddDestModalVisible(true);
														}}
													>
														<PlusOutlined /> Thêm điểm đến
													</Button>
													<Button size='small' type='link' danger onClick={() => handleRemoveDay(day.id)}>
														<DeleteOutlined />
													</Button>
												</span>
											</div>
										}
									>
										<Droppable droppableId={day.id}>
											{(provided) => (
												<div ref={provided.innerRef} {...provided.droppableProps} style={{ minHeight: 40 }}>
													{day.destinations.length === 0 ? (
														<div className='empty-day'>Kéo thả hoặc thêm điểm đến vào ngày này</div>
													) : (
														// eslint-disable-next-line react/no-array-index-key
														day.destinations.map((destId, index) => (
															<Draggable
																key={`${day.id}-${destId}-${index}`}
																draggableId={`${day.id}-${destId}-${index}`}
																index={index}
															>
																{(dragProvided) => (
																	<div
																		className='destination-item'
																		ref={dragProvided.innerRef}
																		{...dragProvided.draggableProps}
																		{...dragProvided.dragHandleProps}
																	>
																		<div className='dest-info'>
																			<DragOutlined style={{ color: '#bfbfbf' }} />
																			<span className='dest-name'>{getDestName(destId)}</span>
																			<Tag color={typeColors[getDestType(destId)]}>
																				{typeLabels[getDestType(destId)]}
																			</Tag>
																		</div>
																		<Button
																			type='text'
																			size='small'
																			danger
																			icon={<DeleteOutlined />}
																			onClick={() => handleRemoveDest(day.id, index)}
																		/>
																	</div>
																)}
															</Draggable>
														))
													)}
													{provided.placeholder}
												</div>
											)}
										</Droppable>
										{day.destinations.length > 1 && (
											<div
												style={{
													fontSize: 12,
													color: '#999',
													marginTop: 4,
													textAlign: 'right',
												}}
											>
												Di chuyển ước tính: {(day.destinations.length - 1) * 2}h
											</div>
										)}
									</Card>
								))}
							</DragDropContext>
						</div>

						<div className='sidebar-column'>
							<Card title='Tóm tắt ngân sách' size='small'>
								<div className='budget-summary'>
									<div className='budget-item'>
										<span>Ăn uống</span>
										<span>{formatVND(budget.dining)}</span>
									</div>
									<div className='budget-item'>
										<span>Lưu trú</span>
										<span>{formatVND(budget.accommodation)}</span>
									</div>
									<div className='budget-item'>
										<span>Di chuyển</span>
										<span>{formatVND(budget.transport)}</span>
									</div>
									<div className='budget-item'>
										<span>Tổng cộng</span>
										<span style={{ color: isOverBudget ? '#f5222d' : '#52c41a' }}>{formatVND(budget.total)}</span>
									</div>
								</div>
							</Card>
						</div>
					</div>
				</>
			)}

			<Modal
				title={
					<span>
						<RocketOutlined style={{ color: '#1890ff', marginRight: 8 }} />
						Tạo lịch trình mới
					</span>
				}
				visible={modalVisible}
				onOk={handleCreateNew}
				onCancel={() => {
					setModalVisible(false);
					form.resetFields();
				}}
				okText='Bắt đầu lên kế hoạch'
				cancelText='Hủy'
				width={480}
				className='create-modal'
				bodyStyle={{ padding: '20px 24px' }}
			>
				<div className='create-modal-banner'>
					<CalendarOutlined style={{ fontSize: 36, color: '#1890ff' }} />
					<div>
						<Title level={5} style={{ margin: 0 }}>
							Hành trình mới
						</Title>
						<Text type='secondary'>Đặt tên và ngân sách cho chuyến đi của bạn</Text>
					</div>
				</div>

				<Divider style={{ margin: '16px 0' }} />

				<Form form={form} layout='vertical'>
					<Form.Item name='name' label='Tên lịch trình' rules={[{ required: true, message: 'Nhập tên lịch trình!' }]}>
						<Input
							prefix={<CalendarOutlined style={{ color: '#bfbfbf' }} />}
							placeholder='VD: Du lịch Đà Nẵng 3 ngày'
							size='large'
						/>
					</Form.Item>
					<Form.Item
						name='budgetLimit'
						label='Ngân sách giới hạn'
						rules={[{ required: true, message: 'Nhập ngân sách!' }]}
						extra={
							<Text type='secondary' style={{ fontSize: 12 }}>
								Bạn sẽ nhận cảnh báo khi chi phí vượt ngân sách
							</Text>
						}
					>
						<InputNumber
							prefix={<DollarOutlined style={{ color: '#bfbfbf' }} />}
							min={1000000}
							step={500000}
							style={{ width: '100%' }}
							size='large'
							formatter={(val) => `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
							parser={(val) => val?.replace(/,/g, '') as unknown as number}
							addonAfter='VND'
						/>
					</Form.Item>
				</Form>
			</Modal>

			<Modal
				title={
					<span>
						<EnvironmentOutlined style={{ color: '#52c41a', marginRight: 8 }} />
						Chọn điểm đến
					</span>
				}
				visible={addDestModalVisible}
				onCancel={() => {
					setAddDestModalVisible(false);
					setDestSearch('');
					setDestTypeFilter(undefined);
				}}
				footer={null}
				width={560}
				className='dest-picker-modal'
				bodyStyle={{ padding: '12px 24px 24px' }}
			>
				<Row gutter={12} style={{ marginBottom: 16 }}>
					<Col flex='auto'>
						<Input
							prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
							placeholder='Tìm kiếm điểm đến...'
							allowClear
							value={destSearch}
							onChange={(e) => setDestSearch(e.target.value)}
						/>
					</Col>
					<Col>
						<Select
							placeholder='Loại'
							allowClear
							value={destTypeFilter}
							onChange={setDestTypeFilter}
							style={{ width: 130 }}
						>
							<Select.Option value='beach'>🏖️ Biển</Select.Option>
							<Select.Option value='mountain'>🏔️ Núi</Select.Option>
							<Select.Option value='city'>🏙️ Thành phố</Select.Option>
						</Select>
					</Col>
				</Row>

				<div className='dest-picker-list'>
					{filteredDestinations.length === 0 ? (
						<Empty description='Không tìm thấy điểm đến' image={Empty.PRESENTED_IMAGE_SIMPLE} />
					) : (
						<List
							dataSource={filteredDestinations}
							renderItem={(dest) => {
								const totalCost = dest.cost.dining + dest.cost.accommodation + dest.cost.transport;
								return (
									<div className='dest-picker-item' onClick={() => handleAddDestToDay(dest.id)}>
										<Avatar shape='square' size={56} src={dest.image} style={{ borderRadius: 8, flexShrink: 0 }} />
										<div className='dest-picker-info'>
											<div className='dest-picker-name'>
												{dest.name}
												<Tag color={typeColors[dest.type]} style={{ marginLeft: 8 }}>
													{typeLabels[dest.type]}
												</Tag>
											</div>
											<div className='dest-picker-meta'>
												<span>
													<EnvironmentOutlined /> {dest.location}
												</span>
												<span>
													<StarFilled style={{ color: '#faad14', fontSize: 12 }} /> {dest.rating}
												</span>
												<span>{dest.visitDuration}h</span>
											</div>
										</div>
										<div className='dest-picker-cost'>{formatVND(totalCost)}</div>
									</div>
								);
							}}
						/>
					)}
				</div>
			</Modal>
		</div>
	);
};

export default CreateItinerary;
