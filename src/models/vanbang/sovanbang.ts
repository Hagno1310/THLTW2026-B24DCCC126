import useLocalModel from '@/hooks/useLocalModel';

export default () => {
	const objInit = useLocalModel<VanBang.ISoVanBang>('so-van-bang');

	return {
		...objInit,
	};
};
