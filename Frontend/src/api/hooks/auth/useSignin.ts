import { privateHttpClient } from "@/api/client/HttpClient"
import { authService } from "@/api/services/auth.service"
import { useMutation } from "@tanstack/react-query"
import toast from "react-hot-toast"
import { isAxiosError } from "axios"
import { useTranslation } from "react-i18next"
import { useCurrentUser } from "../user/useCurrentUser"
import { useProps } from "@/components/PropsProvider"

export function useSignin() {
    const { t } = useTranslation();
    // const navigate = useNavigate();
    const { mutate: currentUser } = useCurrentUser();
    const { setIsLoading } = useProps();

    return useMutation({
        mutationKey: ["signin"],
        mutationFn: (data: { email: string; password: string }) => authService.signin(data),

        onSuccess: async (res) => {
            privateHttpClient.setAccessToken(res.data.accessToken);
            setIsLoading(true);
            currentUser()
        },

        onError: (err) => {
            const axiosMeg = isAxiosError(err)
				? err?.response?.data?.message
				: "شء ما حدث خطا";
			toast.error(t(axiosMeg));
        }
    })
}