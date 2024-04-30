'use client';
import { useEffect, useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';

import { TrainService } from '@/types/TrainService';

export default function MainPage() {
	const [data, setData] = useState<TrainService[]>([]);
	const router = useRouter();
	const fetchData = async () => {
		const response = await fetch('api/arrivals?code=HMD', {
			cache: 'no-cache',
		});
		const data = await response.json();
		console.log(data?.trainServices);
		setData(data?.trainServices);
	};

	useEffect(() => {
		fetchData();
		router.refresh();
	}, []);

	return (
		<>
			<Suspense>
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
		</>
	);
}
