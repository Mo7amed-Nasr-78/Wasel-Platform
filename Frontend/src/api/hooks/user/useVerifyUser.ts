import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userService } from "@/api/services/user.service";
import { isAxiosError } from "axios";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

export function useVerifyUser() {
	const queryClient = useQueryClient();
	const { t } = useTranslation();

	return useMutation({
		mutationFn: async (userId: string) => {
			const response = await userService.verifyUser(userId);
			return response as { data?: { message?: string } };
		},
		onSuccess: (res) => {
			toast.success(
				t(
					res.data?.message ||
						"تمت المصادقة على المستخدم بنجاح",
				),
			);
			queryClient.invalidateQueries({ queryKey: ["users"] });
		},
		onError: (err) => {
			const axiosMsg = isAxiosError(err)
				? err.response?.data?.message
				: "حدث خطأ أثناء مصادقة المستخدم";
			toast.error(t(axiosMsg));
		},
	});
}
