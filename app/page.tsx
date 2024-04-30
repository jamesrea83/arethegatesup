// export const dynamic = 'force-dynamic';
import { TrainService } from '@/types/TrainService';
import getArrivals from '@/requests/getArrivals';
import MainPage from '@/app/Main';

export default async function Home() {
	// const data = await getArrivals('HMD');
	// console.log(data);
	// if (!data) return <div>no data</div>;
	return (
		<main className='flex min-h-screen flex-col items-center justify-between p-24'>
			<MainPage />
			{/* {data?.trainServices?.map(
				(service: TrainService, index: number) => {
					return (
						<div key={service.serviceID} className='my-4'>
							<div>Scheduled - {service.sta}</div>
							<div>ETA - {service.eta}</div>
							<div>Platform - {service.platform}</div>
						</div>
					);
				}
			)} */}
		</main>
	);
}
