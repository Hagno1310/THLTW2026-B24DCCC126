import React, { useState, useEffect } from 'react';
import { Card, InputNumber, Button, Tag, Typography } from 'antd';
import ResultModal from './components/ResultModal';
import './style.less';

const { Title, Text } = Typography;

const GuessNumberGame: React.FC = () => {
	const [targetNumber, setTargetNumber] = useState<number>(0);
	const [guess, setGuess] = useState<number | null>(null);
	const [attempts, setAttempts] = useState<number[]>([]);
	const [message, setMessage] = useState<string>('Đoán một số từ 1 đến 100');
	const [isGameOver, setIsGameOver] = useState<boolean>(false);

	const initGame = () => {
		setTargetNumber(Math.floor(Math.random() * 100) + 1);
		setGuess(null);
		setAttempts([]);
		setMessage('Đoán một số từ 1 đến 100');
		setIsGameOver(false);
	};

	useEffect(() => {
		initGame();
	}, []);

	const handleGuess = () => {
		if (guess === null || guess < 1 || guess > 100 || attempts.includes(guess)) return;

		const newAttempts = [...attempts, guess];
		setAttempts(newAttempts);
		setGuess(null);

		if (guess === targetNumber) {
			setIsGameOver(true);
		} else if (newAttempts.length >= 10) {
			setIsGameOver(true);
		} else {
			setMessage(guess < targetNumber ? 'Bạn đoán quá thấp! 👇' : 'Bạn đoán quá cao! 👆');
		}
	};

	return (
		<div className='game-container'>
			<Card title='Trò chơi Đoán Số' bordered={false}>
				<div className='status-box'>
					<div className='message'>{message}</div>
					<div className='attempts'>
						Lượt còn lại: <span>{10 - attempts.length}</span>
					</div>
				</div>

				<div className='input-group'>
					<InputNumber
						min={1}
						max={100}
						value={guess}
						onChange={(val) => setGuess(val)}
						onPressEnter={handleGuess}
						disabled={isGameOver}
						placeholder='Số?'
						size='large'
					/>
					<Button type='primary' onClick={handleGuess} disabled={isGameOver || guess === null} size='large'>
						Đoán
					</Button>
				</div>

				{attempts.length > 0 && (
					<div className='history'>
						<div className='label'>Lịch sử đoán:</div>
						<div className='tags-container'>
							{attempts.map((v, i) => (
								<Tag key={i} color={v === targetNumber ? 'success' : 'blue'}>
									{v}
								</Tag>
							))}
						</div>
					</div>
				)}
			</Card>

			<ResultModal
				isGameOver={isGameOver}
				isWin={attempts.includes(targetNumber)}
				targetNumber={targetNumber}
				onRestart={initGame}
			/>
		</div>
	);
};

export default GuessNumberGame;
