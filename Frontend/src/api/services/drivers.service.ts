import { privateHttpClient } from "../client/HttpClient";
import type { CreateDriverForm } from "@/shared/interfaces/Interfaces";

class DriversService {
	getDriver(driverId: string) {
		return privateHttpClient.get(`/drivers/${driverId}`);
	}

	getDrivers() {
		return privateHttpClient.get("/drivers");
	}

	createDriver(formData: CreateDriverForm | FormData) {
		return privateHttpClient.post("/drivers/add", formData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});
	}

	updateDriver(driverId: string, data: FormData | Record<string, unknown>) {
		return privateHttpClient.put(`/drivers/${driverId}`, data, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});
	}

	approveDriver(driverId: string) {
		return privateHttpClient.post(
			`/drivers/${driverId}/approve`,
			undefined,
		);
	}

	commentDriver(driverId: string, comment: string) {
		return privateHttpClient.post(`/drivers/${driverId}/comment`, {
			comment,
		});
	}

	deleteDriver(driverId: string) {
		return privateHttpClient.delete(`/drivers/${driverId}`);
	}
}

export const drievrsService = new DriversService();
