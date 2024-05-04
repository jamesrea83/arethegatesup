export const dynamic = 'force-dynamic';
import Link from 'next/link';

import getProcessedData from '@/requests/getProcessedData';

export default async function Home() {
	const data = await getProcessedData();
	if (!data) return <div>no data</div>;
	return (
		<div className='h-full w-full relative flex flex-col items-center p-4'>
			<h1 className='text-lg w-full'>
				Are the gates up at Hampden Park level crossing?
			</h1>
			<p className='w-full font-bold my-2'>Refresh page for fresh data</p>
			{data?.map((train, index: number) => {
				const gatesDown = train.gatesDown
					?.toLocaleTimeString('en-GB')
					.slice(0, 5);
				const gatesUp = train.gatesUp
					?.toLocaleTimeString('en-GB')
					.slice(0, 5);
				const lastGatesUp = train.lastGatesUp
					?.toLocaleTimeString('en-GB')
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
			<p className='py-2'>
				Disclaimer - everything here is just a guess.
			</p>
			<Link
				href='/verbose'
				className='font-medium text-blue-600 dark:text-blue-500 hover:underline z-10 py-4'
			>
				/verbose
			</Link>
			<p className='pb-4'>© James Rea 2024</p>
		</div>
	);
}
