import { useQuery } from "@tanstack/react-query";
import { userService } from "@/api/services/user.service";
import type { ShipmentFilter } from "@/shared/interfaces/Interfaces";

export function useUserShipments(query?: ShipmentFilter) {
	const queryParams = query && Object.fromEntries(
		Object.entries(query).filter(([, value]) => {
			if (Array.isArray(value)) return value.length > 0;
			return Boolean(value);
		}),
	);

	return useQuery({
		queryKey: ["userShipments", query],
		queryFn: () => userService.userShipments(queryParams),
		retry: false,
	});
}