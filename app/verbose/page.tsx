import Link from 'next/link';

import { TrainService } from '@/types/TrainService';
import getAllData from '@/requests/getAllData';

export default async function Home() {
	const data = await getAllData();
	if (!data) return <div>no data</div>;
	return (
		<div className='h-full w-full flex flex-col justify-center items-center'>
			{data?.map((service: TrainService, index: number) => {
				const crossingTime = service?.crossingTrigger
					?.toLocaleTimeString('en-GB')
					.slice(0, 5);

				return (
					<div
						key={service.serviceID}
						className={`gap-1 flex flex-col items-start justify-start my-8`}
					>
						<div>Service ID - {service.serviceID}</div>
						<div>Scheduled - {service.sta || service.std}</div>
						<div>ETA - {service.eta || service.etd}</div>
						<div>Platform - {service.platform}</div>
						<div className='font-bold'>
							Gates down estimate - {crossingTime}
						</div>
					</div>
				);
			})}
			<Link
				href='/'
				className='font-medium text-blue-600 dark:text-blue-500 hover:underline z-10 py-4'
			>
				home
			</Link>
			<p className='pb-4'>© James Rea 2024</p>
		</div>
	);
}
