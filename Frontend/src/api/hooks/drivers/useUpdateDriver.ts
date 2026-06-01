import { useMutation } from "@tanstack/react-query";
import { drievrsService } from "@/api/services/drivers.service";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

export function useUpdateDriver() {
    const queryClient = useQueryClient();
    const { t } = useTranslation();

    return useMutation({
        mutationFn: (variables: { driverId: string, data: FormData }) => drievrsService.updateDriver(variables.driverId, variables.data),

        onSuccess: (res) => {
            toast.success(t(res.data.message));
            queryClient.invalidateQueries({ queryKey: ["drivers"] });
        }
    })
}