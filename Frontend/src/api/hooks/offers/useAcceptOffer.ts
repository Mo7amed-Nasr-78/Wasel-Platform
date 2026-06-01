import { offerService } from "@/api/services/offer.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

export function useAcceptOffer() {
    const queryClient = useQueryClient();
    const { t } = useTranslation();

    return (
        useMutation({
            mutationKey: ["acceptOffer"],
            mutationFn: (offerId: string) => (offerService.acceptOffer(offerId)),

            onSuccess: (res) => {
                toast.success(t(res.data.message || "تم قبول العرض"))
                queryClient.invalidateQueries({ queryKey: ["shipmentOffers"] })
            },

            onError: (err) => {
                const axiosMeg = isAxiosError(err) ? err.response?.data?.message : "شئ ما حدث خطأ";
                toast.error(t(axiosMeg))
            }
        })
    )
}