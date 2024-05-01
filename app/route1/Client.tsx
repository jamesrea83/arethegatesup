'use client';
import { useEffect, useState, Suspense } from 'react';
import { TrainService } from '@/types/TrainService';

interface Props {
	initialData: TrainService[];
}

export default function Client({ initialData }: Props) {
	const [data, setData] = useState<TrainService[]>(initialData);
	const fetchData = async () => {
		const response = await fetch('api/arrivals?code=HMD', {
			cache: 'no-cache',
		});
		const data = await response.json();
		console.log(data);
		setData(data);
	};

	useEffect(() => {
		fetchData();
	}, []);

	return (
		<div className='flex min-h-screen flex-col items-center justify-between p-24'>
			<Suspense fallback={<div>Loading</div>}>
				{data?.map((service: TrainService) => {
					return (
						<div key={service.serviceID} className='my-4'>
							<div>Scheduled - {service.sta}</div>
							<div>ETA - {service.eta}</div>
							<div>Platform - {service.platform}</div>
						</div>
					);
				})}
			</Suspense>
		</div>
	);
}
