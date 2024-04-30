import getBaseUrl from '@/requests/getBaseUrl';

export default async function getArrivals(code: string) {
	if (!process.env.XAPIKEY) return;
	const baseUrl = getBaseUrl();
	const url = `${baseUrl}/${code}`;
	const response = await fetch(url, {
		method: 'GET',
		headers: {
			'Content-Type': 'text/xml',
			'x-apikey': process.env.XAPIKEY,
		},
		next: {
			revalidate: 60,
		},
	});
	const data = await response.json();
	return data;
}
