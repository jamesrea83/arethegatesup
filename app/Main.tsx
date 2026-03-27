'use client';
import { useEffect, useState, Suspense } from 'react';
import { WebPage, Trip, WithContext } from 'schema-dts';

import getProcessedData from '@/requests/getProcessedData';
import { GatesEstimates } from '@/types/GatesEstimates';
import getTZOffsetTime from '@/utils/getTZOffsetTime';

interface Props {
	cachedData: GatesEstimates[];
}

export default function MainPage({ cachedData }: Props) {
	const [data, setData] = useState<GatesEstimates[]>(cachedData);

	useEffect(() => {
		let timeoutId: ReturnType<typeof setTimeout>;

		const fetchData = async () => {
			const freshData = await getProcessedData();
			setData(freshData);

			const now = new Date();
			const nextClosure = freshData?.find(
				d => new Date(d.gatesDown) > now
			);
			const minsUntil = nextClosure
				? (new Date(nextClosure.gatesDown).getTime() - now.getTime()) /
					60000
				: Infinity;
			const interval = minsUntil <= 5 ? 15000 : 60000;

			timeoutId = setTimeout(fetchData, interval);
		};

		fetchData();
		return () => clearTimeout(timeoutId);
	}, []);

	const jsonLd: WithContext<WebPage> = {
		'@context': 'https://schema.org',
		'@type': 'WebPage',
		url: 'https://arethegatesup.com/',
		name: 'Hampden Park Level Crossing Tracker',
		description:
			'Check if the gates at the Hampden Park level crossing will be up before you start your journey.',

		mainEntity: {
			'@type': 'ItemList',
			itemListElement: data?.map(
				(train, index: number): Trip => ({
					'@type': 'Trip',
					arrivalTime: train.gatesDown.toString(),
					departureTime: train.gatesUp.toString(),
				})
			),
		},
	};

	return (
		<>
			<script
				type='application/ld+json'
				dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
			/>
			<Suspense>
				{data &&
					data?.map((train, index: number) => {
						const gatesDown = getTZOffsetTime(train.gatesDown);

						const lastGatesUp =
							train.lastGatesUp &&
							getTZOffsetTime(train.lastGatesUp);

						const duration = train.gatesDownDuration;
						const timeSinceLast = train.timeSinceLast || 0;
						const isUncertain = train.isUncertain;
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
												- Open for {timeSinceLast}m
											</h3>
										</div>
									</h2>
								) : null}
								<h2
									className={`w-full min-h-8 py-1 px-2 my-2 rounded-sm ${isUncertain ? 'bg-amber-500' : 'bg-red-500'}`}
									style={{
										height: `${duration}rem`,
									}}
								>
									<div>
										<h3>
											<span className='font-bold'>
												{isUncertain ? '~' : ''}
												{gatesDown}
											</span>{' '}
											- Closed for {duration}m
											{isUncertain
												? ' (delayed - approx)'
												: ''}
										</h3>
									</div>
								</h2>
							</article>
						);
					})}
			</Suspense>
		</>
	);
}
