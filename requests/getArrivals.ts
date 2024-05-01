import { getBaseArrivalsUrl } from '@/requests/getBaseUrl';

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
	return data.trainServices;
}
