import React, { useState, useEffect, useMemo } from 'react';
import {
	Table,
	Button,
	Modal,
	Form,
	Input,
	Select,
	InputNumber,
	Row,
	Col,
	DatePicker,
	Menu,
	Dropdown,
	Tag,
} from 'antd';
import { getOrders, saveOrders } from '../utils/data';

const { Option } = Select;
const { RangePicker } = DatePicker;

interface OrderManagementProps {
	products: any[];
	onProductChange: (products: any[]) => void;
	onOrderChange: () => void;
}

const OrderManagement: React.FC<OrderManagementProps> = ({ products, onProductChange, onOrderChange }) => {
	const [orders, setOrders] = useState<any[]>([]);
	const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
	const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
	const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
	const [form] = Form.useForm();
	const [selectedProducts, setSelectedProducts] = useState<any[]>([]);
	const [searchText, setSearchText] = useState('');
	const [filterStatus, setFilterStatus] = useState<string | null>(null);
	const [filterDate, setFilterDate] = useState<any | null>(null);

	useEffect(() => {
		setOrders(getOrders());
	}, []);

	const handleCreateOrder = () => {
		form.resetFields();
		setSelectedProducts([]);
		setIsCreateModalVisible(true);
	};

	const handleCancel = () => {
		setIsCreateModalVisible(false);
		setIsDetailModalVisible(false);
	};

	const handleOk = () => {
		form.validateFields().then((values) => {
			for (const item of selectedProducts) {
				const product = products.find((p) => p.id === item.productId);
				if (!product || product.quantity < item.quantity) {
					Modal.error({
						title: 'Out of Stock',
						content: `Not enough stock for ${item.productName}. Available: ${product?.quantity || 0}.`,
					});
					return;
				}
			}

			const newOrder = {
				id: `DH${Date.now()}`,
				...values,
				products: selectedProducts,
				totalAmount: selectedProducts.reduce((acc, p) => acc + p.price * p.quantity, 0),
				status: 'Chờ xử lý',
				createdAt: new Date().toISOString().split('T')[0],
			};
			const updatedOrders = [...orders, newOrder];
			setOrders(updatedOrders);
			saveOrders(updatedOrders);

			setIsCreateModalVisible(false);
			onOrderChange();
		});
	};

	const handleProductSelection = (productIds: number[]) => {
		const selected = productIds.map((id) => {
			const product = products.find((p) => p.id === id);
			return {
				productId: id,
				productName: product.name,
				price: product.price,
				quantity: 1,
			};
		});
		setSelectedProducts(selected);
	};

	const handleQuantityChange = (productId: number, quantity: number) => {
		const updated = selectedProducts.map((p) => (p.productId === productId ? { ...p, quantity } : p));
		setSelectedProducts(updated);
	};

	const totalAmount = useMemo(() => {
		return selectedProducts.reduce((acc, p) => acc + p.price * p.quantity, 0);
	}, [selectedProducts]);

	const handleStatusChange = (order: any, newStatus: string) => {
		const prevStatus = order.status;
		if (prevStatus === newStatus) return;

		const reductionStatuses = ['Đang giao', 'Hoàn thành'];
		const wasReduced = reductionStatuses.includes(prevStatus);
		const isReduced = reductionStatuses.includes(newStatus);

		if (!wasReduced && isReduced) {
			for (const p of order.products) {
				const product = products.find((op) => op.id === p.productId);
				if (!product || product.quantity < p.quantity) {
					Modal.error({
						title: 'Out of Stock',
						content:
							`Cannot change status. Not enough stock for "${p.productName}". ` +
							`Required: ${p.quantity}, Available: ${product?.quantity || 0}.`,
					});
					return;
				}
			}
		}

		const updatedOrders = orders.map((o) => (o.id === order.id ? { ...o, status: newStatus } : o));
		setOrders(updatedOrders);
		saveOrders(updatedOrders);

		const updatedProducts = [...products];
		let productsChanged = false;

		if (!wasReduced && isReduced) {
			productsChanged = true;
			order.products.forEach((p: any) => {
				const productIndex = updatedProducts.findIndex((op) => op.id === p.productId);
				if (productIndex !== -1) {
					updatedProducts[productIndex].quantity -= p.quantity;
				}
			});
		} else if (wasReduced && !isReduced) {
			productsChanged = true;
			order.products.forEach((p: any) => {
				const productIndex = updatedProducts.findIndex((op) => op.id === p.productId);
				if (productIndex !== -1) {
					updatedProducts[productIndex].quantity += p.quantity;
				}
			});
		}

		if (productsChanged) {
			onProductChange(updatedProducts);
		}
		onOrderChange();
	};

	const handleViewDetail = (order: any) => {
		setSelectedOrder(order);
		setIsDetailModalVisible(true);
	};

	const filteredOrders = useMemo(() => {
		let filtered = [...orders];
		if (searchText) {
			filtered = filtered.filter(
				(o) =>
					o.id.toLowerCase().includes(searchText.toLowerCase()) ||
					o.customerName.toLowerCase().includes(searchText.toLowerCase()),
			);
		}
		if (filterStatus) {
			filtered = filtered.filter((o) => o.status === filterStatus);
		}
		if (filterDate) {
			filtered = filtered.filter(
				(o) => new Date(o.createdAt) >= filterDate[0] && new Date(o.createdAt) <= filterDate[1],
			);
		}
		return filtered;
	}, [orders, searchText, filterStatus, filterDate]);

	const columns = [
		{
			title: 'Order ID',
			dataIndex: 'id',
			key: 'id',
		},
		{
			title: 'Customer Name',
			dataIndex: 'customerName',
			key: 'customerName',
		},
		{
			title: 'Number of products',
			dataIndex: 'products',
			key: 'products',
			render: (orderProducts: any[]) => orderProducts.length,
		},
		{
			title: 'Total amount',
			dataIndex: 'totalAmount',
			key: 'totalAmount',
			render: (amount: number) => amount.toLocaleString(),
		},
		{
			title: 'Status',
			dataIndex: 'status',
			key: 'status',
			render: (status: string) => {
				let color = 'gold';
				if (status === 'Hoàn thành') color = 'green';
				if (status === 'Đã hủy') color = 'red';
				return <Tag color={color}>{status}</Tag>;
			},
		},
		{
			title: 'Created date',
			dataIndex: 'createdAt',
			key: 'createdAt',
		},
		{
			title: 'Actions',
			key: 'actions',
			render: (text: any, record: any) => (
				<>
					<Button onClick={() => handleViewDetail(record)} style={{ marginRight: 8 }}>
						View Detail
					</Button>
					<Dropdown
						overlay={
							<Menu onClick={({ key }) => handleStatusChange(record, key)}>
								<Menu.Item key='Chờ xử lý'>Chờ xử lý</Menu.Item>
								<Menu.Item key='Đang giao'>Đang giao</Menu.Item>
								<Menu.Item key='Hoàn thành'>Hoàn thành</Menu.Item>
								<Menu.Item key='Đã hủy'>Đã hủy</Menu.Item>
							</Menu>
						}
					>
						<Button>Change Status</Button>
					</Dropdown>
				</>
			),
		},
	];

	return (
		<>
			<Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
				<Col span={8}>
					<Input placeholder='Search by Order ID or Customer Name' onChange={(e) => setSearchText(e.target.value)} />
				</Col>
				<Col span={6}>
					<Select
						placeholder='Filter by status'
						onChange={(value) => setFilterStatus(value)}
						allowClear
						style={{ width: '100%' }}
					>
						<Option value='Chờ xử lý'>Chờ xử lý</Option>
						<Option value='Đang giao'>Đang giao</Option>
						<Option value='Hoàn thành'>Hoàn thành</Option>
						<Option value='Đã hủy'>Đã hủy</Option>
					</Select>
				</Col>
				<Col span={10}>
					<RangePicker style={{ width: '100%' }} onChange={(dates) => setFilterDate(dates)} />
				</Col>
			</Row>
			<Button type='primary' onClick={handleCreateOrder} style={{ marginBottom: 16 }}>
				Create Order
			</Button>
			<Table columns={columns} dataSource={filteredOrders} rowKey='id' />
			<Modal title='Create Order' visible={isCreateModalVisible} onOk={handleOk} onCancel={handleCancel} width={800}>
				<Form form={form} layout='vertical'>
					<Form.Item name='customerName' label='Customer Name' rules={[{ required: true }]}>
						<Input />
					</Form.Item>
					<Form.Item
						name='phone'
						label='Phone number'
						rules={[
							{ required: true },
							{
								pattern: /^[0-9]{10,11}$/,
								message: 'Phone number must be 10-11 digits',
							},
						]}
					>
						<Input />
					</Form.Item>
					<Form.Item name='address' label='Address' rules={[{ required: true }]}>
						<Input />
					</Form.Item>
					<Form.Item label='Products'>
						<Select
							mode='multiple'
							placeholder='Select products'
							onChange={handleProductSelection}
							style={{ width: '100%' }}
						>
							{products
								.filter((p) => p.quantity > 0)
								.map((p) => (
									<Option key={p.id} value={p.id}>
										{p.name}
									</Option>
								))}
						</Select>
					</Form.Item>
					{selectedProducts.map((p) => {
						const currentProduct = products.find((prod) => prod.id === p.productId);
						const maxQuantity = currentProduct ? currentProduct.quantity : 0;
						return (
							<Row key={p.productId} gutter={16} align='middle'>
								<Col span={10}>{p.productName}</Col>
								<Col span={6}>
									<InputNumber
										min={1}
										max={maxQuantity}
										value={p.quantity}
										onChange={(value) => handleQuantityChange(p.productId, value)}
									/>
								</Col>
								<Col span={8}>
									{p.price.toLocaleString()} x {p.quantity} = {(p.price * p.quantity).toLocaleString()}
								</Col>
							</Row>
						);
					})}
					<h3 style={{ marginTop: 16 }}>Total Amount: {totalAmount.toLocaleString()} VNĐ</h3>
				</Form>
			</Modal>
			<Modal title='Order Detail' visible={isDetailModalVisible} onCancel={handleCancel} footer={null}>
				{selectedOrder && (
					<div>
						<p>
							<strong>Order ID:</strong> {selectedOrder.id}
						</p>
						<p>
							<strong>Customer Name:</strong> {selectedOrder.customerName}
						</p>
						<p>
							<strong>Phone:</strong> {selectedOrder.phone}
						</p>
						<p>
							<strong>Address:</strong> {selectedOrder.address}
						</p>
						<p>
							<strong>Status:</strong> {selectedOrder.status}
						</p>
						<p>
							<strong>Created At:</strong> {selectedOrder.createdAt}
						</p>
						<p>
							<strong>Total Amount:</strong> {selectedOrder.totalAmount.toLocaleString()} VNĐ
						</p>
						<strong>Products:</strong>
						<ul>
							{selectedOrder.products.map((p: any) => (
								<li key={p.productId}>
									{p.productName} - {p.quantity} x {p.price.toLocaleString()}
								</li>
							))}
						</ul>
					</div>
				)}
			</Modal>
		</>
	);
};

export default OrderManagement;
