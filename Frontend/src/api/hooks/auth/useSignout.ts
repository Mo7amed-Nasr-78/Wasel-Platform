import { authService } from "@/api/services/auth.service";
import { useMutation } from "@tanstack/react-query";
import { useProps } from "@/components/PropsProvider";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import { isAxiosError } from "axios";
import { privateHttpClient } from "@/api/client/HttpClient";

export function useSignout() {
    const { setUser, setIsLoading } = useProps();
    const navigate = useNavigate();
    const { t } = useTranslation();

    return (
        useMutation({
            mutationKey: ["signout"],
            mutationFn: () => authService.signout(),

            onSuccess: (res) => {
                setUser(null);
                setIsLoading(false);
                privateHttpClient.accessToken = null;
                privateHttpClient.accessTokenExp = 0
                navigate("/");
                toast.success(t(res.data?.message) || "تم تسجيل الخروج بنجاح");
            },

            onError: (err) => {
                const axiosMeg = isAxiosError(err)
                    ? err?.response?.data?.message
                    : "شء ما حدث خطا";
                toast.error(t(axiosMeg));
            }
        })
    )
}