import { privateHttpClient } from "../client/HttpClient";

class WalletService {
	topUp(data: { amount: number; currency: string }) {
		return privateHttpClient.post("wallet/top-up", data);
	}
}

export const walletService = new WalletService();
