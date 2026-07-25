import { userService } from "@/api/services/user.service";
import { useQuery } from "@tanstack/react-query";
import type { ShipmentFilter } from "@/shared/interfaces/Interfaces";

function cleanFilters(filters: ShipmentFilter): Record<string, unknown> {
	const params: Record<string, unknown> = {};
	if (filters.search) params.search = filters.search;
	if (filters.type) params.type = filters.type;
	if (filters.urgent) params.urgent = filters.urgent;
	if (filters.status.length > 0) params.status = filters.status;
	if (filters.minWeight !== undefined) params.minWeight = filters.minWeight;
	if (filters.maxWeight !== undefined) params.maxWeight = filters.maxWeight;
	if (filters.pickupAt) params.pickupAt = filters.pickupAt;
	if (filters.deliveryAt) params.deliveryAt = filters.deliveryAt;
	return params;
}

export function useUserShipments(filters?: ShipmentFilter) {
    const params = filters ? cleanFilters(filters) : undefined;
    return (
            useQuery({
            queryKey: ["userShipments", params],
            queryFn: () => userService.userShipments(params),
            retry: false
        })
    )
}