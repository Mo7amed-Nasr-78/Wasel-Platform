import { privateHttpClient } from "../client/HttpClient";

class UserService {

	userShipments(params?: Record<string, unknown>) {
		return privateHttpClient.get('/user/shipments', { params })
	}

	logout() {
		return privateHttpClient.post("/auth/signout");
	}
}

export const userService = new UserService();
