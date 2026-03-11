import { useQueryClient, useMutation } from "@tanstack/react-query";
import { shipmentsService } from "@/api/services/shipments.services";

export function useCreateShipment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (newShipment: FormData) => {
            return shipmentsService.createShipment(newShipment);
        },

        onSuccess: () => { 
            queryClient.invalidateQueries({ queryKey: ["shipments"] })
        }
    });
}