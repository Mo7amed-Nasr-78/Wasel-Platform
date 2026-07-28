import { useMutation, useQueryClient } from "@tanstack/react-query";
import { trucksService } from "@/api/services/trucks.service";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import type { Truck } from "@/shared/interfaces/Interfaces";

export function useUpdateTruck() {
	const queryClient = useQueryClient();
	const { t } = useTranslation();

	return useMutation({
		mutationFn: (variables: { truckId: string; data: FormData }) =>
			trucksService.updateTruck(variables.truckId, variables.data),

		onSuccess: (res) => {
			toast.success(t(res.data.message));

			const updatedTruck = res?.data?.updatedTruck as
				| Truck
				| undefined;
			if (!updatedTruck) return;

			const updatedTruckId = updatedTruck.id;
			if (!updatedTruckId) return;
			queryClient.invalidateQueries({ queryKey: ["trucks"] });
		},
	});
}
