import useLocalModel from '@/hooks/useLocalModel';

export default () => {
	const objInit = useLocalModel<VanBang.IThongTinVanBang>('thong-tin');

	return {
		...objInit,
	};
};
