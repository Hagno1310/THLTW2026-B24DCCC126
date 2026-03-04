import React, { useState, useEffect, useMemo } from 'react';
import { Row, Col, Card, Statistic, Badge } from 'antd';
import { getProducts, getOrders } from '../utils/data';

interface DashboardProps {
	refreshKey: number;
}

const Dashboard: React.FC<DashboardProps> = ({ refreshKey }) => {
	const [products, setProducts] = useState<any[]>([]);
	const [orders, setOrders] = useState<any[]>([]);

	useEffect(() => {
		setProducts(getProducts());
		setOrders(getOrders());
	}, [refreshKey]);

	const totalInventoryValue = useMemo(() => {
		return products.reduce((acc, p) => acc + p.price * p.quantity, 0);
	}, [products]);

	const totalRevenue = useMemo(() => {
		return orders.filter((o) => o.status === 'Hoàn thành').reduce((acc, o) => acc + o.totalAmount, 0);
	}, [orders]);

	const ordersByStatus = useMemo(() => {
		return orders.reduce((acc, o) => {
			acc[o.status] = (acc[o.status] || 0) + 1;
			return acc;
		}, {});
	}, [orders]);

	return (
		<div style={{ marginBottom: '20px' }}>
			<Row gutter={16}>
				<Col span={6}>
					<Card>
						<Statistic title='Total Products' value={products.length} />
					</Card>
				</Col>
				<Col span={6}>
					<Card>
						<Statistic title='Total Inventory Value' value={totalInventoryValue} precision={0} suffix='VNĐ' />
					</Card>
				</Col>
				<Col span={6}>
					<Card>
						<Statistic title='Total Orders' value={orders.length} />
					</Card>
				</Col>
				<Col span={6}>
					<Card>
						<Statistic title='Revenue' value={totalRevenue} precision={0} suffix='VNĐ' />
					</Card>
				</Col>
			</Row>
			<Row gutter={16} style={{ marginTop: 16 }}>
				<Col span={24}>
					<Card title='Orders by Status'>
						<Row gutter={[16, 16]}>
							<Col span={6}>
								<Badge
									count={ordersByStatus['Chờ xử lý'] || 0}
									style={{ backgroundColor: '#faad14', marginBottom: '10px', marginRight: '-14px' }}
									overflowCount={9999}
								>
									<span>Chờ xử lý</span>
								</Badge>
							</Col>
							<Col span={6}>
								<Badge
									count={ordersByStatus['Đang giao'] || 0}
									style={{ backgroundColor: '#1890ff', marginBottom: '10px', marginRight: '-14px' }}
									overflowCount={9999}
								>
									<span>Đang giao</span>
								</Badge>
							</Col>
							<Col span={6}>
								<Badge
									count={ordersByStatus['Hoàn thành'] || 0}
									style={{ backgroundColor: '#52c41a', marginBottom: '10px', marginRight: '-14px' }}
									overflowCount={9999}
								>
									<span>Hoàn thành</span>
								</Badge>
							</Col>
							<Col span={6}>
								<Badge
									count={ordersByStatus['Đã hủy'] || 0}
									style={{ backgroundColor: '#f5222d', marginBottom: '10px', marginRight: '-14px' }}
									overflowCount={9999}
								>
									<span>Đã hủy</span>
								</Badge>
							</Col>
						</Row>
					</Card>
				</Col>
			</Row>
		</div>
	);
};

export default Dashboard;
