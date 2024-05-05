'use client';
import { useEffect, useState, Suspense } from 'react';

import getProcessedData from '@/requests/getProcessedData';
import { GatesEstimates } from '@/types/GatesEstimates';
import getTZOffsetTime from '@/utils/getTZOffsetTime';

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
					const gatesDown = getTZOffsetTime(train.gatesDown);

					const lastGatesUp =
						train.lastGatesUp && getTZOffsetTime(train.lastGatesUp);

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
									<div>
										<span className='font-bold'>
											{lastGatesUp} - Gates up
										</span>{' '}
										for {timeSinceLast}m
									</div>
									{/* <div>Open for {timeSinceLast}m</div> */}
								</div>
							) : null}
							<div
								className=' bg-red-500 w-full min-h-8 py-1 px-2 my-2 rounded-sm'
								style={{
									height: `${duration}rem`,
								}}
							>
								<div>
									<span className='font-bold'>
										{gatesDown} - Gates down
									</span>{' '}
									for {duration}m
								</div>
								{/* <div>Closed for {duration}m</div> */}
							</div>
						</div>
					);
				})}
			</Suspense>
		</>
	);
}
