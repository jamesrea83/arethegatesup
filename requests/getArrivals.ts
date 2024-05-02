import { getBaseArrivalsUrl } from '@/requests/getBaseUrl';
import { TrainService } from '@/types/TrainService';

export default async function getArrivals(code: string) {
	if (!process.env.XAPIKEY_ARRIVALS) return;
	const baseUrl = getBaseArrivalsUrl();
	const url = `${baseUrl}/${code}`;
	console.log('** fetching arrivals for', code);
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
	data.trainServices = data.trainServices.map(
		(trainService: TrainService) => {
			const generatedDateObj = new Date(data.generatedAt);
			const timeString = `${generatedDateObj.getHours()}:${generatedDateObj.getMinutes()}`;
			trainService.generatedAt = timeString;
			return trainService;
		}
	);
	return data.trainServices;
}
