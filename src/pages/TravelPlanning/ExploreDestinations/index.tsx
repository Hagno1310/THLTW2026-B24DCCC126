import { TravelData } from '@/services/TravelPlanning/data';
import { EnvironmentOutlined, SearchOutlined } from '@ant-design/icons';
import { Card, Col, Collapse, Rate, Row, Select, Slider, Tag } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import './index.less';

const { Option } = Select;
const { Panel } = Collapse;

const typeColors: Record<string, string> = {
	beach: 'blue',
	mountain: 'green',
	city: 'orange',
};

const typeLabels: Record<string, string> = {
	beach: 'Biển',
	mountain: 'Núi',
	city: 'Thành phố',
};

const formatVND = (val: number) => new Intl.NumberFormat('vi-VN').format(val) + 'đ';

const ExploreDestinations: React.FC = () => {
	const [destinations, setDestinations] = useState<TravelPlanning.Destination[]>([]);
	const [typeFilter, setTypeFilter] = useState<string | undefined>(undefined);
	const [priceRange, setPriceRange] = useState<[number, number]>([0, 3000000]);
	const [minRating, setMinRating] = useState<number>(0);
	const [sortBy, setSortBy] = useState<string>('name');
	const isMobile = useMediaQuery({ maxWidth: 768 });

	useEffect(() => {
		setDestinations(TravelData.getDestinations());
	}, []);

	const filtered = useMemo(() => {
		let result = [...destinations];

		if (typeFilter) {
			result = result.filter((d) => d.type === typeFilter);
		}

		result = result.filter((d) => {
			const total = d.cost.dining + d.cost.accommodation + d.cost.transport;
			return total >= priceRange[0] && total <= priceRange[1];
		});

		if (minRating > 0) {
			result = result.filter((d) => d.rating >= minRating);
		}

		switch (sortBy) {
			case 'name':
				result.sort((a, b) => a.name.localeCompare(b.name));
				break;
			case 'rating':
				result.sort((a, b) => b.rating - a.rating);
				break;
			case 'price-asc':
				result.sort((a, b) => {
					const totalA = a.cost.dining + a.cost.accommodation + a.cost.transport;
					const totalB = b.cost.dining + b.cost.accommodation + b.cost.transport;
					return totalA - totalB;
				});
				break;
			case 'price-desc':
				result.sort((a, b) => {
					const totalA = a.cost.dining + a.cost.accommodation + a.cost.transport;
					const totalB = b.cost.dining + b.cost.accommodation + b.cost.transport;
					return totalB - totalA;
				});
				break;
		}

		return result;
	}, [destinations, typeFilter, priceRange, minRating, sortBy]);

	const filterContent = (
		<Row gutter={[16, 16]} align='middle'>
			<Col xs={24} sm={6}>
				<label>Loại điểm đến</label>
				<Select
					placeholder='Tất cả'
					allowClear
					value={typeFilter}
					onChange={setTypeFilter}
					style={{ width: '100%', marginTop: 4 }}
				>
					<Option value='beach'>Biển</Option>
					<Option value='mountain'>Núi</Option>
					<Option value='city'>Thành phố</Option>
				</Select>
			</Col>
			<Col xs={24} sm={8}>
				<label>Khoảng giá (VND/ngày)</label>
				<Slider
					range
					min={0}
					max={3000000}
					step={100000}
					value={priceRange}
					onChange={(val) => setPriceRange(val as [number, number])}
					tipFormatter={(val) => formatVND(val || 0)}
					style={{ marginTop: 4 }}
				/>
			</Col>
			<Col xs={24} sm={5}>
				<label>Đánh giá tối thiểu</label>
				<div style={{ marginTop: 4 }}>
					<Rate value={minRating} onChange={(val) => setMinRating(val)} allowClear />
				</div>
			</Col>
			<Col xs={24} sm={5}>
				<label>Sắp xếp</label>
				<Select value={sortBy} onChange={setSortBy} style={{ width: '100%', marginTop: 4 }}>
					<Option value='name'>Tên A-Z</Option>
					<Option value='rating'>Đánh giá cao nhất</Option>
					<Option value='price-asc'>Giá tăng dần</Option>
					<Option value='price-desc'>Giá giảm dần</Option>
				</Select>
			</Col>
		</Row>
	);

	return (
		<div className='explore-container'>
			<div className='header-section'>
				<h2>
					<SearchOutlined /> Khám phá điểm đến
				</h2>
				<span>{filtered.length} điểm đến</span>
			</div>

			{isMobile ? (
				<Collapse className='mobile-filter-collapse'>
					<Panel header='Bộ lọc' key='1'>
						{filterContent}
					</Panel>
				</Collapse>
			) : (
				<div className='filter-bar'>{filterContent}</div>
			)}

			<Row gutter={[16, 16]}>
				{filtered.map((dest) => {
					const totalCost = dest.cost.dining + dest.cost.accommodation + dest.cost.transport;
					return (
						<Col xs={24} sm={12} lg={6} key={dest.id}>
							<Card className='destination-card' hoverable cover={<img alt={dest.name} src={dest.image} />}>
								<div className='card-meta'>
									<h3 style={{ marginBottom: 4 }}>{dest.name}</h3>
									<div className='location'>
										<EnvironmentOutlined /> {dest.location}
									</div>
									<Tag color={typeColors[dest.type]}>{typeLabels[dest.type]}</Tag>
									<p style={{ fontSize: 13, color: '#666', margin: '8px 0' }}>{dest.description}</p>
									<div className='rating-row'>
										<Rate disabled value={dest.rating} style={{ fontSize: 14 }} />
										<span style={{ fontSize: 12, color: '#999' }}>{dest.visitDuration}h</span>
									</div>
									<div className='cost'>{formatVND(totalCost)}/ngày</div>
								</div>
							</Card>
						</Col>
					);
				})}
			</Row>

			{filtered.length === 0 && (
				<div style={{ textAlign: 'center', padding: 40, color: '#999' }}>
					Không tìm thấy điểm đến phù hợp. Hãy thử thay đổi bộ lọc.
				</div>
			)}
		</div>
	);
};

export default ExploreDestinations;
