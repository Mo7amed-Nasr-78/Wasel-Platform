import { useMutation } from "@tanstack/react-query";
import { userService } from "@/api/services/user.service";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useProps } from "@/components/PropsProvider";
import { isAxiosError } from "axios";
import { useNavigate } from "react-router-dom";

export function useCurrentUser() {
    const { t } = useTranslation();
    const { setUser, setIsLoading } = useProps();
    const navigate = useNavigate();


    return useMutation({
        mutationKey: ["currentUser"],
        mutationFn: () => userService.me(),

        onSuccess: (res) => {
            const currentUser = res.data;
            if (currentUser) {
                setUser(currentUser);
                setIsLoading(false);
                const currentPage = window.location.pathname;
                if (currentPage.includes("/signin")) {
                    navigate('/shipments');
                }
            }
        },

        onError: (error) => {
            const message = isAxiosError(error)
				? error.response?.data?.message
				: "تعذر تحديث الملف الشخصي";

			toast.error(t(message || "تعذر تحديث الملف الشخصي"));
        }
    })
}