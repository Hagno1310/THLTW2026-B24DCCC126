import React, { useState, useMemo } from 'react';
import { Table, Tag, Button, Modal, Form, Input, InputNumber, Select, Row, Col } from 'antd';

const { Option } = Select;

interface ProductManagementProps {
	products: any[];
	onProductChange: (products: any[]) => void;
}

const ProductManagement: React.FC<ProductManagementProps> = ({ products, onProductChange }) => {
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [editingProduct, setEditingProduct] = useState<any | null>(null);
	const [form] = Form.useForm();
	const [searchText, setSearchText] = useState('');
	const [filterCategory, setFilterCategory] = useState<string | null>(null);
	const [filterPrice, setFilterPrice] = useState<[number, number] | null>(null);
	const [filterStatus, setFilterStatus] = useState<string | null>(null);
	const [sortedInfo, setSortedInfo] = useState<any>({});

	const handleEdit = (product: any) => {
		setEditingProduct(product);
		form.setFieldsValue(product);
		setIsModalVisible(true);
	};

	const handleCancel = () => {
		setIsModalVisible(false);
		setEditingProduct(null);
	};

	const handleOk = () => {
		form.validateFields().then((values) => {
			const updatedProducts = products.map((p) => (p.id === editingProduct.id ? { ...p, ...values } : p));
			onProductChange(updatedProducts);
			setIsModalVisible(false);
			setEditingProduct(null);
		});
	};

	const handleChange = (pagination: any, filters: any, sorter: any) => {
		setSortedInfo(sorter);
	};

	const getStatus = (quantity: number) => {
		if (quantity > 10) return { text: 'In Stock', color: 'green' };
		if (quantity > 0) return { text: 'Low Stock', color: 'orange' };
		return { text: 'Out of Stock', color: 'red' };
	};

	const filteredProducts = useMemo(() => {
		let filtered = [...products];

		if (searchText) {
			filtered = filtered.filter((p) => p.name.toLowerCase().includes(searchText.toLowerCase()));
		}
		if (filterCategory) {
			filtered = filtered.filter((p) => p.category === filterCategory);
		}
		if (filterPrice) {
			filtered = filtered.filter((p) => p.price >= filterPrice[0] && p.price <= filterPrice[1]);
		}
		if (filterStatus) {
			filtered = filtered.filter((p) => {
				const status = getStatus(p.quantity).text;
				return status === filterStatus;
			});
		}

		return filtered;
	}, [products, searchText, filterCategory, filterPrice, filterStatus]);

	const columns = [
		{
			title: 'STT',
			dataIndex: 'id',
			key: 'id',
			render: (text: any, record: any, index: number) => index + 1,
		},
		{
			title: 'Product Name',
			dataIndex: 'name',
			key: 'name',
			sorter: (a: any, b: any) => a.name.localeCompare(b.name),
			sortOrder: sortedInfo.columnKey === 'name' && sortedInfo.order,
		},
		{
			title: 'Category',
			dataIndex: 'category',
			key: 'category',
		},
		{
			title: 'Price',
			dataIndex: 'price',
			key: 'price',
			sorter: (a: any, b: any) => a.price - b.price,
			sortOrder: sortedInfo.columnKey === 'price' && sortedInfo.order,
		},
		{
			title: 'Stock Quantity',
			dataIndex: 'quantity',
			key: 'quantity',
			sorter: (a: any, b: any) => a.quantity - b.quantity,
			sortOrder: sortedInfo.columnKey === 'quantity' && sortedInfo.order,
		},
		{
			title: 'Status',
			dataIndex: 'quantity',
			key: 'status',
			render: (quantity: number) => {
				const status = getStatus(quantity);
				return <Tag color={status.color}>{status.text}</Tag>;
			},
		},
		{
			title: 'Actions',
			key: 'actions',
			render: (text: any, record: any) => <Button onClick={() => handleEdit(record)}>Edit</Button>,
		},
	];

	return (
		<>
			<Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
				<Col span={8}>
					<Input placeholder='Search by product name' onChange={(e) => setSearchText(e.target.value)} />
				</Col>
				<Col span={4}>
					<Select
						placeholder='Filter by category'
						onChange={(value) => setFilterCategory(value)}
						allowClear
						style={{ width: '100%' }}
					>
						{[...new Set(products.map((p) => p.category))].map((c) => (
							<Option key={c} value={c}>
								{c}
							</Option>
						))}
					</Select>
				</Col>
				<Col span={6}>
					<Select
						placeholder='Filter by price range'
						onChange={(value) => setFilterPrice(value)}
						allowClear
						style={{ width: '100%' }}
					>
						<Option value={[0, 10000000]}>0 - 10,000,000</Option>
						<Option value={[10000000, 20000000]}>10,000,000 - 20,000,000</Option>
						<Option value={[20000000, 30000000]}>20,000,000 - 30,000,000</Option>
					</Select>
				</Col>
				<Col span={6}>
					<Select
						placeholder='Filter by stock status'
						onChange={(value) => setFilterStatus(value)}
						allowClear
						style={{ width: '100%' }}
					>
						<Option value='In Stock'>In Stock</Option>
						<Option value='Low Stock'>Low Stock</Option>
						<Option value='Out of Stock'>Out of Stock</Option>
					</Select>
				</Col>
			</Row>
			<Table
				columns={columns}
				dataSource={filteredProducts}
				pagination={{ pageSize: 5 }}
				rowKey='id'
				onChange={handleChange}
			/>
			<Modal title='Edit Product' visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
				<Form form={form} layout='vertical'>
					<Form.Item name='name' label='Product Name' rules={[{ required: true }]}>
						<Input />
					</Form.Item>
					<Form.Item name='category' label='Category' rules={[{ required: true }]}>
						<Input />
					</Form.Item>
					<Form.Item name='price' label='Price' rules={[{ required: true }]}>
						<InputNumber min={0} style={{ width: '100%' }} />
					</Form.Item>
					<Form.Item name='quantity' label='Stock Quantity' rules={[{ required: true }]}>
						<InputNumber min={0} style={{ width: '100%' }} />
					</Form.Item>
				</Form>
			</Modal>
		</>
	);
};

export default ProductManagement;
