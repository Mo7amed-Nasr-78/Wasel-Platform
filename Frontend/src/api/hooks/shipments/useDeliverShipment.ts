import { shipmentsService } from "@/api/services/shipments.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import toast from "react-hot-toast";

export function useDeliverShipment(shipmentId: string | undefined) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: ["deliverShipment", shipmentId],
		mutationFn: () => shipmentsService.deliverShipment(shipmentId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["userShipments"] });
			toast.success("تم تسليم الحمولة بنجاح");
		},
		onError: (error) => {
			const message = isAxiosError(error)
				? error.response?.data?.message
				: "تعذر تسليم الحمولة";
			toast.error(message || "تعذر تسليم الحمولة");
		},
	});
}
