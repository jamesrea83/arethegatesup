import Link from 'next/link';
import type { Metadata } from 'next';

import getTZOffsetTime from '@/utils/getTZOffsetTime';
import { TrainService } from '@/types/TrainService';
import getAllData from '@/requests/getAllData';
import Footer from '@/app/Footer';

export const metadata: Metadata = {
	title: 'Verbose Hampden Park Level Crossing Tracker',
	description:
		'A more detailed look at the services passing through Hampden Park level crossing.',
	metadataBase: new URL('https://www.arethegatesup.com/verbose'),
	alternates: {
		canonical: 'https://www.arethegatesup.com/verbose',
	},
};

export default async function Verbose() {
	const data = await getAllData();
	if (!data) return <div>no data</div>;
	return (
		<div className='h-full w-full flex flex-col justify-center items-center'>
			{data?.map((service: TrainService, index: number) => {
				const crossingTime = service?.crossingTrigger
					?.toLocaleTimeString('en-GB')
					.slice(0, 5);

				const gatesDown =
					service?.gatesEstimates?.gatesDown &&
					getTZOffsetTime(service?.gatesEstimates?.gatesDown);

				const gatesUp =
					service?.gatesEstimates?.gatesUp &&
					getTZOffsetTime(service?.gatesEstimates?.gatesUp);

				return (
					<article
						key={service.serviceID}
						className={`gap-1 flex flex-col items-start justify-start my-8`}
					>
						<h2>Service ID - {service.serviceID}</h2>
						<div>Scheduled - {service.sta || service.std}</div>
						<div>ETA - {service.eta || service.etd}</div>
						<div>Platform - {service.platform}</div>
						<div>Info - {service.info}</div>
						<div className='font-bold'>
							Gates down estimate - {gatesDown}
						</div>
						<div className='font-bold'>
							Gates up estimate - {gatesUp}
						</div>
					</article>
				);
			})}
			<Link
				href='/'
				className='font-medium text-blue-600 dark:text-blue-500 hover:underline z-10 py-4'
			>
				home
			</Link>
			<Footer />
		</div>
	);
}
