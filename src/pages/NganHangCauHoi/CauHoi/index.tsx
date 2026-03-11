import React, { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Table, Button, Space, Popconfirm, message, Modal, Form, Input, Select, Card, Row, Col } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { NganHangService, type CauHoi, type MonHoc, type KhoiKienThuc } from '@/services/NganHangService';
import TinyEditor from '@/components/TinyEditor';

const QuestionManagement: React.FC = () => {
	const [cauHoi, setCauHoi] = useState<CauHoi[]>([]);
	const [filteredCauHoi, setFilteredCauHoi] = useState<CauHoi[]>([]);
	const [monHoc, setMonHoc] = useState<MonHoc[]>([]);
	const [khoiKienThuc, setKhoiKienThuc] = useState<KhoiKienThuc[]>([]);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editingRecord, setEditingRecord] = useState<CauHoi | null>(null);
	const [form] = Form.useForm();
	const [searchForm] = Form.useForm();

	const loadData = () => {
		const q = NganHangService.getCauHoi();
		setCauHoi(q);
		setFilteredCauHoi(q);
		setMonHoc(NganHangService.getMonHoc());
		setKhoiKienThuc(NganHangService.getKhoiKienThuc());
	};

	useEffect(() => {
		loadData();
	}, []);

	const handleSearch = (values: any) => {
		let filtered = [...cauHoi];
		if (values.idMonHoc) {
			filtered = filtered.filter((q) => q.idMonHoc === values.idMonHoc);
		}
		if (values.idKhoiKienThuc) {
			filtered = filtered.filter((q) => q.idKhoiKienThuc === values.idKhoiKienThuc);
		}
		if (values.mucDo) {
			filtered = filtered.filter((q) => q.mucDo === values.mucDo);
		}
		setFilteredCauHoi(filtered);
	};

	const handleSave = (values: any) => {
		let newData;
		if (editingRecord) {
			newData = cauHoi.map((item) => (item.id === editingRecord.id ? { ...item, ...values } : item));
		} else {
			newData = [...cauHoi, { id: Date.now().toString(), ...values }];
		}
		setCauHoi(newData);
		NganHangService.saveCauHoi(newData);
		handleSearch(searchForm.getFieldsValue());
		setIsModalOpen(false);
		setEditingRecord(null);
		form.resetFields();
		message.success('Lưu thành công');
	};

	const handleDelete = (id: string) => {
		const newData = cauHoi.filter((item) => item.id !== id);
		setCauHoi(newData);
		NganHangService.saveCauHoi(newData);
		setFilteredCauHoi(
			newData.filter((q) => {
				const values = searchForm.getFieldsValue();
				return (
					(!values.idMonHoc || q.idMonHoc === values.idMonHoc) &&
					(!values.idKhoiKienThuc || q.idKhoiKienThuc === values.idKhoiKienThuc) &&
					(!values.mucDo || q.mucDo === values.mucDo)
				);
			}),
		);
		message.success('Xóa thành công');
	};

	const columns = [
		{
			title: 'Mã câu hỏi',
			dataIndex: 'maCauHoi',
			key: 'maCauHoi',
			width: 120,
		},
		{
			title: 'Môn học',
			dataIndex: 'idMonHoc',
			key: 'idMonHoc',
			render: (id: string) => monHoc.find((m) => m.id === id)?.tenMon,
			width: 200,
		},
		{
			title: 'Khối kiến thức',
			dataIndex: 'idKhoiKienThuc',
			key: 'idKhoiKienThuc',
			render: (id: string) => khoiKienThuc.find((k) => k.id === id)?.tenKhoi,
			width: 200,
		},
		{
			title: 'Mức độ',
			dataIndex: 'mucDo',
			key: 'mucDo',
			render: (text: string) => {
				let color = 'default';
				if (text === 'Dễ') color = 'green';
				if (text === 'Trung bình') color = 'blue';
				if (text === 'Khó') color = 'orange';
				if (text === 'Rất khó') color = 'red';
				return <span style={{ color }}>{text}</span>;
			},
			width: 120,
		},
		{
			title: 'Nội dung',
			dataIndex: 'noiDung',
			key: 'noiDung',
			ellipsis: true,
			render: (text: string) => <div dangerouslySetInnerHTML={{ __html: text }} />,
		},
		{
			title: 'Thao tác',
			key: 'action',
			width: 120,
			render: (_: any, record: CauHoi) => (
				<Space>
					<Button
						type='link'
						onClick={() => {
							setEditingRecord(record);
							form.setFieldsValue(record);
							setIsModalOpen(true);
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
		<PageContainer>
			<Card style={{ marginBottom: 16 }}>
				<Form form={searchForm} layout='inline' onValuesChange={handleSearch}>
					<Form.Item name='idMonHoc' label='Môn học'>
						<Select
							placeholder='Chọn môn học'
							style={{ width: 200 }}
							allowClear
							options={monHoc.map((m) => ({ label: m.tenMon, value: m.id }))}
						/>
					</Form.Item>
					<Form.Item name='idKhoiKienThuc' label='Khối kiến thức'>
						<Select
							placeholder='Chọn khối kiến thức'
							style={{ width: 200 }}
							allowClear
							options={khoiKienThuc.map((k) => ({ label: k.tenKhoi, value: k.id }))}
						/>
					</Form.Item>
					<Form.Item name='mucDo' label='Mức độ'>
						<Select placeholder='Chọn mức độ' style={{ width: 150 }} allowClear>
							<Select.Option value='Dễ'>Dễ</Select.Option>
							<Select.Option value='Trung bình'>Trung bình</Select.Option>
							<Select.Option value='Khó'>Khó</Select.Option>
							<Select.Option value='Rất khó'>Rất khó</Select.Option>
						</Select>
					</Form.Item>
					<Form.Item>
						<Button
							type='primary'
							icon={<PlusOutlined />}
							onClick={() => {
								setEditingRecord(null);
								form.resetFields();
								setIsModalOpen(true);
							}}
						>
							Thêm câu hỏi
						</Button>
					</Form.Item>
				</Form>
			</Card>

			<Table columns={columns} dataSource={filteredCauHoi} rowKey='id' pagination={{ pageSize: 10 }} />

			<Modal
				title={editingRecord ? 'Cập nhật câu hỏi' : 'Thêm câu hỏi mới'}
				visible={isModalOpen}
				onOk={() => form.submit()}
				onCancel={() => setIsModalOpen(false)}
				width={800}
				destroyOnClose
			>
				<Form form={form} layout='vertical' onFinish={handleSave}>
					<Row gutter={16}>
						<Col span={12}>
							<Form.Item name='maCauHoi' label='Mã câu hỏi' rules={[{ required: true }]}>
								<Input />
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item name='mucDo' label='Mức độ' rules={[{ required: true }]}>
								<Select>
									<Select.Option value='Dễ'>Dễ</Select.Option>
									<Select.Option value='Trung bình'>Trung bình</Select.Option>
									<Select.Option value='Khó'>Khó</Select.Option>
									<Select.Option value='Rất khó'>Rất khó</Select.Option>
								</Select>
							</Form.Item>
						</Col>
					</Row>

					<Row gutter={16}>
						<Col span={12}>
							<Form.Item name='idMonHoc' label='Môn học' rules={[{ required: true }]}>
								<Select options={monHoc.map((m) => ({ label: m.tenMon, value: m.id }))} />
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item name='idKhoiKienThuc' label='Khối kiến thức' rules={[{ required: true }]}>
								<Select options={khoiKienThuc.map((k) => ({ label: k.tenKhoi, value: k.id }))} />
							</Form.Item>
						</Col>
					</Row>

					<Form.Item name='noiDung' label='Nội dung câu hỏi' rules={[{ required: true }]}>
						<TinyEditor
							value={form.getFieldValue('noiDung')}
							onChange={(content) => form.setFieldsValue({ noiDung: content })}
						/>
					</Form.Item>
				</Form>
			</Modal>
		</PageContainer>
	);
};

export default QuestionManagement;
