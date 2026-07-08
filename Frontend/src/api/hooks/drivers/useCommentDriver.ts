import { useMutation, useQueryClient } from "@tanstack/react-query";
import { drievrsService } from "@/api/services/drivers.service";
import { isAxiosError } from "axios";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

export function useCommentDriver() {
	const queryClient = useQueryClient();
	const { t } = useTranslation();

	return useMutation({
		mutationFn: async ({
			driverId,
			comment,
		}: {
			driverId: string;
			comment: string;
		}) => {
			const response = await drievrsService.commentDriver(
				driverId,
				comment,
			);
			return response as { data?: { message?: string } };
		},
		onSuccess: (res) => {
			toast.success(
				t(res.data?.message || "تم إرسال التعليق بنجاح"),
			);
			queryClient.invalidateQueries({ queryKey: ["drivers"] });
		},
		onError: (err) => {
			const axiosMsg = isAxiosError(err)
				? err.response?.data?.message
				: "حدث خطأ أثناء إرسال التعليق";
			toast.error(t(axiosMsg));
		},
	});
}
