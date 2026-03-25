import useLocalModel from '@/hooks/useLocalModel';

export default () => {
	const objInit = useLocalModel<VanBang.ICauHinh>('cau-hinh');

	return {
		...objInit,
	};
};
