import { useQuery } from "@tanstack/react-query";
import { trucksService } from "@/api/services/trucks.service";
import { isAxiosError } from "axios";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

export function useTrucks() {
    const { t } = useTranslation();

    return useQuery({
        queryKey: ['trucks'],
        queryFn: () => trucksService.getTrucks(),

        onError: (err) => {
            const axiosMeg = isAxiosError(err) ? err.response?.data?.message : "شئ ما حدث خطأ";
            toast.error(t(axiosMeg));
        }
    })
}