import { getBaseDeparturesUrl } from '@/requests/getBaseUrl';
import { TrainService } from '@/types/TrainService';

export default async function getDepartures(code: string) {
	if (!process.env.XAPIKEY_DEPARTURES) return;
	const baseUrl = getBaseDeparturesUrl();
	const url = `${baseUrl}/${code}`;
	console.log('** fetching departures for', code);
	const response = await fetch(url, {
		method: 'GET',
		headers: {
			'Content-Type': 'text/xml',
			'x-apikey': process.env.XAPIKEY_DEPARTURES,
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
