import { TrainService } from '@/types/TrainService';
import getAllData from '@/requests/getAllData';

export default async function Home() {
	const data = await getAllData();
	if (!data) return <div>no data</div>;
	return (
		<main className='flex min-h-screen w-full flex-col items-center justify-between p-24'>
			{data?.map((service: TrainService, index: number) => {
				return (
					<div key={service.serviceID} className='my-4 w-full'>
						<div>Service ID - {service.serviceID}</div>
						<div>Scheduled - {service.sta || service.std}</div>
						<div>ETA - {service.eta || service.etd}</div>
						<div>Platform - {service.platform}</div>
					</div>
				);
			})}
		</main>
	);
}
