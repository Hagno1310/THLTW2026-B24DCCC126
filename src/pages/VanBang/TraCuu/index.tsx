import { Button, Card, Col, DatePicker, Form, Input, Row, Table, Typography, message, Modal, Descriptions } from 'antd';
import moment from 'moment';
import { useState, useEffect } from 'react';
import { useModel } from 'umi';

const { Title } = Typography;

const TraCuuPage = () => {
	const [form] = Form.useForm();
	const { getModel, loading, record: detailRecord, getByIdModel } = useModel('vanbang.thongtin');
	const { getAllModel: getAllCauHinh, danhSach: dsCauHinh } = useModel('vanbang.cauhinh');

	const [data, setData] = useState<VanBang.IThongTinVanBang[]>([]);
	const [visibleDetail, setVisibleDetail] = useState(false);

	useEffect(() => {
		getAllCauHinh();
	}, []);

	const onSearch = async (values: any) => {
		// Trim all string values in the form
		const trimmedValues: any = {};
		Object.keys(values).forEach((key) => {
			const val = values[key];
			trimmedValues[key] = typeof val === 'string' ? val.trim() : val;
		});

		// Count non-empty values from trimmed values
		const searchParams = Object.keys(trimmedValues).filter(
			(key) => trimmedValues[key] !== undefined && trimmedValues[key] !== '',
		);

		if (searchParams.length < 2) {
			message.error('Vui lòng nhập ít nhất 2 tham số để tra cứu');
			return;
		}

		const payload = {
			...trimmedValues,
			ngaySinh: trimmedValues.ngaySinh ? trimmedValues.ngaySinh.format('YYYY-MM-DD') : undefined,
		};

		try {
			const res = await getModel(payload, undefined, undefined, 1, 100);
			setData(res || []);
			if (!res || res.length === 0) {
				message.info('Không tìm thấy thông tin văn bằng phù hợp');
			}
		} catch (error) {
			console.error(error);
		}
	};

	const handleViewDetail = async (item: VanBang.IThongTinVanBang) => {
		try {
			await getByIdModel(item._id, true);
			setVisibleDetail(true);
		} catch (error) {
			message.error('Không thể lấy thông tin chi tiết');
		}
	};

	const columns = [
		{ title: 'Số hiệu VB', dataIndex: 'soHieuVanBang', key: 'soHieuVanBang' },
		{ title: 'Số vào sổ', dataIndex: 'soVaoSo', key: 'soVaoSo' },
		{ title: 'MSV', dataIndex: 'maSV', key: 'maSV' },
		{ title: 'Họ tên', dataIndex: 'hoTen', key: 'hoTen' },
		{
			title: 'Ngày sinh',
			dataIndex: 'ngaySinh',
			key: 'ngaySinh',
			render: (val: string) => moment(val).format('DD/MM/YYYY'),
		},
		{
			title: 'Thao tác',
			key: 'action',
			render: (item: VanBang.IThongTinVanBang) => (
				<Button type='link' onClick={() => handleViewDetail(item)}>
					Chi tiết
				</Button>
			),
		},
	];

	return (
		<div style={{ padding: '20px' }}>
			<Card>
				<div style={{ textAlign: 'center', marginBottom: '30px' }}>
					<Title level={2}>TRA CỨU THÔNG TIN VĂN BẰNG</Title>
					<Typography.Text type='secondary'>Nhập ít nhất 2 tham số để thực hiện tìm kiếm</Typography.Text>
				</div>

				<Form form={form} onFinish={onSearch} layout='vertical'>
					<Row gutter={16}>
						<Col xs={24} md={8}>
							<Form.Item name='soHieuVanBang' label='Số hiệu văn bằng'>
								<Input placeholder='Nhập số hiệu văn bằng' />
							</Form.Item>
						</Col>
						<Col xs={24} md={8}>
							<Form.Item name='soVaoSo' label='Số vào sổ'>
								<Input placeholder='Nhập số vào sổ' />
							</Form.Item>
						</Col>
						<Col xs={24} md={8}>
							<Form.Item name='maSV' label='Mã sinh viên'>
								<Input placeholder='Nhập mã sinh viên' />
							</Form.Item>
						</Col>
						<Col xs={24} md={12}>
							<Form.Item name='hoTen' label='Họ và tên'>
								<Input placeholder='Nhập họ và tên' />
							</Form.Item>
						</Col>
						<Col xs={24} md={12}>
							<Form.Item name='ngaySinh' label='Ngày sinh'>
								<DatePicker style={{ width: '100%' }} format='DD/MM/YYYY' placeholder='Chọn ngày sinh' />
							</Form.Item>
						</Col>
					</Row>
					<div style={{ textAlign: 'center', marginTop: '10px' }}>
						<Button type='primary' htmlType='submit' size='large' loading={loading}>
							Tra cứu ngay
						</Button>
						<Button
							style={{ marginLeft: '10px' }}
							onClick={() => {
								form.resetFields();
								setData([]);
							}}
						>
							Đặt lại
						</Button>
					</div>
				</Form>
			</Card>

			{data.length > 0 && (
				<Card style={{ marginTop: '20px' }}>
					<Table dataSource={data} columns={columns} rowKey='_id' pagination={{ pageSize: 10 }} />
				</Card>
			)}

			<Modal
				title='THÔNG TIN CHI TIẾT VĂN BẰNG'
				visible={visibleDetail}
				onCancel={() => setVisibleDetail(false)}
				footer={[
					<Button key='close' onClick={() => setVisibleDetail(false)}>
						Đóng
					</Button>,
				]}
				width={700}
			>
				{detailRecord && (
					<Descriptions bordered column={1}>
						<Descriptions.Item label='Họ và tên'>{detailRecord.hoTen}</Descriptions.Item>
						<Descriptions.Item label='Mã sinh viên'>{detailRecord.maSV}</Descriptions.Item>
						<Descriptions.Item label='Ngày sinh'>
							{moment(detailRecord.ngaySinh).format('DD/MM/YYYY')}
						</Descriptions.Item>
						<Descriptions.Item label='Số hiệu văn bằng'>{detailRecord.soHieuVanBang}</Descriptions.Item>
						<Descriptions.Item label='Số vào sổ'>{detailRecord.soVaoSo}</Descriptions.Item>

						{/* Dynamic fields from phuLuc */}
						{dsCauHinh.map((config: VanBang.ICauHinh) => {
							const val = detailRecord.phuLuc?.[config.ma];
							if (val === undefined || val === null) return null;
							return (
								<Descriptions.Item key={config._id} label={config.ten}>
									{config.kieuDuLieu === 'Date' ? moment(val).format('DD/MM/YYYY') : val}
								</Descriptions.Item>
							);
						})}
					</Descriptions>
				)}
			</Modal>
		</div>
	);
};

export default TraCuuPage;
