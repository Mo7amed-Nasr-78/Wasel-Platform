import { privateHttpClient } from "../client/HttpClient";

class UserService {

	userShipments(query?: Record<string, unknown>) {
		const params = query && new URLSearchParams(
			Object.entries(query).map(([key, value]) => [
				key,
				String(value),	
			]),
		);
		return privateHttpClient.get(`/user/shipments?${params}`,)
	}

	logout() {
		return privateHttpClient.post("/auth/signout");
	}
}

export const userService = new UserService();
