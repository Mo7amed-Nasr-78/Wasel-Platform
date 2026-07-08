import { useMutation, useQueryClient } from "@tanstack/react-query";
import { drievrsService } from "@/api/services/drivers.service";
import { isAxiosError } from "axios";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

export function useApproveDriver() {
	const queryClient = useQueryClient();
	const { t } = useTranslation();

	return useMutation({
		mutationFn: async (driverId: string) => {
			const response = await drievrsService.approveDriver(driverId);
			return response as { data?: { message?: string } };
		},
		onSuccess: (res) => {
			toast.success(
				t(res.data?.message || "تمت الموافقة على السائق بنجاح"),
			);
			queryClient.invalidateQueries({ queryKey: ["drivers"] });
		},
		onError: (err) => {
			const axiosMsg = isAxiosError(err)
				? err.response?.data?.message
				: "حدث خطأ أثناء الموافقة على السائق";
			toast.error(t(axiosMsg));
		},
	});
}
