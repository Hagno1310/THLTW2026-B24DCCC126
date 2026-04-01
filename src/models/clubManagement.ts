import { useState, useEffect } from 'react';

export default () => {
	const [clubs, setClubs] = useState<ClubManagement.Club[]>([]);
	const [registrations, setRegistrations] = useState<ClubManagement.Registration[]>([]);

	const getClubs = () => {
		const data = JSON.parse(localStorage.getItem('clubs') || '[]');
		setClubs(data);
		return data;
	};

	const saveClubs = (newClubs: ClubManagement.Club[]) => {
		localStorage.setItem('clubs', JSON.stringify(newClubs));
		setClubs(newClubs);
	};

	const getRegistrations = () => {
		const data = JSON.parse(localStorage.getItem('registrations') || '[]');
		setRegistrations(data);
		return data;
	};

	const saveRegistrations = (newRegistrations: ClubManagement.Registration[]) => {
		localStorage.setItem('registrations', JSON.stringify(newRegistrations));
		setRegistrations(newRegistrations);
	};

	useEffect(() => {
		getClubs();
		getRegistrations();
	}, []);

	return {
		clubs,
		setClubs: saveClubs,
		getClubs,
		registrations,
		setRegistrations: saveRegistrations,
		getRegistrations,
	};
};
