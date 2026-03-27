import getArrivals from '@/requests/getArrivals';
import { TrainService } from '@/types/TrainService';
import addMinutes from '@/utils/addMinutes';
import subtractMinutes from '@/utils/subtractMinutes';
import getTimeStampFromString from '@/utils/getTimeStampFromString';

export default async function getArrivalsHMD() {
	const arrivalsHMD = await getArrivals('HMD');
	const filteredArrivalsHMD = arrivalsHMD.filter(
		(trainService: TrainService) => {
			if (trainService?.isCancelled) return false;
			return true;
		}
	);

	return (
		filteredArrivalsHMD &&
		filteredArrivalsHMD.map((trainService: TrainService) => {
			const { sta, eta } = trainService;
			if (!sta) return trainService;
			const isUncertain = eta === 'Delayed' || !eta;
			const arrival = !eta || eta === 'On time' || eta === 'Delayed' ? sta : eta;
			const dateObject = getTimeStampFromString(arrival);
			if (trainService.platform === '1') {
				trainService.gatesEstimates = {
					gatesDown: subtractMinutes(dateObject, 1),
					gatesUp: addMinutes(dateObject, 1),
					gatesDownDuration: 3,
					isUncertain,
				};
			} else {
				trainService.gatesEstimates = {
					gatesDown: subtractMinutes(dateObject, 2),
					gatesUp: addMinutes(dateObject, 0),
					gatesDownDuration: 2,
					isUncertain,
				};
			}

			trainService.info = 'HMD Arrival';

			return trainService;
		})
	);
}
