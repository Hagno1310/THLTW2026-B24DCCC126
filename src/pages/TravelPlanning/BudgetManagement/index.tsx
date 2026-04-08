import ColumnChart from '@/components/Chart/ColumnChart';
import DonutChart from '@/components/Chart/DonutChart';
import { TravelData } from '@/services/TravelPlanning/data';
import { DollarOutlined, WarningOutlined } from '@ant-design/icons';
import { Alert, Card, Col, Row, Select, Statistic, Table } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import './index.less';

const { Option } = Select;

const formatVND = (val: number) => new Intl.NumberFormat('vi-VN').format(val) + 'đ';

const BudgetManagement: React.FC = () => {
	const [itineraries, setItineraries] = useState<TravelPlanning.Itinerary[]>([]);
	const [destinations, setDestinations] = useState<TravelPlanning.Destination[]>([]);
	const [selectedId, setSelectedId] = useState<string | undefined>(undefined);

	useEffect(() => {
		const its = TravelData.getItineraries();
		setItineraries(its);
		setDestinations(TravelData.getDestinations());
		if (its.length > 0) setSelectedId(its[0].id);
	}, []);

	const currentItinerary = useMemo(() => itineraries.find((it) => it.id === selectedId), [itineraries, selectedId]);

	const budget = useMemo(() => {
		if (!currentItinerary) return { dining: 0, accommodation: 0, transport: 0, total: 0 };
		return TravelData.calculateItineraryBudget(currentItinerary);
	}, [currentItinerary]);

	const isOverBudget = currentItinerary ? budget.total > currentItinerary.budgetLimit : false;
	const remaining = currentItinerary ? currentItinerary.budgetLimit - budget.total : 0;

	// Chart data: daily costs
	const dailyCosts = useMemo(() => {
		if (!currentItinerary)
			return {
				labels: [] as string[],
				dining: [] as number[],
				accommodation: [] as number[],
				transport: [] as number[],
			};
		const labels: string[] = [];
		const dining: number[] = [];
		const accommodation: number[] = [];
		const transport: number[] = [];

		currentItinerary.days.forEach((day) => {
			labels.push(`Ngày ${day.dayNumber}`);
			let dDining = 0;
			let dAccom = 0;
			let dTransport = 0;
			day.destinations.forEach((destId) => {
				const dest = destinations.find((d) => d.id === destId);
				if (dest) {
					dDining += dest.cost.dining;
					dAccom += dest.cost.accommodation;
					dTransport += dest.cost.transport;
				}
			});
			if (day.destinations.length > 1) {
				dTransport += (day.destinations.length - 1) * 100000;
			}
			dining.push(dDining);
			accommodation.push(dAccom);
			transport.push(dTransport);
		});

		return { labels, dining, accommodation, transport };
	}, [currentItinerary, destinations]);

	// Detail table data
	const detailData = useMemo(() => {
		if (!currentItinerary) return [];
		const rows: any[] = [];
		currentItinerary.days.forEach((day) => {
			day.destinations.forEach((destId) => {
				const dest = destinations.find((d) => d.id === destId);
				if (dest) {
					rows.push({
						key: `${day.id}-${destId}-${Math.random()}`,
						day: day.dayNumber,
						name: dest.name,
						dining: dest.cost.dining,
						accommodation: dest.cost.accommodation,
						transport: dest.cost.transport,
						total: dest.cost.dining + dest.cost.accommodation + dest.cost.transport,
					});
				}
			});
		});
		return rows;
	}, [currentItinerary, destinations]);

	const columns = [
		{ title: 'Ngày', dataIndex: 'day', key: 'day', width: 70 },
		{ title: 'Điểm đến', dataIndex: 'name', key: 'name' },
		{ title: 'Ăn uống', dataIndex: 'dining', key: 'dining', render: (v: number) => formatVND(v) },
		{ title: 'Lưu trú', dataIndex: 'accommodation', key: 'accommodation', render: (v: number) => formatVND(v) },
		{ title: 'Di chuyển', dataIndex: 'transport', key: 'transport', render: (v: number) => formatVND(v) },
		{ title: 'Tổng', dataIndex: 'total', key: 'total', render: (v: number) => <strong>{formatVND(v)}</strong> },
	];

	return (
		<div className='budget-container'>
			<div className='header-section'>
				<h2>
					<DollarOutlined /> Quản lý ngân sách
				</h2>
				<Select placeholder='Chọn lịch trình' value={selectedId} onChange={setSelectedId} style={{ width: 300 }}>
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
							type='error'
							showIcon
							icon={<WarningOutlined />}
							message={`Vượt ngân sách ${formatVND(Math.abs(remaining))}!`}
							description={`Tổng chi phí ${formatVND(budget.total)} vượt giới hạn ${formatVND(
								currentItinerary.budgetLimit,
							)}`}
							style={{ marginBottom: 24 }}
						/>
					) : (
						<Alert
							type='success'
							showIcon
							message={`Trong ngân sách! Còn lại ${formatVND(remaining)}`}
							style={{ marginBottom: 24 }}
						/>
					)}

					<Row gutter={16} className='stat-cards'>
						<Col xs={24} sm={8}>
							<Card>
								<Statistic
									title='Tổng chi phí'
									value={budget.total}
									formatter={(val) => formatVND(val as number)}
									prefix={<DollarOutlined />}
								/>
							</Card>
						</Col>
						<Col xs={24} sm={8}>
							<Card>
								<Statistic
									title='Giới hạn ngân sách'
									value={currentItinerary.budgetLimit}
									formatter={(val) => formatVND(val as number)}
								/>
							</Card>
						</Col>
						<Col xs={24} sm={8}>
							<Card>
								<Statistic
									title={isOverBudget ? 'Vượt ngân sách' : 'Còn lại'}
									value={Math.abs(remaining)}
									formatter={(val) => formatVND(val as number)}
									valueStyle={{ color: isOverBudget ? '#f5222d' : '#52c41a' }}
								/>
							</Card>
						</Col>
					</Row>

					<Row gutter={16} className='chart-row'>
						<Col xs={24} lg={12}>
							<Card title='Phân bổ theo hạng mục'>
								<DonutChart
									xAxis={['Ăn uống', 'Lưu trú', 'Di chuyển']}
									yAxis={[[budget.dining, budget.accommodation, budget.transport]]}
									yLabel={['Chi phí']}
									height={300}
									colors={['#1890ff', '#52c41a', '#faad14']}
									showTotal
									formatY={formatVND}
								/>
							</Card>
						</Col>
						<Col xs={24} lg={12}>
							<Card title='Chi phí theo ngày'>
								<ColumnChart
									xAxis={dailyCosts.labels}
									yAxis={[dailyCosts.dining, dailyCosts.accommodation, dailyCosts.transport]}
									yLabel={['Ăn uống', 'Lưu trú', 'Di chuyển']}
									height={300}
									colors={['#1890ff', '#52c41a', '#faad14']}
									formatY={formatVND}
								/>
							</Card>
						</Col>
					</Row>

					<Card title='Chi tiết từng điểm đến' className='detail-table'>
						<Table
							dataSource={detailData}
							columns={columns}
							pagination={false}
							scroll={{ x: 600 }}
							summary={() => (
								<Table.Summary.Row>
									<Table.Summary.Cell index={0} colSpan={2}>
										<strong>Tổng cộng</strong>
									</Table.Summary.Cell>
									<Table.Summary.Cell index={2}>
										<strong>{formatVND(budget.dining)}</strong>
									</Table.Summary.Cell>
									<Table.Summary.Cell index={3}>
										<strong>{formatVND(budget.accommodation)}</strong>
									</Table.Summary.Cell>
									<Table.Summary.Cell index={4}>
										<strong>{formatVND(budget.transport)}</strong>
									</Table.Summary.Cell>
									<Table.Summary.Cell index={5}>
										<strong>{formatVND(budget.total)}</strong>
									</Table.Summary.Cell>
								</Table.Summary.Row>
							)}
						/>
					</Card>
				</>
			)}
		</div>
	);
};

export default BudgetManagement;
