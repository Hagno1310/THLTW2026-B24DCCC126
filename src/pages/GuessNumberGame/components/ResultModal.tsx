import React from 'react';
import { Modal, Button, Result } from 'antd';

interface Props {
	isGameOver: boolean;
	isWin: boolean;
	targetNumber: number;
	onRestart: () => void;
}

const ResultModal: React.FC<Props> = ({ isGameOver, isWin, targetNumber, onRestart }) => {
	return (
		<Modal visible={isGameOver} footer={null} closable={false} centered>
			<Result
				status={isWin ? 'success' : 'error'}
				title={isWin ? 'Chúc mừng! Bạn đã thắng' : 'Rất tiếc! Bạn đã thua'}
				subTitle={isWin ? `Số bí mật chính xác là ${targetNumber}.` : `Bạn đã hết lượt. Số đúng là ${targetNumber}.`}
				extra={[
					<Button type='primary' key='restart' onClick={onRestart} size='large'>
						Chơi lại
					</Button>,
				]}
			/>
		</Modal>
	);
};

export default ResultModal;
