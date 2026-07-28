import { walletService } from "@/api/services/wallet.service";
import { useMutation } from "@tanstack/react-query";

export function useTopUpWallet() {
	return useMutation({
		mutationFn: (data: { amount: number; currency: string }) =>
			walletService.topUp(data),
	});
}
