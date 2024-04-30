import { TrainService } from '@/types/TrainService';
import getArrivals from '@/requests/getArrivals';

export default async function Home() {
	// if (!process.env.xapikey) return;
	// const url =
	// 	'https://api1.raildata.org.uk/1010-live-arrival-board-arr/LDBWS/api/20220120/GetArrBoardWithDetails/HMD';
	// const response = await fetch(url, {
	// 	method: 'GET',
	// 	headers: {
	// 		'Content-Type': 'text/xml',
	// 		'x-apikey': process.env.xapikey,
	// 	},
	// 	cache: 'no-cache',
	// });
	const data = await getArrivals('HMD');
	console.log(data);
	return (
		<main className='flex min-h-screen flex-col items-center justify-between p-24'>
			{data.trainServices.map((service: TrainService, index: number) => {
				return (
					<div key={service.serviceID} className='my-4'>
						<div>Scheduled - {service.sta}</div>
						<div>ETA - {service.eta}</div>
						<div>Platform - {service.platform}</div>
					</div>
				);
			})}
		</main>
	);
}
