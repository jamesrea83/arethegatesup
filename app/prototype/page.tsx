import classNames from 'classnames';

import getProcessedData from '@/requests/getProcessedData';

export default async function Home() {
	const data = await getProcessedData();
	if (!data) return <div>no data</div>;
	return (
		<div className='h-full w-full relative flex flex-col items-center'>
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
						{timeSinceLast && (
							<div
								className='bg-green-400 w-full flex items-center justify-center'
								style={{ height: `${timeSinceLast}rem` }}
							>
								Open
							</div>
						)}
						<div
							key={gatesDown}
							className='flex flex-col justify-between bg-red-400 w-full items-center'
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
		</div>
	);
}
