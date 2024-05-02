import { TrainService } from '@/types/TrainService';
import getAllData from '@/requests/getAllData';

export default async function Home() {
	const data = await getAllData();
	if (!data) return <div>no data</div>;
	return (
		<div className='h-full w-full relative'>
			{data?.map((service: TrainService, index: number) => {
				const crossingTime = service?.crossingTrigger
					?.toLocaleTimeString('en-GB')
					.slice(0, 5);
				// const marginTop = `mt-[${service.minsTilEstimate}rem]`;
				const positionIndex = service?.minsTilEstimate || index;
				const minsPosition =
					service?.minsTilEstimate && service?.minsTilEstimate > 0
						? service?.minsTilEstimate
						: 1;
				const top = service?.minsTilEstimate
					? index + minsPosition
					: index;
				console.log(`***`, top);
				return (
					<div
						key={service.serviceID}
						className={`w-full absolute gap-2 flex items-center justify-center`}
						style={{
							top: `${positionIndex + index}rem`,
						}}
					>
						<div className='font-bold'>
							Gates down - {crossingTime}
						</div>
						{/* <div>Service ID - {service.serviceID}</div> */}
						{/* <div>Scheduled - {service.sta || service.std}</div> */}
						{/* <div>ETA - {service.eta || service.etd}</div> */}
						{/* <div>Platform - {service.platform}</div> */}
					</div>
				);
			})}
		</div>
	);
}
