import React, { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import {
	Table,
	Button,
	message,
	Modal,
	Form,
	Select,
	Input,
	Space,
	Row,
	Col,
	Card,
	Popconfirm,
	Tabs,
	Typography,
	Divider,
	Tag,
} from 'antd';
import { PlusOutlined, MinusCircleOutlined, EyeOutlined, DeleteOutlined, SaveOutlined } from '@ant-design/icons';
import {
	NganHangService,
	type DeThi,
	type MonHoc,
	type CauHoi,
	type KhoiKienThuc,
	type CauTrucDe,
} from '@/services/NganHangService';
import { sampleSize } from 'lodash';

const { TabPane } = Tabs;
const { Title, Text } = Typography;

const ExamManagement: React.FC = () => {
	const [deThi, setDeThi] = useState<DeThi[]>([]);
	const [cauTrucDe, setCauTrucDe] = useState<CauTrucDe[]>([]);
	const [monHoc, setMonHoc] = useState<MonHoc[]>([]);
	const [khoiKienThuc, setKhoiKienThuc] = useState<KhoiKienThuc[]>([]);
	const [cauHoi, setCauHoi] = useState<CauHoi[]>([]);

	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
	const [isViewModalOpen, setIsViewModalOpen] = useState(false);
	const [selectedDeThi, setSelectedDeThi] = useState<DeThi | null>(null);
	const [form] = Form.useForm();

	const loadData = () => {
		setDeThi(NganHangService.getDeThi());
		setCauTrucDe(NganHangService.getCauTrucDe());
		setMonHoc(NganHangService.getMonHoc());
		setKhoiKienThuc(NganHangService.getKhoiKienThuc());
		setCauHoi(NganHangService.getCauHoi());
	};

	useEffect(() => {
		loadData();
	}, []);

	const handleSaveStructure = () => {
		const values = form.getFieldsValue();
		if (!values.tenDeThi || !values.idMonHoc || !values.cauHinh || values.cauHinh.length === 0) {
			message.error('Vui lòng điền đầy đủ thông tin trước khi lưu cấu trúc');
			return;
		}

		const newStructure: CauTrucDe = {
			id: Date.now().toString(),
			tenCauTruc: `Cấu trúc: ${values.tenDeThi}`,
			idMonHoc: values.idMonHoc,
			cauHinh: values.cauHinh,
		};

		const newData = [...cauTrucDe, newStructure];
		setCauTrucDe(newData);
		NganHangService.saveCauTrucDe(newData);
		message.success('Đã lưu cấu trúc đề thi thành công');
	};

	const handleApplyStructure = (structureId: string) => {
		const structure = cauTrucDe.find((s) => s.id === structureId);
		if (structure) {
			form.setFieldsValue({
				idMonHoc: structure.idMonHoc,
				cauHinh: structure.cauHinh,
			});
			message.success('Đã áp dụng cấu trúc');
		}
	};

	const handleGenerate = (values: any) => {
		const { idMonHoc, tenDeThi, cauHinh } = values;
		if (!cauHinh || cauHinh.length === 0) {
			message.error('Vui lòng thêm cấu trúc đề thi');
			return;
		}

		const selectedCauHoiIds: string[] = [];

		for (const config of cauHinh) {
			const pool = cauHoi.filter(
				(q) => q.idMonHoc === idMonHoc && q.idKhoiKienThuc === config.idKhoiKienThuc && q.mucDo === config.mucDo,
			);

			if (pool.length < config.soLuong) {
				const khoi = khoiKienThuc.find((k) => k.id === config.idKhoiKienThuc)?.tenKhoi;
				message.error(`Không đủ câu hỏi: ${khoi} - ${config.mucDo} (Có: ${pool.length}, Cần: ${config.soLuong})`);
				return;
			}

			const sampled = sampleSize(pool, config.soLuong);
			selectedCauHoiIds.push(...sampled.map((s) => s.id));
		}

		const newDeThi: DeThi = {
			id: Date.now().toString(),
			tenDeThi,
			idMonHoc,
			danhSachCauHoi: selectedCauHoiIds,
			ngayTao: new Date().toLocaleString(),
		};

		const newData = [...deThi, newDeThi];
		setDeThi(newData);
		NganHangService.saveDeThi(newData);
		setIsCreateModalOpen(false);
		form.resetFields();
		message.success('Tạo đề thi thành công');
	};

	const columnsDeThi = [
		{ title: 'Tên đề thi', dataIndex: 'tenDeThi', key: 'tenDeThi' },
		{
			title: 'Môn học',
			dataIndex: 'idMonHoc',
			key: 'idMonHoc',
			render: (id: string) => monHoc.find((m) => m.id === id)?.tenMon,
		},
		{
			title: 'Số câu hỏi',
			dataIndex: 'danhSachCauHoi',
			key: 'danhSachCauHoi',
			render: (val: any[]) => val?.length || 0,
		},
		{ title: 'Ngày tạo', dataIndex: 'ngayTao', key: 'ngayTao' },
		{
			title: 'Thao tác',
			key: 'action',
			render: (_: any, record: DeThi) => (
				<Space>
					<Button
						type='link'
						icon={<EyeOutlined />}
						onClick={() => {
							setSelectedDeThi(record);
							setIsViewModalOpen(true);
						}}
					>
						Xem đề
					</Button>
					<Popconfirm
						title='Chắc chắn xóa?'
						onConfirm={() => {
							const newData = deThi.filter((d) => d.id !== record.id);
							setDeThi(newData);
							NganHangService.saveDeThi(newData);
							message.success('Đã xóa đề thi');
						}}
					>
						<Button type='link' danger icon={<DeleteOutlined />}>
							Xóa
						</Button>
					</Popconfirm>
				</Space>
			),
		},
	];

	const columnsCauTruc = [
		{ title: 'Tên cấu trúc', dataIndex: 'tenCauTruc', key: 'tenCauTruc' },
		{
			title: 'Môn học',
			dataIndex: 'idMonHoc',
			key: 'idMonHoc',
			render: (id: string) => monHoc.find((m) => m.id === id)?.tenMon,
		},
		{
			title: 'Cấu hình',
			dataIndex: 'cauHinh',
			key: 'cauHinh',
			render: (val: any[]) => (
				<ul style={{ paddingLeft: 16, margin: 0 }}>
					{val.map((c, i) => (
						<li key={i}>
							{khoiKienThuc.find((k) => k.id === c.idKhoiKienThuc)?.tenKhoi} - {c.mucDo}: {c.soLuong} câu
						</li>
					))}
				</ul>
			),
		},
		{
			title: 'Thao tác',
			key: 'action',
			render: (_: any, record: CauTrucDe) => (
				<Space>
					<Button
						type='link'
						onClick={() => {
							setIsCreateModalOpen(true);
							setTimeout(() => {
								form.setFieldsValue({
									tenDeThi: record.tenCauTruc.replace('Cấu trúc: ', ''),
									idMonHoc: record.idMonHoc,
									cauHinh: record.cauHinh,
								});
							}, 0);
						}}
					>
						Sử dụng
					</Button>
					<Popconfirm
						title='Xóa cấu trúc này?'
						onConfirm={() => {
							const newData = cauTrucDe.filter((s) => s.id !== record.id);
							setCauTrucDe(newData);
							NganHangService.saveCauTrucDe(newData);
							message.success('Đã xóa cấu trúc');
						}}
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
		<PageContainer>
			<Tabs type='card'>
				<TabPane tab='Danh sách đề thi' key='list'>
					<div style={{ marginBottom: 16 }}>
						<Button
							type='primary'
							icon={<PlusOutlined />}
							onClick={() => {
								form.resetFields();
								setIsCreateModalOpen(true);
							}}
						>
							Tạo đề thi mới
						</Button>
					</div>
					<Table columns={columnsDeThi} dataSource={deThi} rowKey='id' />
				</TabPane>
				<TabPane tab='Cấu trúc đề (Mẫu)' key='templates'>
					<Table columns={columnsCauTruc} dataSource={cauTrucDe} rowKey='id' />
				</TabPane>
			</Tabs>

			{/* Modal Tạo Đề */}
			<Modal
				title='Thiết lập đề thi'
				visible={isCreateModalOpen}
				onOk={() => form.submit()}
				onCancel={() => setIsCreateModalOpen(false)}
				width={900}
				destroyOnClose
				footer={[
					<Button key='cancel' onClick={() => setIsCreateModalOpen(false)}>
						Hủy
					</Button>,
					<Button key='save-structure' icon={<SaveOutlined />} onClick={handleSaveStructure}>
						Lưu cấu trúc
					</Button>,
					<Button key='submit' type='primary' onClick={() => form.submit()}>
						Tạo đề ngay
					</Button>,
				]}
			>
				<Form form={form} layout='vertical' onFinish={handleGenerate}>
					<Row gutter={24}>
						<Col span={14}>
							<Form.Item name='tenDeThi' label='Tên đề thi' rules={[{ required: true }]}>
								<Input placeholder='Nhập tên đề thi' />
							</Form.Item>
						</Col>
						<Col span={10}>
							<Form.Item name='idMonHoc' label='Môn học' rules={[{ required: true }]}>
								<Select placeholder='Chọn môn học' options={monHoc.map((m) => ({ label: m.tenMon, value: m.id }))} />
							</Form.Item>
						</Col>
					</Row>

					{cauTrucDe.length > 0 && (
						<Form.Item label='Chọn từ cấu trúc mẫu (Tùy chọn)'>
							<Select
								placeholder='Chọn một cấu trúc đã lưu'
								allowClear
								onChange={handleApplyStructure}
								options={cauTrucDe.map((s) => ({ label: s.tenCauTruc, value: s.id }))}
							/>
						</Form.Item>
					)}

					<Card size='small' title='Cấu trúc chi tiết' style={{ marginTop: 16 }}>
						<Form.List name='cauHinh'>
							{(fields, { add, remove }) => (
								<>
									{fields.map(({ key, name, ...restField }) => (
										<Space key={key} style={{ display: 'flex', marginBottom: 8 }} align='baseline'>
											<Form.Item
												{...restField}
												name={[name, 'idKhoiKienThuc']}
												rules={[{ required: true, message: 'Thiếu khối' }]}
											>
												<Select
													placeholder='Khối kiến thức'
													style={{ width: 320 }}
													options={khoiKienThuc.map((k) => ({ label: k.tenKhoi, value: k.id }))}
												/>
											</Form.Item>
											<Form.Item
												{...restField}
												name={[name, 'mucDo']}
												rules={[{ required: true, message: 'Thiếu mức độ' }]}
											>
												<Select placeholder='Mức độ' style={{ width: 140 }}>
													{['Dễ', 'Trung bình', 'Khó', 'Rất khó'].map((m) => (
														<Select.Option key={m} value={m}>
															{m}
														</Select.Option>
													))}
												</Select>
											</Form.Item>
											<Form.Item
												{...restField}
												name={[name, 'soLuong']}
												rules={[{ required: true, message: 'Thiếu SL' }]}
											>
												<Input type='number' min={1} placeholder='SL' style={{ width: 80 }} />
											</Form.Item>
											<MinusCircleOutlined onClick={() => remove(name)} />
										</Space>
									))}
									<Form.Item>
										<Button type='dashed' onClick={() => add()} block icon={<PlusOutlined />}>
											Thêm quy tắc bốc câu hỏi
										</Button>
									</Form.Item>
								</>
							)}
						</Form.List>
					</Card>
				</Form>
			</Modal>

			{/* Modal Xem Đề */}
			<Modal
				title={selectedDeThi?.tenDeThi}
				visible={isViewModalOpen}
				onCancel={() => setIsViewModalOpen(false)}
				width={1000}
				footer={null}
				destroyOnClose
			>
				{selectedDeThi && (
					<div className='exam-viewer'>
						<div style={{ textAlign: 'center', marginBottom: 24 }}>
							<Title level={3}>ĐỀ THI TỰ LUẬN</Title>
							<Text strong>Môn: {monHoc.find((m) => m.id === selectedDeThi.idMonHoc)?.tenMon}</Text>
							<br />
							<Text italic>Ngày tạo: {selectedDeThi.ngayTao}</Text>
						</div>
						<Divider />
						{selectedDeThi.danhSachCauHoi.map((qid, index) => {
							const q = cauHoi.find((item) => item.id === qid);
							return (
								<div key={qid} style={{ marginBottom: 24 }}>
									<Text strong>Câu {index + 1}: </Text>
									<div
										dangerouslySetInnerHTML={{ __html: q?.noiDung || '' }}
										style={{ marginTop: 8, paddingLeft: 16 }}
									/>
									<div style={{ marginTop: 8, textAlign: 'right' }}>
										<Tag color='blue'>{q?.mucDo}</Tag>
										<Tag color='cyan'>{khoiKienThuc.find((k) => k.id === q?.idKhoiKienThuc)?.tenKhoi}</Tag>
									</div>
									<Divider dashed />
								</div>
							);
						})}
					</div>
				)}
			</Modal>
		</PageContainer>
	);
};

export default ExamManagement;
