import { useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import { userService } from "@/api/services/user.service";
import { isAxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { useProps } from "@/components/PropsProvider";

export function useUpdateUser() {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const { user, setUser } = useProps();

	return useMutation({
		mutationKey: ["update-user"],
		mutationFn: (data: FormData) => userService.updateUser(data),
		onSuccess: (res) => {
			const updatedProfile = res.data?.profile;
			if (updatedProfile && user) {
				setUser({ ...user, ...updatedProfile });
			}
			toast.success(t(res.data?.message || "تم تحديث الملف الشخصي بنجاح"));
			if (updatedProfile?.username) {
				navigate(`/profile/${updatedProfile.username}`);
			}
		},
		onError: (error) => {
			const message = isAxiosError(error)
				? error.response?.data?.message
				: "تعذر تحديث الملف الشخصي";

			toast.error(t(message || "تعذر تحديث الملف الشخصي"));
		},
	});
}
