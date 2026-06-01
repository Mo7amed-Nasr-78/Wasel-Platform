import { offerService } from "@/api/services/offer.service"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { isAxiosError } from "axios";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

export function useRejectOffer()  {
    const queryClient = useQueryClient();
    const { t } = useTranslation();

    return (
        useMutation({
            mutationKey: ["rejectOffer"],
            mutationFn: (offerId: string) => (offerService.rejectOffer(offerId)),

            onSuccess: (res) => {
                toast.success(t(res.data.message || "تم رفض العرض"));
                queryClient.invalidateQueries({ queryKey: ["shipmentOffers"] })
                queryClient.invalidateQueries({ queryKey: ["recentOffer"] })
            },

            onError: (err) => {
                const axiosMeg = isAxiosError(err) ? err.response?.data?.message : "شئ ما حدث خطأ";
                toast.error(t(axiosMeg))
            }
        })
    )
}