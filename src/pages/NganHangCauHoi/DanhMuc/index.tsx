import React, { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Tabs, Table, Button, Space, Popconfirm, message, Modal, Form, Input, InputNumber, Card } from 'antd';
import { BookOutlined, ClusterOutlined, PlusOutlined } from '@ant-design/icons';
import { NganHangService, type MonHoc, type KhoiKienThuc } from '@/services/NganHangService';

const { TabPane } = Tabs;

const DanhMuc: React.FC = () => {
	const [monHoc, setMonHoc] = useState<MonHoc[]>([]);
	const [khoiKienThuc, setKhoiKienThuc] = useState<KhoiKienThuc[]>([]);
	const [visible, setVisible] = useState(false);
	const [activeTab, setActiveTab] = useState('mon-hoc');
	const [editingRecord, setEditingRecord] = useState<any>(null);
	const [form] = Form.useForm();

	const loadData = () => {
		setMonHoc(NganHangService.getMonHoc());
		setKhoiKienThuc(NganHangService.getKhoiKienThuc());
	};

	useEffect(() => {
		loadData();
	}, []);

	const handleSave = (values: any) => {
		if (activeTab === 'mon-hoc') {
			let newData;
			if (editingRecord) {
				newData = monHoc.map((item) => (item.id === editingRecord.id ? { ...item, ...values } : item));
			} else {
				newData = [...monHoc, { id: Date.now().toString(), ...values }];
			}
			setMonHoc(newData);
			NganHangService.saveMonHoc(newData);
		} else {
			let newData;
			if (editingRecord) {
				newData = khoiKienThuc.map((item) => (item.id === editingRecord.id ? { ...item, ...values } : item));
			} else {
				newData = [...khoiKienThuc, { id: Date.now().toString(), ...values }];
			}
			setKhoiKienThuc(newData);
			NganHangService.saveKhoiKienThuc(newData);
		}
		setVisible(false);
		setEditingRecord(null);
		form.resetFields();
		message.success('Lưu thành công');
	};

	const handleDelete = (id: string) => {
		if (activeTab === 'mon-hoc') {
			const newData = monHoc.filter((item) => item.id !== id);
			setMonHoc(newData);
			NganHangService.saveMonHoc(newData);
		} else {
			const newData = khoiKienThuc.filter((item) => item.id !== id);
			setKhoiKienThuc(newData);
			NganHangService.saveKhoiKienThuc(newData);
		}
		message.success('Xóa thành công');
	};

	const columnsMonHoc = [
		{ title: 'Mã môn', dataIndex: 'maMon', key: 'maMon' },
		{ title: 'Tên môn', dataIndex: 'tenMon', key: 'tenMon' },
		{ title: 'Số tín chỉ', dataIndex: 'soTinChi', key: 'soTinChi' },
		{
			title: 'Thao tác',
			key: 'action',
			render: (_: any, record: MonHoc) => (
				<Space>
					<Button
						type='link'
						onClick={() => {
							setEditingRecord(record);
							form.setFieldsValue(record);
							setVisible(true);
						}}
					>
						Sửa
					</Button>
					<Popconfirm title='Chắc chắn xóa?' onConfirm={() => handleDelete(record.id)}>
						<Button type='link' danger>
							Xóa
						</Button>
					</Popconfirm>
				</Space>
			),
		},
	];

	const columnsKhoi = [
		{ title: 'Tên khối kiến thức', dataIndex: 'tenKhoi', key: 'tenKhoi' },
		{
			title: 'Thao tác',
			key: 'action',
			render: (_: any, record: KhoiKienThuc) => (
				<Space>
					<Button
						type='link'
						onClick={() => {
							setEditingRecord(record);
							form.setFieldsValue(record);
							setVisible(true);
						}}
					>
						Sửa
					</Button>
					<Popconfirm title='Chắc chắn xóa?' onConfirm={() => handleDelete(record.id)}>
						<Button type='link' danger>
							Xóa
						</Button>
					</Popconfirm>
				</Space>
			),
		},
	];

	return (
		<PageContainer title='Quản lý danh mục'>
			<Card>
				<Tabs activeKey={activeTab} onChange={(key) => setActiveTab(key)} type='card'>
					<TabPane
						tab={
							<span>
								<BookOutlined /> Môn học
							</span>
						}
						key='mon-hoc'
					>
						<div style={{ marginBottom: 16 }}>
							<Button
								type='primary'
								icon={<PlusOutlined />}
								onClick={() => {
									setEditingRecord(null);
									form.resetFields();
									setVisible(true);
								}}
							>
								Thêm môn học
							</Button>
						</div>
						<Table columns={columnsMonHoc} dataSource={monHoc} rowKey='id' pagination={{ pageSize: 10 }} />
					</TabPane>
					<TabPane
						tab={
							<span>
								<ClusterOutlined /> Khối kiến thức
							</span>
						}
						key='khoi-kien-thuc'
					>
						<div style={{ marginBottom: 16 }}>
							<Button
								type='primary'
								icon={<PlusOutlined />}
								onClick={() => {
									setEditingRecord(null);
									form.resetFields();
									setVisible(true);
								}}
							>
								Thêm khối kiến thức
							</Button>
						</div>
						<Table columns={columnsKhoi} dataSource={khoiKienThuc} rowKey='id' pagination={{ pageSize: 10 }} />
					</TabPane>
				</Tabs>
			</Card>

			<Modal
				title={
					editingRecord
						? activeTab === 'mon-hoc'
							? 'Cập nhật môn học'
							: 'Cập nhật khối kiến thức'
						: activeTab === 'mon-hoc'
						? 'Thêm môn học mới'
						: 'Thêm khối kiến thức mới'
				}
				visible={visible}
				onOk={() => form.submit()}
				onCancel={() => {
					setVisible(false);
					setEditingRecord(null);
				}}
				destroyOnClose
			>
				<Form form={form} layout='vertical' onFinish={handleSave}>
					{activeTab === 'mon-hoc' ? (
						<>
							<Form.Item name='maMon' label='Mã môn' rules={[{ required: true, message: 'Vui lòng nhập mã môn' }]}>
								<Input placeholder='Ví dụ: IT101' />
							</Form.Item>
							<Form.Item name='tenMon' label='Tên môn' rules={[{ required: true, message: 'Vui lòng nhập tên môn' }]}>
								<Input placeholder='Ví dụ: Cơ sở dữ liệu' />
							</Form.Item>
							<Form.Item
								name='soTinChi'
								label='Số tín chỉ'
								rules={[{ required: true, message: 'Vui lòng nhập số tín chỉ' }]}
							>
								<InputNumber min={1} style={{ width: '100%' }} placeholder='Ví dụ: 3' />
							</Form.Item>
						</>
					) : (
						<Form.Item
							name='tenKhoi'
							label='Tên khối kiến thức'
							rules={[{ required: true, message: 'Vui lòng nhập tên khối kiến thức' }]}
						>
							<Input placeholder='Ví dụ: Chuyên sâu' />
						</Form.Item>
					)}
				</Form>
			</Modal>
		</PageContainer>
	);
};

export default DanhMuc;
