import { shipmentsService } from "@/api/services/shipments.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import toast from "react-hot-toast";

export function useAssignShipment(shipmentId: string | undefined) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: ["assignShipment", shipmentId],
		mutationFn: (data: Record<string, unknown>) =>
			shipmentsService.assignShipment(shipmentId, data),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["shipments"],
			});
			queryClient.invalidateQueries({
				queryKey: ["shipment", shipmentId],
			});
			toast.success("تم تعيين الشاحنة والسائق بنجاح");
		},
		onError: (error) => {
			const message = isAxiosError(error)
				? error.response?.data?.message
				: "تعذر تعيين الشاحنة والسائق";
			toast.error(message || "تعذر تعيين الشاحنة والسائق");
		},
	});
}
