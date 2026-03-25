import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Form, Input, Select } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

const FormCauHinh = (props: any) => {
	const [form] = Form.useForm();
	const { record, setVisibleForm, edit, postModel, putModel, formSubmiting, visibleForm } = useModel('vanbang.cauhinh');
	const title = props?.title ?? 'trường thông tin';

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else if (record?._id) form.setFieldsValue(record);
	}, [record?._id, visibleForm]);

	const onFinish = async (values: VanBang.ICauHinh) => {
		if (edit) {
			putModel(record?._id ?? '', values);
		} else {
			postModel(values).then(() => form.resetFields());
		}
	};

	return (
		<Card title={(edit ? 'Chỉnh sửa ' : 'Thêm mới ') + title.toLowerCase()}>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Form.Item
					name='ma'
					label='Mã trường'
					tooltip='Mã dùng để định danh trong hệ thống (vd: noiSinh, danToc)'
					rules={[...rules.required, ...rules.text, ...rules.length(50)]}
				>
					<Input placeholder='Mã trường thông tin' disabled={edit} />
				</Form.Item>

				<Form.Item name='ten' label='Tên hiển thị' rules={[...rules.required, ...rules.text, ...rules.length(250)]}>
					<Input placeholder='Tên hiển thị trên form' />
				</Form.Item>

				<Form.Item name='kieuDuLieu' label='Kiểu dữ liệu' rules={[...rules.required]} initialValue='String'>
					<Select placeholder='Chọn kiểu dữ liệu'>
						<Select.Option value='String'>Chữ (String)</Select.Option>
						<Select.Option value='Number'>Số (Number)</Select.Option>
						<Select.Option value='Date'>Ngày (Date)</Select.Option>
					</Select>
				</Form.Item>

				<div className='form-footer'>
					<Button loading={formSubmiting} htmlType='submit' type='primary'>
						{!edit ? 'Thêm mới' : 'Lưu lại'}
					</Button>
					<Button onClick={() => setVisibleForm(false)}>Hủy</Button>
				</div>
			</Form>
		</Card>
	);
};

export default FormCauHinh;
