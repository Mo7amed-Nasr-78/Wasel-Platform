import { privateHttpClient } from "../client/HttpClient";

class UserService {
	me() {
		return privateHttpClient.get("/user/me");
	}
	
	getUsers() {
		return privateHttpClient.get("/user");
	}

	verifyUser(userId: string) {
		return privateHttpClient.post(`/user/${userId}/verify`);
	}

	userShipments(query?: Record<string, unknown>) {
		const params =
			query &&
			new URLSearchParams(
				Object.entries(query).map(([key, value]) => [
					key,
					String(value),
				]),
			);
		return privateHttpClient.get(`/user/shipments?${params}`);
	}

	updateUser(data: FormData | Record<string, unknown>) {
		return privateHttpClient.patch('/user/update', data)
	}
}

export const userService = new UserService();
