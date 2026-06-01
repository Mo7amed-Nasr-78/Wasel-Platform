import { useQueryClient } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { trucksService } from "@/api/services/trucks.service";
import { isAxiosError } from "axios";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

export function useDeleteTruck() {
	const { t } = useTranslation();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (truckId: string) => trucksService.deleteTruck(truckId),

		onSuccess: (res) => {
			toast.success(t(res.data.message || "تم حذف الشاحنة بنجاح"));
			queryClient.invalidateQueries({ queryKey: ["trucks"] });
		},

		onError: (err) => {
			const axiosMeg = isAxiosError(err)
				? err.response?.data?.message
				: "شئ ما حدث خطأ";
			toast.error(t(axiosMeg));
		},
	});
}
