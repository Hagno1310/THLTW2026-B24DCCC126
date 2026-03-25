import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Form, Input, InputNumber } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

const FormSoVanBang = (props: any) => {
	const [form] = Form.useForm();
	const { record, setVisibleForm, edit, postModel, putModel, formSubmiting, visibleForm } =
		useModel('vanbang.sovanbang');
	const title = props?.title ?? 'sổ văn bằng';

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else if (record?._id) form.setFieldsValue(record);
	}, [record?._id, visibleForm]);

	const onFinish = async (values: VanBang.ISoVanBang) => {
		if (edit) {
			putModel(record?._id ?? '', values);
		} else {
			postModel(values).then(() => form.resetFields());
		}
	};

	return (
		<Card title={(edit ? 'Chỉnh sửa ' : 'Thêm mới ') + title.toLowerCase()}>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Form.Item name='nam' label='Năm' rules={[...rules.required]} initialValue={new Date().getFullYear()}>
					<InputNumber style={{ width: '100%' }} placeholder='Năm mở sổ' />
				</Form.Item>

				<Form.Item name='ten' label='Tên sổ' rules={[...rules.required, ...rules.text, ...rules.length(250)]}>
					<Input placeholder='Tên sổ văn bằng' />
				</Form.Item>

				{!edit && (
					<Form.Item
						name='soVaoSoHienTai'
						label='Số vào sổ khởi tạo'
						tooltip='Mặc định là 0. Số tiếp theo sẽ bắt đầu từ 1'
						initialValue={0}
					>
						<InputNumber min={0} style={{ width: '100%' }} />
					</Form.Item>
				)}

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

export default FormSoVanBang;
