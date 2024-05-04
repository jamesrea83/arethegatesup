'use client';
import { useEffect, useState, Suspense } from 'react';

import getProcessedData from '@/requests/getProcessedData';
import { GatesEstimates } from '@/types/GatesEstimates';

interface Props {
	cachedData: GatesEstimates[];
}

export default function MainPage({ cachedData }: Props) {
	const [data, setData] = useState<GatesEstimates[]>(cachedData);

	useEffect(() => {
		const fetchData = async () => {
			const data = await getProcessedData();
			setData(data);
		};
		fetchData();
	}, []);

	return (
		<>
			<Suspense>
				{data?.map((train, index: number) => {
					const gatesDown = train.gatesDown
						?.toTimeString()
						.slice(0, 5);

					console.log('*** train', train);
					console.log('*** gatesDown', gatesDown);

					const gatesUp = train.gatesUp?.toTimeString().slice(0, 5);
					const lastGatesUp = train.lastGatesUp
						?.toTimeString()
						.slice(0, 5);
					const duration = train.gatesDownDuration;
					const timeSinceLast = train.timeSinceLast || 0;
					return (
						<div
							className='w-full m-0 p-0'
							key={`${gatesDown}-${timeSinceLast}-${index}`}
						>
							{timeSinceLast && lastGatesUp ? (
								<div
									className='bg-green-500 w-full min-h-8 overflow-hidden py-1 px-2 rounded-sm'
									style={{ height: `${timeSinceLast}rem` }}
								>
									<div className='font-bold'>
										{lastGatesUp} - Gates up
									</div>
									<div>Open for {timeSinceLast}m</div>
								</div>
							) : null}
							<div
								className=' bg-red-500 w-full py-1 px-2 my-2 rounded-sm'
								style={{
									height: `${duration}rem`,
									// marginTop: `${timeSinceLast}rem`,
								}}
							>
								<div className='font-bold'>
									{gatesDown} - Gates down
								</div>
								<div>Closed for {duration}m</div>
								{/* <div>Gates up - {gatesUp}</div> */}
								{/* <div>{train.gatesDownDuration}</div> */}
							</div>
						</div>
					);
				})}
			</Suspense>
		</>
	);
}
