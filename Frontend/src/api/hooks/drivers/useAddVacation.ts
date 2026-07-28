import { useMutation, useQueryClient } from "@tanstack/react-query";
import { drievrsService } from "@/api/services/drivers.service";
import { isAxiosError } from "axios";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

export function useAddVacation() {
	const queryClient = useQueryClient();
	const { t } = useTranslation();

	return useMutation({
		mutationFn: ({ driverId, ...data }: { driverId: string, data: Record<string, unknown> }) =>
			drievrsService.addVacation(driverId, data),
		onSuccess: (res) => {
			toast.success(t(res.data.message || "تم إصافة الاجازة بنجاح"));
			queryClient.invalidateQueries({ queryKey: ["drivers"] });
		},
		onError: (err) => {
			const msg = isAxiosError(err)
				? err.response?.data?.message
				: "حدث خطأ أثناء إضافة الإجازة";
			toast.error(t(msg));
		},
	});
}
