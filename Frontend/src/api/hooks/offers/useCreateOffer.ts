import { offerService } from "@/api/services/offer.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

export function useCreateOffer(shipmentId: string | undefined, data: { price: string | number, proposal: string }) {
    const queryClient = useQueryClient();
    const { t } = useTranslation();

    return (
        useMutation({
            mutationKey: ["newOffer"],
            mutationFn: () => (offerService.sendOffer(shipmentId, data)),

            onSuccess: (res) => {
                queryClient.invalidateQueries({ queryKey: ["allOffers"] })
                toast.success(t(res.data?.message) || t("تم إرسال عرض بنجاح"))
            },

            onError: (error) => {
                const message = isAxiosError(error)
                    ? error.response?.data?.message
                    : "تعذر حذف الحمولة";
    
                toast.error(t(message || "تعذر حذف الحمولة"));
            }
        })
    )
}