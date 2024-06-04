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
			if (trainService.eta === 'Delayed') return false;
			return true;
		}
	);

	return (
		filteredArrivalsHMD &&
		filteredArrivalsHMD.map((trainService: TrainService) => {
			const { sta, eta } = trainService;
			if (!sta || !eta) return trainService;
			const arrival = eta === 'On time' ? sta : eta;
			const dateObject = getTimeStampFromString(arrival);
			if (trainService.platform === '1') {
				trainService.gatesEstimates = {
					gatesDown: subtractMinutes(dateObject, 1),
					gatesUp: addMinutes(dateObject, 1),
					gatesDownDuration: 3,
				};
			} else {
				trainService.gatesEstimates = {
					gatesDown: subtractMinutes(dateObject, 2),
					gatesUp: addMinutes(dateObject, 0),
					gatesDownDuration: 2,
				};
			}

			trainService.info = 'HMD Arrival';

			return trainService;
		})
	);
}
