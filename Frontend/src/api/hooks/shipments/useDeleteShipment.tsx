import { useMutation } from "@tanstack/react-query";
import { shipmentsService } from "@/api/services/shipments.service";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import { isAxiosError } from "axios";

export function useDeleteShipment() {
    const { t } = useTranslation();

    return useMutation({
        mutationKey: ["deleteShipment"],
        mutationFn: (id: string) => shipmentsService.deleteShipment(id),

        onSuccess: (res) => {
            toast.success(t(res.data?.message) || "تم حذف الحمولة بنجاح")
        },

        onError: (error) => {
            const message = isAxiosError(error)
				? error.response?.data?.message
				: "تعذر حذف الحمولة";

			toast.error(t(message || "تعذر حذف الحمولة"));
        }
    })
}