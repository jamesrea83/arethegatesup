import getBaseUrl from '@/requests/getBaseUrl';

export default async function getArrivals(code: string) {
	if (!process.env.xapikey) return;
	const baseUrl = getBaseUrl();
	const url = `${baseUrl}/${code}`;
	const response = await fetch(url, {
		method: 'GET',
		headers: {
			'Content-Type': 'text/xml',
			'x-apikey': process.env.xapikey,
		},
		cache: 'no-cache',
	});
	const data = await response.json();
	return data;
}
