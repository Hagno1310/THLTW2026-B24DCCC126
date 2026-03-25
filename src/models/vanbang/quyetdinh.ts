import useLocalModel from '@/hooks/useLocalModel';

export default () => {
	const objInit = useLocalModel<VanBang.IQuyetDinh>('quyet-dinh');

	return {
		...objInit,
	};
};
