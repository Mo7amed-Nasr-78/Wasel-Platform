import { shipmentsService } from "@/api/services/shipments.service";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import { isAxiosError } from "axios";

export function useShipment(id: string | undefined) {
	const { t } = useTranslation();

	return useQuery({
		queryKey: ["shipment", id],
		queryFn: () => shipmentsService.getShipment(id),

		onError: (error) => {
            const message = isAxiosError(error)
				? error.response?.data?.message
				: "تعذر تحميل الحمولة";

			toast.error(t(message || "تعذر تحميل الحمولة"));
        }
	});
}
