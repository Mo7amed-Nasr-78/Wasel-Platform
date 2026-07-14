import { useMutation, useQueryClient } from "@tanstack/react-query";
import { trucksService } from "@/api/services/trucks.service";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import type { Truck } from "@/shared/interfaces/Interfaces";

type TrucksQueryData = { data: Truck[] } & Record<string, unknown>;

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

			// queryClient.setQueryData(
			// 	// ["trucks"],
			// 	// (oldData?: TrucksQueryData) => {
			// 	// 	if (!oldData || !Array.isArray(oldData.data))
			// 	// 		return oldData;

			// 	// 	return {
			// 	// 		...oldData,
			// 	// 		data: oldData.data.map((truck) => {
			// 	// 			const truckId = truck.id;

			// 	// 			return truckId === updatedTruckId
			// 	// 				? updatedTruck
			// 	// 				: truck;
			// 	// 		}),
			// 	// 	};
			// 	// },
			// );
			queryClient.invalidateQueries({ queryKey: ["trucks"] });
			// onSuccess: (res) => {
			// 	toast.success(
			// 		t(res.data?.message || "تم توثيق الشاحنة بنجاح"),
			// 	);
			// },
		},
	});
}
