import { useMutation, useQueryClient } from "@tanstack/react-query";
import { trucksService } from "@/api/services/trucks.service";
import { isAxiosError } from "axios";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

export function useCommentTruck() {
	const queryClient = useQueryClient();
	const { t } = useTranslation();

	return useMutation({
		mutationFn: async ({
			truckId,
			comment,
		}: {
			truckId: string;
			comment: string;
		}) => {
			const response = await trucksService.commentTruck(
				truckId,
				comment,
			);
			return response as { data?: { message?: string } };
		},
		onSuccess: (res) => {
			toast.success(
				t(res.data?.message || "تم إرسال التعليق بنجاح"),
			);
			queryClient.invalidateQueries({ queryKey: ["trucks"] });
		},
		onError: (err) => {
			const axiosMsg = isAxiosError(err)
				? err.response?.data?.message
				: "حدث خطأ أثناء إرسال التعليق";
			toast.error(t(axiosMsg));
		},
	});
}
