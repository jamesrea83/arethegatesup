import { getBaseArrivalsUrl } from '@/requests/getBaseUrl';
import { TrainService } from '@/types/TrainService';

export default async function getArrivals(code: string) {
	if (!process.env.XAPIKEY_ARRIVALS) return;
	const baseUrl = getBaseArrivalsUrl();
	const url = `${baseUrl}/${code}`;
	const response = await fetch(url, {
		method: 'GET',
		headers: {
			'Content-Type': 'text/xml',
			'x-apikey': process.env.XAPIKEY_ARRIVALS,
		},
		next: {
			revalidate: 60,
		},
	});
	const data = await response.json();
	data.trainServices = data.trainServices?.map(
		(trainService: TrainService) => {
			trainService.generatedAt = data.generatedAt.slice(11, 16);
			return trainService;
		}
	);
	return data.trainServices;
}
