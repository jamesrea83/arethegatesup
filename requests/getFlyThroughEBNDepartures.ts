import getDepartures from '@/requests/getDepartures';
import { TrainService } from '@/types/TrainService';
import addMinutes from '@/utils/addMinutes';
import getTimeStampFromString from '@/utils/getTimeStampFromString';

export default async function getFlyThroughEBNDepartures() {
	const departuresEBN = await getDepartures('EBN');

	const flyThroughEBNDepartures = departuresEBN.filter(
		(trainService: TrainService) => {
			const { subsequentCallingPoints, isCancelled } = trainService;
			if (!subsequentCallingPoints) return false;
			if (isCancelled) return false;
			const nextStop = subsequentCallingPoints[0]?.callingPoint[0];
			if (!nextStop || nextStop.crs === 'HMD') return false;
			return true;
		}
	);

	return (
		flyThroughEBNDepartures &&
		flyThroughEBNDepartures.map((trainService: TrainService) => {
			const { std, etd } = trainService;
			if (!std) return trainService;
			const isUncertain = etd === 'Delayed' || !etd;
			const departure = !etd || etd === 'On time' || etd === 'Delayed' ? std : etd;
			const dateObject = getTimeStampFromString(departure);

			const gatesEstimates = {
				gatesDown: addMinutes(dateObject, 2),
				gatesUp: addMinutes(dateObject, 3),
				gatesDownDuration: 1,
				isUncertain,
			};

			trainService.gatesEstimates = gatesEstimates;
			trainService.info = 'EBN Departure';

			return trainService;
		})
	);
}
