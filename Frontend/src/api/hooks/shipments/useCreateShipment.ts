import { useQueryClient, useMutation } from "@tanstack/react-query";
import { shipmentsService } from "@/api/services/shipments.service";
import axios from "axios";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

export function useCreateShipment() {
	const queryClient = useQueryClient();
	const { t } = useTranslation();

	return useMutation({
		mutationFn: (newShipment: Record<string, unknown> | FormData) => {
			return shipmentsService.createShipment(newShipment);
		},

		onSuccess: (res) => {
			queryClient.invalidateQueries({ queryKey: ["shipments"] });
			toast.success(t(res.data?.message) || "تم رفع الحمولة بنجاح");
		},

		onError: (error) => {
			const axiosMeg = axios.isAxiosError(error)
				? error.response?.data.message
				: "حدث خطأ ما";
			toast.error(t(axiosMeg));
		}
	});
}
