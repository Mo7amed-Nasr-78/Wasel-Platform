import { shipmentsService } from "@/api/services/shipments.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdateShipment(shipmentId: string | undefined) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: ["updateShipment", shipmentId],
		mutationFn: (data: Record<string, unknown>) =>
			shipmentsService.updateShipment(shipmentId, data),

		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["shipment", shipmentId],
			});
			queryClient.invalidateQueries({
				queryKey: ["shipments"],
			});
		},
	});
}
