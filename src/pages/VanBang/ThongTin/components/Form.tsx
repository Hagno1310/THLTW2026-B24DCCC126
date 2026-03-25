import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Col, DatePicker, Form, Input, InputNumber, Row, Select, Divider } from 'antd';
import moment from 'moment';
import { useEffect } from 'react';
import { useModel } from 'umi';

const FormThongTin = (props: any) => {
	const [form] = Form.useForm();
	const { record, setVisibleForm, edit, isView, postModel, putModel, formSubmiting, visibleForm } =
		useModel('vanbang.thongtin');
	const { getAllModel: getAllQuyetDinh, danhSach: dsQuyetDinh } = useModel('vanbang.quyetdinh');
	const { getAllModel: getAllCauHinh, danhSach: dsCauHinh } = useModel('vanbang.cauhinh');
	const {
		getAllModel: getAllSoVanBang,
		danhSach: dsSoVanBang,
		putModel: putModelSoVanBang,
	} = useModel('vanbang.sovanbang');

	useEffect(() => {
		getAllQuyetDinh();
		getAllCauHinh();
		getAllSoVanBang();
	}, []);

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else if (record?._id) {
			// Prepare form values, including dynamic ones from phuLuc
			const formValues: any = {
				...record,
				ngaySinh: record.ngaySinh ? moment(record.ngaySinh) : undefined,
			};

			// Extract phuLuc values and set them with 'phuLuc.' prefix
			if (record.phuLuc) {
				Object.keys(record.phuLuc).forEach((key) => {
					const config = dsCauHinh.find((c) => c.ma === key);
					if (config?.kieuDuLieu === 'Date' && record.phuLuc[key]) {
						formValues[`phuLuc.${key}`] = moment(record.phuLuc[key]);
					} else {
						formValues[`phuLuc.${key}`] = record.phuLuc[key];
					}
				});
			}
			form.setFieldsValue(formValues);
		}
	}, [record?._id, visibleForm, dsCauHinh]);

	const onFinish = async (values: any) => {
		const phuLuc: Record<string, any> = {};
		const mainValues: any = {};

		Object.keys(values).forEach((key) => {
			if (key.startsWith('phuLuc.')) {
				const fieldMa = key.replace('phuLuc.', '');
				const config = dsCauHinh.find((c) => c.ma === fieldMa);
				let val = values[key];
				if (config?.kieuDuLieu === 'Date' && val) {
					val = val.toISOString();
				}
				phuLuc[fieldMa] = val;
			} else {
				mainValues[key] = values[key];
			}
		});

		const payload = {
			...mainValues,
			ngaySinh: mainValues.ngaySinh?.toISOString(),
			phuLuc,
		};

		if (edit) {
			putModel(record?._id ?? '', payload);
		} else {
			postModel(payload).then(() => {
				// Cập nhật số vào sổ hiện tại trong Sổ văn bằng
				const qd = dsQuyetDinh.find((i) => i._id === values.idQuyetDinh);
				if (qd) {
					const so = dsSoVanBang.find((s) => s._id === qd.idSoVanBang);
					if (so) {
						putModelSoVanBang(so._id, { soVaoSoHienTai: (so.soVaoSoHienTai || 0) + 1 });
					}
				}
				form.resetFields();
			});
		}
	};

	const onQuyetDinhChange = (idQD: string) => {
		if (edit) return;
		const qd = dsQuyetDinh.find((i) => i._id === idQD);
		if (qd) {
			const so = dsSoVanBang.find((s) => s._id === qd.idSoVanBang);
			if (so) {
				form.setFieldsValue({ soVaoSo: (so.soVaoSoHienTai || 0) + 1 });
			}
		}
	};

	const renderDynamicField = (config: VanBang.ICauHinh) => {
		const name = `phuLuc.${config.ma}`;
		const label = config.ten;

		switch (config.kieuDuLieu) {
			case 'Number':
				return (
					<Form.Item name={name} label={label}>
						<InputNumber style={{ width: '100%' }} placeholder={`Nhập ${label.toLowerCase()}`} disabled={isView} />
					</Form.Item>
				);
			case 'Date':
				return (
					<Form.Item name={name} label={label}>
						<DatePicker style={{ width: '100%' }} format='DD/MM/YYYY' disabled={isView} />
					</Form.Item>
				);
			default:
				return (
					<Form.Item name={name} label={label}>
						<Input placeholder={`Nhập ${label.toLowerCase()}`} disabled={isView} />
					</Form.Item>
				);
		}
	};

	return (
		<Card
			title={(isView ? 'Chi tiết ' : edit ? 'Chỉnh sửa ' : 'Thêm mới ') + 'thông tin văn bằng'}
			style={{ width: 800 }}
		>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={16}>
					<Col span={12}>
						<Form.Item name='idQuyetDinh' label='Quyết định tốt nghiệp' rules={[...rules.required]}>
							<Select placeholder='Chọn quyết định' onChange={onQuyetDinhChange} disabled={isView}>
								{dsQuyetDinh.map((item) => (
									<Select.Option key={item._id} value={item._id}>
										{item.soQD} - {moment(item.ngayBanHanh).format('DD/MM/YYYY')}
									</Select.Option>
								))}
							</Select>
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item name='soVaoSo' label='Số vào sổ' tooltip='Tự động tăng theo sổ văn bằng'>
							<InputNumber style={{ width: '100%' }} disabled />
						</Form.Item>
					</Col>
				</Row>

				<Divider orientation='left'>Thông tin cơ bản</Divider>
				<Row gutter={16}>
					<Col span={12}>
						<Form.Item name='maSV' label='Mã sinh viên' rules={[...rules.required, ...rules.text]}>
							<Input placeholder='Mã sinh viên' disabled={isView} />
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item name='hoTen' label='Họ và tên' rules={[...rules.required, ...rules.text]}>
							<Input placeholder='Họ và tên' disabled={isView} />
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item name='ngaySinh' label='Ngày sinh' rules={[...rules.required]}>
							<DatePicker style={{ width: '100%' }} format='DD/MM/YYYY' disabled={isView} />
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item name='soHieuVanBang' label='Số hiệu văn bằng' rules={[...rules.required, ...rules.text]}>
							<Input placeholder='Số hiệu văn bằng' disabled={isView} />
						</Form.Item>
					</Col>
				</Row>

				{dsCauHinh.length > 0 && (
					<>
						<Divider orientation='left'>Thông tin bổ sung (Phụ lục)</Divider>
						<Row gutter={16}>
							{dsCauHinh.map((config) => (
								<Col span={12} key={config._id}>
									{renderDynamicField(config)}
								</Col>
							))}
						</Row>
					</>
				)}

				<div className='form-footer'>
					{!isView && (
						<Button loading={formSubmiting} htmlType='submit' type='primary'>
							{!edit ? 'Thêm mới' : 'Lưu lại'}
						</Button>
					)}
					<Button onClick={() => setVisibleForm(false)}>{isView ? 'Đóng' : 'Hủy'}</Button>
				</div>
			</Form>
		</Card>
	);
};

export default FormThongTin;
