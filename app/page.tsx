import Link from 'next/link';

import getProcessedData from '@/requests/getProcessedData';

export default async function Home() {
	const data = await getProcessedData();
	if (!data) return <div>no data</div>;
	return (
		<div className='h-full w-full relative flex flex-col items-center p-4'>
			<h1 className='text-lg'>
				Are the gates up at Hampden Park level crossing?
			</h1>
			<p>Refresh page for fresh data</p>
			{data?.map((train, index: number) => {
				const gatesDown = train.gatesDown
					?.toLocaleTimeString('en-GB')
					.slice(0, 5);
				const gatesUp = train.gatesUp
					?.toLocaleTimeString('en-GB')
					.slice(0, 5);
				const duration = train.gatesDownDuration;
				const timeSinceLast = train.timeSinceLast || 0;
				return (
					<>
						{timeSinceLast ? (
							<div
								className='bg-green-500 w-full flex items-center justify-center p-1 m-1 min-h-6'
								style={{ height: `${timeSinceLast}rem` }}
							>
								Open
							</div>
						) : null}
						<div
							key={gatesDown}
							className='flex flex-col justify-between bg-red-500 w-full items-center p-1 m-1'
							style={{
								height: `${duration}rem`,
								// marginTop: `${timeSinceLast}rem`,
							}}
						>
							<div>Gates down - {gatesDown}</div>
							<div>Gates up - {gatesUp}</div>
							{/* <div>{train.gatesDownDuration}</div> */}
						</div>
					</>
				);
			})}
			<p>Disclaimer - everything here is just a guess.</p>
			<Link
				href='/verbose'
				className='font-medium text-blue-600 dark:text-blue-500 hover:underline z-10'
			>
				/verbose
			</Link>
		</div>
	);
}
