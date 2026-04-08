declare module TravelPlanning {
	export type DestinationType = 'beach' | 'mountain' | 'city';

	export interface Destination {
		id: string;
		name: string;
		description: string;
		image: string;
		location: string;
		type: DestinationType;
		rating: number;
		visitDuration: number; // hours
		cost: {
			dining: number;
			accommodation: number;
			transport: number;
		};
	}

	export interface ItineraryDay {
		id: string;
		dayNumber: number;
		destinations: string[]; // destination IDs
	}

	export interface Itinerary {
		id: string;
		name: string;
		budgetLimit: number;
		days: ItineraryDay[];
		createdAt: string; // ISO string
	}
}
