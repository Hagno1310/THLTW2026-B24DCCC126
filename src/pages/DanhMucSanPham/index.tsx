import { useState } from 'react';
import { Table, Button, Space, Popconfirm, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import FormModal, { type Product } from './components/FormModal';

const initialData: Product[] = [
	{ id: 1, name: 'Laptop Dell XPS 13', price: 25000000, quantity: 10 },
	{ id: 2, name: 'iPhone 15 Pro Max', price: 30000000, quantity: 15 },
	{ id: 3, name: 'Samsung Galaxy S24', price: 22000000, quantity: 20 },
	{ id: 4, name: 'iPad Air M2', price: 18000000, quantity: 12 },
	{ id: 5, name: 'MacBook Air M3', price: 28000000, quantity: 8 },
];

const SanPham: React.FC = () => {
	const [dataSource, setDataSource] = useState<Product[]>(initialData);
	const [open, setOpen] = useState(false);
	const [editingProduct, setEditingProduct] = useState<Product | null>(null);

	const handleAdd = () => {
		setEditingProduct(null);
		setOpen(true);
	};

	const handleEdit = (record: Product) => {
		setEditingProduct(record);
		setOpen(true);
	};

	const handleDelete = (id: number) => {
		setDataSource((prev) => prev.filter((item) => item.id !== id));
		message.success('Đã xóa sản phẩm thành công');
	};

	const handleSubmit = (values: Omit<Product, 'id'>) => {
		if (editingProduct) {
			setDataSource((prev) => prev.map((item) => (item.id === editingProduct.id ? { ...item, ...values } : item)));
			message.success('Cập nhật sản phẩm thành công');
		} else {
			setDataSource((prev) => [...prev, { id: Date.now(), ...values }]);
			message.success('Thêm sản phẩm thành công');
		}

		setOpen(false);
		setEditingProduct(null);
	};

	const columns: ColumnsType<Product> = [
		{
			title: 'STT',
			key: 'stt',
			render: (_text, _record, index) => index + 1,
			width: 80,
		},
		{
			title: 'Tên sản phẩm',
			dataIndex: 'name',
			key: 'name',
		},
		{
			title: 'Giá',
			dataIndex: 'price',
			key: 'price',
			render: (value: number) => value.toLocaleString('vi-VN') + ' ₫',
			align: 'right',
			width: 140,
		},
		{
			title: 'Số lượng',
			dataIndex: 'quantity',
			key: 'quantity',
			align: 'center',
			width: 120,
		},
		{
			title: 'Thao tác',
			key: 'actions',
			width: 180,
			render: (_text, record) => (
				<Space>
					<Button type='link' onClick={() => handleEdit(record)}>
						Sửa
					</Button>
					<Popconfirm
						title='Bạn có chắc muốn xóa?'
						onConfirm={() => handleDelete(record.id)}
						okText='Xóa'
						cancelText='Hủy'
					>
						<Button type='link' danger>
							Xóa
						</Button>
					</Popconfirm>
				</Space>
			),
		},
	];

	return (
		<div>
			<Space style={{ marginBottom: 16 }}>
				<Button type='primary' onClick={handleAdd}>
					Thêm sản phẩm
				</Button>
			</Space>

			<Table<Product> rowKey='id' columns={columns} dataSource={dataSource} pagination={{ pageSize: 8 }} />

			<FormModal
				open={open}
				onCancel={() => {
					setOpen(false);
					setEditingProduct(null);
				}}
				onSubmit={handleSubmit}
				initialValues={editingProduct}
			/>
		</div>
	);
};

export default SanPham;
