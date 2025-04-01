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
				{data &&
					data?.map((train, index: number) => {
						const gatesDown = getTZOffsetTime(train.gatesDown);

						const lastGatesUp =
							train.lastGatesUp &&
							getTZOffsetTime(train.lastGatesUp);

						const duration = train.gatesDownDuration;
						const timeSinceLast = train.timeSinceLast || 0;
						return (
							<article
								className='w-full m-0 p-0'
								key={`${gatesDown}-${timeSinceLast}-${index}`}
							>
								{timeSinceLast && lastGatesUp ? (
									<h2
										className='bg-green-500 w-full min-h-8 overflow-hidden py-1 px-2 rounded-sm'
										style={{
											height: `${timeSinceLast}rem`,
										}}
									>
										<div>
											<h3>
												<span className='font-bold'>
													{lastGatesUp}
												</span>{' '}
												- Level crossing open for{' '}
												{timeSinceLast}m
											</h3>
										</div>
									</h2>
								) : null}
								<h2
									className=' bg-red-500 w-full min-h-8 py-1 px-2 my-2 rounded-sm'
									style={{
										height: `${duration}rem`,
									}}
								>
									<div>
										<h3>
											<span className='font-bold'>
												{gatesDown}
											</span>{' '}
											- Level crossing closed for{' '}
											{duration}m
										</h3>
									</div>
									{/* <div>Closed for {duration}m</div> */}
								</h2>
							</article>
						);
					})}
			</Suspense>
		</>
	);
}
