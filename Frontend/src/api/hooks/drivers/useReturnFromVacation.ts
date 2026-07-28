import { useMutation, useQueryClient } from "@tanstack/react-query";
import { drievrsService } from "@/api/services/drivers.service";
import { isAxiosError } from "axios";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

export function useReturnFromVacation() {
	const queryClient = useQueryClient();
	const { t } = useTranslation();

	return useMutation({
		mutationFn: (vacationId: string) =>
			drievrsService.returnFromVacation(vacationId),
		onSuccess: (res) => {
			toast.success(t(res.data.message || "تم عودة السواق بنجاح"));
			queryClient.invalidateQueries({ queryKey: ["drivers"] });
		},
		onError: (err) => {
			const msg = isAxiosError(err)
				? err.response?.data?.message
				: "حدث خطأ أثناء العودة من الإجازة";
			toast.error(t(msg));
		},
	});
}
