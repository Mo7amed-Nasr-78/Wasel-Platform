import { privateHttpClient } from "../client/HttpClient";

class TrucksService {
	getTruck(truckId: string) {
		return privateHttpClient.get(`/trucks/${truckId}`);
	}

	getTrucks() {
		return privateHttpClient.get(`/trucks`);
	}

	createTruck(data: FormData | Record<string, unknown>) {
		return privateHttpClient.post(`/trucks/add`, data, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});
	}

	updateTruck(truckId: string, data: FormData | Record<string, unknown>) {
		return privateHttpClient.put(`/trucks/${truckId}`, data, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});
	}

	verifyTruck(truckId: string) {
		return privateHttpClient.post(
			`/trucks/${truckId}/verify`,
			undefined,
		);
	}

	commentTruck(truckId: string, comment: string) {
		return privateHttpClient.post(`/trucks/${truckId}/comment`, {
			comment,
		});
	}

	deleteTruck(truckId: string) {
		return privateHttpClient.delete(`/trucks/${truckId}`);
	}
}

export const trucksService = new TrucksService();
